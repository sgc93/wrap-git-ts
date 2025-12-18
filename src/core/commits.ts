import { githubGraphQL } from "../api/api.js";

export const getGitHubCommits = async (
  username: string,
  startYear: number,
  token?: string
) => {
  const commitsPerYear: { year: number; count: number }[] = [];
  let totalCommits = 0;

  // 1. total commits since $startYear
  const totalQuery = `
      query($login: String!) {
        user(login: $login) {
          contributionsCollection {
            totalCommitContributions
          }
        }
      }
    `;
  const totalData = await githubGraphQL<{
    user: { contributionsCollection: { totalCommitContributions: number } };
  }>(totalQuery, { login: username }, token);

  totalCommits =
    totalData.user.contributionsCollection.totalCommitContributions;

  // 2. commit counts per each year since $startYear
  const currentYear = new Date().getFullYear();

  const yearQuery = `
      query ($login: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $login) {
          contributionsCollection(from: $from, to: $to) {
            totalCommitContributions
          }
        }
      }`;

  for (let year = startYear; year <= currentYear; year++) {
    const from = `${year}-01-01T00:00:00Z`;
    const to = `${year}-12-31T23:59:59Z`;
    const yearData = await githubGraphQL<{
      user: { contributionsCollection: { totalCommitContributions: number } };
    }>(yearQuery, { login: username, from, to }, token);
    commitsPerYear.push({
      year,
      count: yearData.user.contributionsCollection.totalCommitContributions
    });
  }

  return {
    totalCommits,
    commitsPerYear
  };
};
