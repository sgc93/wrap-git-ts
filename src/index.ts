import { getGitHubUser } from "./core/profile.js";
import { getGitHubCommits } from "./core/commits.js";
import { getGitHubLanguages } from "./core/languages.js";
import { getGitHubRepos, getGitHubPinnedRepos } from "./core/repositories.js";
import {
  getGitHubContributions,
  getGitHubContributionTypesPerYear,
  getGitHubYearlyContributions
} from "./core/contributions.js";

import {
  GitHubProfile,
  GitHubCommit,
  UserLangStat,
  GitHubRepo,
  GitHubContribution
} from "./types/types.js";

export {
  getGitHubUser,
  getGitHubCommits,
  getGitHubContributions,
  getGitHubContributionTypesPerYear,
  getGitHubYearlyContributions,
  getGitHubLanguages,
  getGitHubRepos,
  getGitHubPinnedRepos
};

export type {
  GitHubProfile,
  GitHubCommit,
  UserLangStat,
  GitHubRepo,
  GitHubContribution
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
