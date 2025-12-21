import { throwError } from "../utils/error.js";
import { githubGraphQL } from "../api/api.js";
import { GitHubRepo } from "../types/types.js";

const PINNED_REPOS_QUERY = `
  query($username: String!) {
    user(login: $username) {
      pinnedItems(first: 6, types: [REPOSITORY]) {
        nodes {
          ... on Repository {
            name
            nameWithOwner
            description
            stargazerCount
            forkCount
            isPrivate
            createdAt
            url
            owner { login }
            primaryLanguage {
              name
              color
            }
            issues(states: OPEN) { totalCount }
          }
        }
      }
    }
  }
`;

const REPO_QUERY = `
  query($username: String!, $cursor: String) {
    user(login: $username) {
      repositories(
        first: 100, 
        after: $cursor, 
        ownerAffiliations: [OWNER, ORGANIZATION_MEMBER, COLLABORATOR],
        orderBy: { field: STARGAZERS, direction: DESC }
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          name
          nameWithOwner
          description
          stargazerCount
          forkCount
          isPrivate
          createdAt
          url
          owner { login }
          primaryLanguage {
              name
              color
          }
          issues(states: OPEN) { totalCount }
        }
      }
    }
  }
`;

interface RepoType {
  name: string;
  nameWithOwner: string;
  description: string | null;
  stargazerCount: number;
  forkCount: number;
  isPrivate: boolean;
  createdAt: string;
  url: string;
  owner: { login: string };
  primaryLanguage: { name: string; color: string } | null;
  issues: { totalCount: number };
}

interface GitHubGraphqlResponse {
  user: {
    repositories: {
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
      nodes: Array<RepoType>;
    };
  };
}

interface PinnedReposResponse {
  user: {
    pinnedItems: {
      nodes: Array<RepoType>;
    };
  };
}

export const getAllRepos = async (
  username: string,
  token?: string
): Promise<GitHubRepo[]> => {
  const allRepos: GitHubRepo[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  while (hasNextPage) {
    try {
      const result: GitHubGraphqlResponse =
        await githubGraphQL<GitHubGraphqlResponse>(
          REPO_QUERY,
          { username, cursor },
          token
        );

      const mappedRepos: GitHubRepo[] = result.user.repositories.nodes.map(
        (repo: RepoType) => ({
          name: repo.name,
          full_name: repo.nameWithOwner,
          owner: repo.owner.login,
          description: repo.description ?? "",
          stargazers_count: repo.stargazerCount,
          forks: repo.forkCount,
          language: {
            name: repo.primaryLanguage?.name ?? "",
            color: repo.primaryLanguage?.color ?? ""
          },
          created_at: repo.createdAt,
          open_issues: repo.issues.totalCount,
          html_url: repo.url,
          url: repo.url,
          visibility: repo.isPrivate ? "private" : "public"
        })
      );

      allRepos.push(...mappedRepos);

      hasNextPage = result.user.repositories.pageInfo.hasNextPage;
      cursor = result.user.repositories.pageInfo.endCursor;
    } catch (error) {
      throwError(error);
    }
  }

  return allRepos;
};

export const getGitHubPinnedRepos = async (
  username: string,
  token?: string
): Promise<GitHubRepo[]> => {
  const result = await githubGraphQL<PinnedReposResponse>(
    PINNED_REPOS_QUERY,
    { username },
    token
  );

  if (!result?.user?.pinnedItems?.nodes) return [];

  return result.user.pinnedItems.nodes.map((repo) => ({
    name: repo.name,
    full_name: repo.nameWithOwner,
    owner: repo.owner.login,
    description: repo.description ?? "",
    stargazers_count: repo.stargazerCount,
    forks: repo.forkCount,
    language: {
      name: repo.primaryLanguage?.name ?? "",
      color: repo.primaryLanguage?.color ?? ""
    },
    created_at: repo.createdAt,
    open_issues: repo.issues.totalCount,
    html_url: repo.url,
    url: repo.url,
    visibility: repo.isPrivate ? "private" : "public"
  }));
};

export const getGitHubRepos = async (username: string, token?: string) => {
  const allFetchedRepos = await getAllRepos(username, token);
  const pinnedRepos = await getGitHubPinnedRepos(username, token);

  const userOwnedRepos = allFetchedRepos.filter(
    (repo) => repo.owner.toLowerCase() === username.toLowerCase()
  );

  const publicRepos = userOwnedRepos.filter(
    (repo) => repo.visibility === "public"
  );

  return {
    allRepos: userOwnedRepos,
    totalRepos: userOwnedRepos.length,
    starsEarned: userOwnedRepos.reduce(
      (acc, repo) => acc + repo.stargazers_count,
      0
    ),
    publicRepos: publicRepos.length,
    privateRepos: userOwnedRepos.length - publicRepos.length,
    orgRepos: allFetchedRepos.length - userOwnedRepos.length,
    pinnedRepos
  };
};
