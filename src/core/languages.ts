import { githubGraphQL } from "../api/api.js";
import { UserLangStat } from "../types/types.js";

export const getGitHubLanguages = async (
  username: string,
  token?: string
): Promise<UserLangStat[]> => {

    let repos: {
    name: string;
    languages: { edges: { size: number; node: { name: string } }[] };
  }[] = [];
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
                  node { name }
                }
              }
            }
          }
        }
      }
    `;
    const variables: Record<string, any> = { login: username };
    if (endCursor) variables.after = endCursor;

    const data = await githubGraphQL<{
      user: {
        repositories: {
          pageInfo: { hasNextPage: boolean; endCursor: string };
          nodes: {
            name: string;
            languages: { edges: { size: number; node: { name: string } }[] };
          }[];
        };
      };
    }>(repoQuery, variables, token);

    const page = data.user.repositories;
    repos = repos.concat(page.nodes);
    hasNextPage = page.pageInfo.hasNextPage;
    endCursor = page.pageInfo.endCursor;
  }

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

  const result: UserLangStat[] = Object.entries(languageBytes)
    .map(([lngName, bytes]) => ({
      lngName,
      coverage: totalBytes ? +((100 * bytes) / totalBytes).toFixed(1) : 0,
      repos: reposPerLanguage[lngName] || 0
    }))
    .sort((a, b) => b.coverage - a.coverage);

  return result;
};
