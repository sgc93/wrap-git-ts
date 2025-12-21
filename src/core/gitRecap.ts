import {
  GitHubContribution,
  GitHubLanguage,
  GitHubProfile
} from "../types/types.js";
import { getGitHubYearlyCommits } from "./commits.js";
import {
  getGitHubYearlyActivityStats,
  getGitHubYearlyContributions
} from "./contributions.js";
import { getGitHubLanguagesByYear } from "./languages.js";
import { getGitHubUser } from "./profile.js";
import { getGitHubRepos } from "./repositories.js";

export interface RankStats {
  commits: number;
  stars: number;
  prs: number;
  issues: number;
  followers: number;
}

export interface UserRank {
  level: "S" | "A+" | "A" | "B" | "C";
  label: string;
  score: number;
  percentile: string;
}

export const calculateUniversalRank = (stats: RankStats): UserRank => {
  const score =
    stats.stars * 4 +
    stats.prs * 3 +
    stats.followers * 2 +
    stats.issues * 1 +
    stats.commits * 0.5;

  if (score >= 5000)
    return {
      level: "S",
      label: "Elite Architect",
      score,
      percentile: "Top 1%"
    };
  if (score >= 1500)
    return {
      level: "A+",
      label: "Master Contributor",
      score,
      percentile: "Top 10%"
    };
  if (score >= 600)
    return {
      level: "A",
      label: "Expert Developer",
      score,
      percentile: "Top 25%"
    };
  if (score >= 200)
    return { level: "B", label: "Active Coder", score, percentile: "Top 50%" };

  return {
    level: "C",
    label: "Rising Developer",
    score,
    percentile: "Average"
  };
};

export const getGitHubYearlyRecap = async (
  username: string,
  year: number,
  token?: string
) => {
  const profile: GitHubProfile = await getGitHubUser(username, token);
  const contributions = await getGitHubYearlyContributions(
    username,
    year,
    token
  );

  const activities = await getGitHubYearlyActivityStats(username, year, token);

  const langStats: {
    lngs: GitHubLanguage[];
    totalLngs: number;
    totalLOC: number;
  } = await getGitHubLanguagesByYear(username, year, token);

  const commits: number = await getGitHubYearlyCommits(username, 2025, token);
  const repos = await getGitHubRepos(username, token);

  const rank = calculateUniversalRank({
    commits,
    stars: repos.starsEarned,
    prs: activities.issues,
    issues: activities.pullRequests,
    followers: profile.followers.totalCount
  });

  return {
    year,
    profile,
    contributions,
    langStats,
    rank,
    starsEarned: repos.starsEarned,
    Commits: commits,
    activities: {
      issues: activities.issues,
      pullRequests: activities.pullRequests
    }
  };
};
