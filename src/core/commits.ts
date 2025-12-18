import { GitHubCommit } from "../types/types.js";
import { throwError, throwGitError } from "../utils/error.js";

export const getCommitsBetween = async (
  username: string,
  year: number,
  token?: string
) => {
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;
  const url = `https://api.github.com/search/commits?q=author:${username}+author-date:${startDate}..${endDate}`;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.cloak-preview+json"
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw throwGitError(
        response.status,
        `GitHub API returned status ${response.status}`
      );
    }
    const data = await response.json();
    return typeof data.total_count === "number" ? data.total_count : 0;
  } catch (err) {
    throwError(err);
  }
};

export const getGitHubCommits = async (
  username: string,
  startYear: number,
  token?: string
): Promise<GitHubCommit> => {
  const currentYear = new Date().getFullYear();

  const yearPromises = [];
  for (let year = startYear; year <= currentYear; year++) {
    yearPromises.push(getCommitsBetween(username, year, token));
  }

  const yearlyCounts = await Promise.all(yearPromises);

  const commitsPerYear: { year: number; count: number }[] = [];
  let totalCommits = 0;
  for (let i = 0; i < yearlyCounts.length; i++) {
    const year = startYear + i;
    const count = yearlyCounts[i];
    commitsPerYear.push({ year, count });
    totalCommits += count;
  }

  return {
    totalCommits,
    commitsPerYear
  };
};
