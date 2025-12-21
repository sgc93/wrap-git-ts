import { GitHubLanguage, GitHubProfile } from "../types/types.js";
import { getGitHubYearlyCommits } from "./commits.js";
import {
  getGitHubActivityStats,
  getGitHubYearlyContributions
} from "./contributions.js";
import { getGitHubLanguagesByYear } from "./languages.js";
import { getGitHubUser } from "./profile.js";
import { calculateGitHubRank } from "./rank.js";
import { getGitHubRepos } from "./repositories.js";

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

  const langStats: {
    lngs: GitHubLanguage[];
    totalLngs: number;
    totalLOC: number;
  } = await getGitHubLanguagesByYear(username, year, token);

  const commits: number = await getGitHubYearlyCommits(username, 2025, token);
  const repos = await getGitHubRepos(username, token);

  const activities = await getGitHubActivityStats(username, year, token, true);

  const rank = calculateGitHubRank({
    commits,
    stars: repos.starsEarned,
    prs: activities.issues,
    reviews: activities.reviews,
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
