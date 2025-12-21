import { githubGraphQL } from "../api/api.js";
import { GitHubLanguage } from "../types/types.js";

interface LngDataResponseType {
  user: {
    repositories: {
      pageInfo: { hasNextPage: boolean; endCursor: string };
      nodes: {
        name: string;
        pushedAt: string;
        languages: {
          edges: { size: number; node: { name: string; color: string } }[];
        };
      }[];
    };
  };
}

interface LngRepoDataType {
  name: string;
  languages: {
    edges: { size: number; node: { name: string; color: string } }[];
  };
}

interface LngStatReturnType {
  lngs: GitHubLanguage[];
  totalLngs: number;
  totalLOC: number;
}

const languageWeights: Record<string, number> = {
  python: 32,
  rub: 32,
  c: 35,
  javascript: 45,
  typescript: 48, // TS tends to be slightly more verbose due to types
  java: 55,
  html: 60,
  css: 40
};

const estimateLOC = (bytes: number, lngName: string): number => {
  const bytesPerLine = languageWeights[lngName.toLowerCase()] || 45;
  return Math.round(bytes / bytesPerLine);
};

const processLanguageStats = (
  repos: LngRepoDataType[],
  sortBy: string
): LngStatReturnType => {
  const languageBytes: Record<string, number> = {};
  let totalBytes = 0;

  repos.forEach((repo) => {
    repo.languages.edges.forEach(({ size, node }) => {
      languageBytes[node.name] = (languageBytes[node.name] || 0) + size;
      totalBytes += size;
    });
  });

  const reposPerLanguage: Record<string, number> = {};
  repos.forEach((repo) => {
    if (!repo.languages.edges.length) return;
    const top = repo.languages.edges.reduce((a, b) =>
      a.size >= b.size ? a : b
    );
    const lng = top.node.name;
    reposPerLanguage[lng] = (reposPerLanguage[lng] || 0) + 1;
  });

  const result: GitHubLanguage[] = Object.entries(languageBytes)
    .map(([lngName, bytes]) => ({
      lngName,
      coverage: totalBytes ? +((100 * bytes) / totalBytes).toFixed(1) : 0,
      repos: reposPerLanguage[lngName] || 0,
      color: repos.filter(
        (repo) =>
          repo.languages.edges.filter((edge) => edge.node.name === lngName)[0]
      )[0].languages.edges[0].node.color,
      loc: estimateLOC(bytes, lngName)
    }))
    .sort((a, b) =>
      sortBy === "coverage" ? b.coverage - a.coverage : b.repos - a.repos
    );

  const totalLOC = result.reduce((sum, lng) => (sum += lng.loc), 0);

  return { lngs: result, totalLngs: result.length, totalLOC };
};

export const getGitHubLanguages = async (
  username: string,
  token?: string,
  sortBy: "repo_count" | "coverage" = "coverage"
): Promise<LngStatReturnType> => {
  let repos: LngRepoDataType[] = [];
  let hasNextPage = true;
  let endCursor: string | null = null;
  const PAGE_SIZE = 50;
  const LANGS_PER_REPO = 15;

  while (hasNextPage) {
    const repoQuery = `
      query($login: String!, $after: String) {
        user(login: $login) {
          repositories(first: ${PAGE_SIZE}, after: $after, ownerAffiliations: OWNER, isFork: false) {
            pageInfo { hasNextPage endCursor }
            nodes {
              name
              languages(first: ${LANGS_PER_REPO}) {
                edges {
                  size
                  node { name color}
                }
              }
            }
          }
        }
      }
    `;
    const variables: Record<string, any> = { login: username };
    if (endCursor) variables.after = endCursor;

    const data = await githubGraphQL<LngDataResponseType>(
      repoQuery,
      variables,
      token
    );

    const page = data.user.repositories;
    repos = repos.concat(page.nodes);
    hasNextPage = page.pageInfo.hasNextPage;
    endCursor = page.pageInfo.endCursor;
  }

  return processLanguageStats(repos, sortBy);
};

export const getGitHubLanguagesByYear = async (
  username: string,
  year: number,
  token?: string,
  sortBy: "repo_count" | "coverage" = "coverage"
): Promise<{ lngs: GitHubLanguage[]; totalLngs: number }> => {
  const since = `${year}-01-01T00:00:00Z`;
  const until = `${year}-12-31T23:59:59Z`;

  let repos: any[] = [];
  let hasNextPage = true;
  let endCursor: string | null = null;

  const PAGE_SIZE = 50;
  const LANGS_PER_REPO = 15;

  while (hasNextPage) {
    const repoQuery = `
      query($login: String!, $after: String, $since: GitTimestamp, $until: GitTimestamp) {
        user(login: $login) {
          repositories(
            first: ${PAGE_SIZE}, 
            after: $after, 
            ownerAffiliations: OWNER, 
            isFork: false,
            orderBy: {field: PUSHED_AT, direction: DESC}
          ) {
            pageInfo { hasNextPage endCursor }
            nodes {
              name
              pushedAt
              languages(first: ${LANGS_PER_REPO}) {
                edges {
                  size
                  node { name color }
                }
              }
              defaultBranchRef {
                target {
                  ... on Commit {
                    history(author: { emails: [$login] }, since: $since, until: $until) {
                      totalCount
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const data: LngDataResponseType = await githubGraphQL<LngDataResponseType>(
      repoQuery,
      { login: username, after: endCursor, since, until },
      token
    );

    const page = data.user.repositories;

    // Filter: Only keep repos that have commits in $year  -> >0 commits atleast
    const activeNodes = page.nodes.filter((repo: any) => {
      const hasCommits = repo.defaultBranchRef?.target?.history?.totalCount > 0;
      const pushedInYear = new Date(repo.pushedAt) >= new Date(since);
      return hasCommits || pushedInYear;
    });

    repos = repos.concat(activeNodes);
    hasNextPage = page.pageInfo.hasNextPage;
    endCursor = page.pageInfo.endCursor;

    // Break if we start seeing repos pushed before our target year
    const lastRepo = page.nodes[page.nodes.length - 1];
    if (lastRepo && new Date(lastRepo.pushedAt) < new Date(since)) {
      hasNextPage = false;
    }
  }

  return processLanguageStats(repos, sortBy);
};
