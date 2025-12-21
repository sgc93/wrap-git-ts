import { GitHubProfile } from "../types/types.js";
import { githubGraphQL } from "../api/api.js";

const userDataQuery = `
query GetProfile($login: String!) {
  user(login: $login) {
    name
    login
    bio
    avatarUrl
    company
    location
    email
    followers {
      totalCount
    }
    following {
      totalCount
    }
    starredRepositories {
      totalCount
    }
    repositories {
      totalCount
    }
    createdAt
  }
}`;

export const getGitHubUser = async (
  username: string,
  token?: string
): Promise<GitHubProfile> => {
  const data = await githubGraphQL<{ user: GitHubProfile }>(
    userDataQuery,
    { login: username },
    token
  );

  return data.user;
};
