import { ProfileType } from "../types/ProfileType.js";
import { throwError, throwGitError } from "../utils/error.js";

export const getUserProfile = async (username: string, token?: string) => {
  const url = `https://api.github.com/users/${username}`;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.cloak-preview+json"
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      const message = `GitHub API returned status ${response.status}`;
      throw throwGitError(response.status, message);
    }

    const data = await response.json();

    const {
      login,
      name,
      bio,
      location,
      company,
      avatar_url,
      created_at,
      updated_at,
      id,
      html_url,
      blog,
      email,
      hireable,
      public_repos,
      public_gists,
      followers,
      following,
      twitter_username
    } = data;

    const profile: ProfileType = {
      id,
      username: login,
      name,
      bio,
      location,
      company,
      avatar_url: avatar_url,
      created_at,
      updated_at,
      html_url: html_url,
      blog: blog,
      email,
      hireable,
      followers,
      following,
      twitter_username,
      public_repos: public_repos,
      public_gists: public_gists
    };

    return profile;
  } catch (error) {
    throwError(error);
  }
};
