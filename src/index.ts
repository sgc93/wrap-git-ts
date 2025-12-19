import { getGitHubUser } from "./core/profile.js";
import { getGitHubCommits } from "./core/commits.js";
import { getGitHubLanguages } from "./core/languages.js";
import { getGitHubRepos, getGitHubPinnedRepos } from "./core/repositories.js";
import {
  getGitHubContributions,
  getGitHubContributionTypesPerYear,
  getGitHubYearlyContributions,
  getMonthlyContributions
} from "./core/contributions.js";

import {
  GitHubProfile,
  GitHubCommit,
  UserLangStat,
  GitHubRepo,
  GitHubContribution,
  MonthlyContribution
} from "./types/types.js";

export {
  getGitHubUser,
  getGitHubCommits,
  getGitHubContributions,
  getGitHubContributionTypesPerYear,
  getGitHubYearlyContributions,
  getGitHubLanguages,
  getGitHubRepos,
  getGitHubPinnedRepos,
  getMonthlyContributions
};

export type {
  GitHubProfile,
  GitHubCommit,
  UserLangStat,
  GitHubRepo,
  GitHubContribution,
  MonthlyContribution
};

export default {
  getGitHubUser,
  getGitHubCommits,
  getGitHubContributions,
  getGitHubContributionTypesPerYear,
  getGitHubYearlyContributions,
  getGitHubLanguages,
  getGitHubRepos,
  getGitHubPinnedRepos
};
