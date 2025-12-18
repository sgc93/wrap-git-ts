import { githubGraphQL } from "../api/api.js";

export const getGitHubContributions = async (
  username: string,
  startYear: number,
  token?: string
): Promise<{
  totalContributions: number;
  contributionsPerYear: { year: string; count: number }[];
}> => {
  const contributionsPerYear: { year: string; count: number }[] = [];

  // 2. contributions per each year since $startYear
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
    const to =
      year === currentYear
        ? new Date().toISOString()
        : `${year}-12-31T23:59:59Z`;

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

  const totalContributions = contributionsPerYear.reduce(
    (sum, item) => sum + item.count,
    0
  );

  return {
    totalContributions,
    contributionsPerYear
  };
};


type PerTypeYearContributions = {
  year: number;
  commits: number;
  pullRequests: number;
  reviews: number;
  issues: number;
};

export const getGitHubContributionTypesPerYear = async (
  username: string,
  startYear: number,
  token?: string
): Promise<PerTypeYearContributions[]> => {
  const contributionsPerYear: PerTypeYearContributions[] = [];
  const currentYear = new Date().getFullYear();

  const yearQuery = `
    query ($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          totalCommitContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
          totalIssueContributions
        }
      }
    }
  `;

  for (let year = startYear; year <= currentYear; year++) {
    const from = `${year}-01-01T00:00:00Z`;
    const to =
      year === currentYear
        ? new Date().toISOString()
        : `${year}-12-31T23:59:59Z`;

    const yearData = await githubGraphQL<{
      user: {
        contributionsCollection: {
          totalCommitContributions: number;
          totalPullRequestContributions: number;
          totalPullRequestReviewContributions: number;
          totalIssueContributions: number;
        };
      };
    }>(yearQuery, { login: username, from, to }, token);

    const cc = yearData.user.contributionsCollection;

    contributionsPerYear.push({
      year,
      commits: cc.totalCommitContributions,
      pullRequests: cc.totalPullRequestContributions,
      reviews: cc.totalPullRequestReviewContributions,
      issues: cc.totalIssueContributions
    });
  }

  return contributionsPerYear;
};