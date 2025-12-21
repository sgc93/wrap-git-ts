import { githubGraphQL } from "../api/api.js";
import { GitHubContribution, MonthlyContribution } from "../types/types.js";

export const getGitHubContributions = async (
  username: string,
  startYear: number,
  token?: string
): Promise<{
  totalContributions: number;
  contributionsPerYear: { year: string; count: number }[];
}> => {
  const contributionsPerYear: { year: string; count: number }[] = [];

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

const CONTRIBUTIONS_QUERY = `
  query($username: String!, $from: DateTime, $to: DateTime) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              color
            }
          }
        }
      }
    }
  }
`;

interface ContributionDay {
  contributionCount: number;
  date: string;
  color: string;
}

interface ContributionResponse {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: number;
        weeks: Array<{
          contributionDays: Array<ContributionDay>;
        }>;
      };
    };
  };
}

interface StreakData {
  count: number;
  startDate: string;
  endDate: string;
}

const calcStreakStats = (
  days: ContributionDay[]
): { longestStreak: StreakData; activeDays: number } => {
  let longestStreak: StreakData = { count: 0, startDate: "", endDate: "" };

  let tempStreak: StreakData = { count: 0, startDate: "", endDate: "" };

  // ensure chronological order
  const sortedDays = [...days].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const activeDays = sortedDays.filter(
    (day) => day.contributionCount > 0
  ).length;

  sortedDays.forEach((day) => {
    if (day.contributionCount > 0) {
      if (tempStreak.count === 0) {
        tempStreak.startDate = day.date;
      }
      tempStreak.count++;
      tempStreak.endDate = day.date;

      if (tempStreak.count > longestStreak.count) {
        longestStreak = { ...tempStreak };
      }
    } else {
      tempStreak = { count: 0, startDate: "", endDate: "" };
    }
  });

  return { longestStreak, activeDays };
};

const daysInWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const getEffectiveDay = (days: ContributionDay[], totalCommit: number) => {
  const weeklyCounts = new Array(7).fill(0);

  days.forEach((day) => {
    const dayIndex = new Date(day.date).getUTCDay();
    weeklyCounts[dayIndex] += day.contributionCount;
  });

  let maxCount = -1;
  let maxIndex = 0;

  weeklyCounts.forEach((count, index) => {
    if (count > maxCount) {
      maxCount = count;
      maxIndex = index;
    }
  });

  return {
    index: maxIndex,
    name: daysInWeek[maxIndex],
    contributionCounts: maxCount,
    percent:
      totalCommit > 0 ? Math.round((maxCount / totalCommit) * 1000) / 10 : 0,
    allDays: weeklyCounts.map((count, i) => ({ name: daysInWeek[i], count }))
  };
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const getEffectiveMonth = (days: ContributionDay[], totalCommit: number) => {
  const monthlyCounts = new Array(12).fill(0);
  days.forEach((day) => {
    const monthlyIndex = new Date(day.date).getUTCMonth();
    monthlyCounts[monthlyIndex] += day.contributionCount;
  });

  let maxCount = -1;
  let maxIndex = 0;

  monthlyCounts.forEach((count, index) => {
    if (count > maxCount) {
      maxCount = count;
      maxIndex = index;
    }
  });

  return {
    index: maxIndex,
    name: monthNames[maxIndex],
    contributionCounts: maxCount,
    percent:
      totalCommit > 0 ? Math.round((maxCount / totalCommit) * 1000) / 10 : 0,
    allMonths: monthlyCounts.map((count, index) => ({
      name: monthNames[index],
      count,
      percent:
        totalCommit > 0 ? Math.round((count / totalCommit) * 1000) / 10 : 0
    }))
  };
};

export const getMonthlyContributions = (
  days: ContributionDay[],
  totalCommit: number
): MonthlyContribution[] => {
  const monthlyCounts = new Array(12).fill(0);
  days.forEach((day) => {
    const monthlyIndex = new Date(day.date).getUTCMonth();
    monthlyCounts[monthlyIndex] += day.contributionCount;
  });

  return monthlyCounts.map((count, index) => ({
    index,
    name: monthNames[index],
    contributionCounts: count,
    percent: totalCommit > 0 ? Math.round((count / totalCommit) * 1000) / 10 : 0
  }));
};

export const getGitHubYearlyContributions = async (
  username: string,
  year: number,
  token?: string
): Promise<GitHubContribution> => {
  const from = `${year}-01-01T00:00:00Z`;
  const to = `${year}-12-31T23:59:59Z`;

  const result = await githubGraphQL<ContributionResponse>(
    CONTRIBUTIONS_QUERY,
    { username, from, to },
    token
  );

  const calendar = result.user.contributionsCollection.contributionCalendar;

  const dailyData = calendar.weeks.flatMap((week) => week.contributionDays);

  const streakStats = calcStreakStats(dailyData);
  const effectiveMonth = getEffectiveMonth(
    dailyData,
    calendar.totalContributions
  );
  const effectiveDay = getEffectiveDay(dailyData, calendar.totalContributions);

  return {
    year,
    totalContributions: calendar.totalContributions,
    days: dailyData,
    streakStats,
    effectiveMonth,
    effectiveDay
  };
};


interface ActivityStats {
  pullRequests: number;
  issues: number;
  year: number;
}

export const getGitHubYearlyActivityStats = async (
  username: string,
  year: number,
  token?: string
): Promise<ActivityStats> => {
  const dateRange = `${year}-01-01..${year}-12-31`;

  const prQueryString = `author:${username} created:${dateRange} type:pr`;
  const issueQueryString = `author:${username} created:${dateRange} type:issue`;

  const query = `
    query($prQuery: String!, $issueQuery: String!) {
      totalPRs: search(query: $prQuery, type: ISSUE, first: 0) {
        issueCount
      }
      totalIssues: search(query: $issueQuery, type: ISSUE, first: 0) {
        issueCount
      }
    }
  `;

  const data = await githubGraphQL<{
    totalPRs: { issueCount: number };
    totalIssues: { issueCount: number };
  }>(query, { prQuery: prQueryString, issueQuery: issueQueryString }, token);

  return {
    pullRequests: data.totalPRs.issueCount,
    issues: data.totalIssues.issueCount,
    year
  };
};