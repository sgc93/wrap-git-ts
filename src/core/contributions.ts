import { githubGraphQL } from "../api/api.js";

export const getGitHubContributions = async (
  username: string,
  startYear: number,
  token?: string
) => {
  const contributionsPerYear: { year: string; count: number }[] = [];
  let totalContributions = 0;

  // 1. all-time contributions since $startYear
  const totalQuery = `
      query($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
            }
          }
        }
      }
    `;
  const totalData = await githubGraphQL<{
    user: {
      contributionsCollection: {
        contributionCalendar: { totalContributions: number };
      };
    };
  }>(totalQuery, { login: username }, token);
  totalContributions =
    totalData.user.contributionsCollection.contributionCalendar
      .totalContributions;

  // 2. contributions per year since $startYear
  const currentYear = new Date().getFullYear();

  const yearQuery = `
      query ($login: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $login) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
            }
          }
        }
      }
    `;

  for (let year = startYear; year <= currentYear; year++) {
    const from = `${year}-01-01T00:00:00Z`;
    const to = `${year}-12-31T23:59:59Z`;
    const yearData = await githubGraphQL<{
      user: {
        contributionsCollection: {
          contributionCalendar: { totalContributions: number };
        };
      };
    }>(yearQuery, { login: username, from, to }, token);
    contributionsPerYear.push({
      year: year.toString(),
      count:
        yearData.user.contributionsCollection.contributionCalendar
          .totalContributions
    });
  }

  return {
    totalContributions,
    contributionsPerYear
  };
};
