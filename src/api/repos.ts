import { throwErrorMessage } from "../utils/format";
import { sortReposByStars } from "../utils/sort";

export const getAllRepos = async (username: string, token?: string) => {
  try {
    const repos = [];
    let page = 1;
    let fetching = true;
    const url = `https://api.github.com/${
      token ? "user/repos" : `users/${username}/repos?page=${page}&per_page=100`
    }`;

    const headers: Record<string, string> = {
      Accept: "application/vnd.github.cloak-preview+json"
    };

    if (token) headers.Authorization = `Bearer ${token}`;

    while (fetching) {
      try {
        const response = await fetch(url, { headers });

        if (!response.ok) {
          const message = `GitHub API returned status ${response.status}`;
          throw throwErrorMessage(response.status, message);
        }

        const data = await response.json();

        repos.push(...data);

        if (data.length < 100) {
          fetching = false;
        } else {
          page++;
        }
      } catch (error) {
        fetching = false;
        console.log(error)
      }
    }

    return {
      success: true,
      data: { repos: sortReposByStars(repos) }
    };
  } catch (error) {
    console.log(error);
  }
};
