import { throwErrorMessage } from "../utils/format.js";

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
      throw throwErrorMessage(response.status, message);
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
      type,
      blog,
      email,
      hireable,
      public_repos,
      public_gists,
      followers,
      following
    } = data;

    return {
      success: true,
      profile: {
        id,
        username: login,
        name,
        bio,
        location,
        company,
        avatarUrl: avatar_url,
        created_at,
        updated_at,
        url: html_url,
        type,
        blogUrl: blog,
        email,
        hireable,
        followers,
        following,
        publicRepos: public_repos,
        publicGists: public_gists
      }
    };
  } catch (error) {
    throwErrorMessage(500, (error as Error).message);
  }
};
