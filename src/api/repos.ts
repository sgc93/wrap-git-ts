import { throwError, throwGitError } from "../utils/error.js";

export const getAllRepos = async (username: string, token?: string) => {
  const repos = [];
  let page = 1;
  let fetching = true;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.cloak-preview+json"
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  while (fetching) {
    const url = token
      ? `https://api.github.com/user/repos?per_page=100&page=${page}`
      : `https://api.github.com/users/${username}/repos?per_page=100&page=${page}`;

    try {
      const response = await fetch(url, { headers });

      if (!response.ok) {
        const message = `GitHub API returned status ${response.status}`;
        throw throwGitError(response.status, message);
      }

      const data = await response.json();
      repos.push(
        ...data.map((repo: any) => ({
          name: repo.name,
          full_name: repo.full_name,
          owner: repo.owner?.login ?? "",
          description: repo.description,
          stargazers_count: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language,
          updated_at: repo.updated_at,
          created_at: repo.created_at,
          open_issues: repo.open_issues_count,
          html_url: repo.html_url,
          url: repo.url,
          languages_url: repo.languages_url
        }))
      );

      if (data.length < 100) {
        fetching = false;
      } else {
        page++;
      }
    } catch (error) {
      throwError(error);
    }
  }

  return repos;
};

export const getRepoLngs = async (repoUrl: string, token?: string) => {
  const url = `${repoUrl}/languages`;

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

    return data;
  } catch (error) {
    throwError(error);
  }
};
