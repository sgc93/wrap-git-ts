import { GitHubProfile } from "../types/types.js";
import { githubGraphQL } from "./api.js";

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

export const getUserProfile = async (
  usernae: string,
  token?: string
): Promise<GitHubProfile> => {
  const profileData = await githubGraphQL(
    userDataQuery,
    { login: usernae },
    token
  );

  return profileData as GitHubProfile;
};
