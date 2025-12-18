import { githubGraphQL } from "../api/api.js";
import { GitHubCommit } from "../types/types.js";

function getEndOfYearISO(year: number): string {
  return `${year}-12-31T23:59:59Z`;
}

function getStartOfYearISO(year: number): string {
  return `${year}-01-01T00:00:00Z`;
}

export const getGitHubCommits = async (
  username: string,
  startYear: number,
  token?: string
): Promise<GitHubCommit> => {
  const commitsPerYear: { year: number; count: number }[] = [];

  // commit counts per each year since $startYear
  const currentYear = new Date().getFullYear();

  const yearQuery = `
    query ($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          totalCommitContributions
        }
      }
    }
  `;

  for (let year = startYear; year <= currentYear; year++) {
    const from = getStartOfYearISO(year);
    const to =
      year === currentYear ? new Date().toISOString() : getEndOfYearISO(year);

    const yearData = await githubGraphQL<{
      user: { contributionsCollection: { totalCommitContributions: number } };
    }>(yearQuery, { login: username, from, to }, token);

    commitsPerYear.push({
      year,
      count: yearData.user.contributionsCollection.totalCommitContributions
    });
  }

  const totalCommits = commitsPerYear.reduce(
    (sum, item) => sum + item.count,
    0
  );

  return {
    totalCommits,
    commitsPerYear
  };
};
