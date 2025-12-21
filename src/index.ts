import { getGitHubUser } from "./core/profile.js";
import { getGitHubCommits } from "./core/commits.js";
import {
  getGitHubLanguages,
  getGitHubLanguagesByYear
} from "./core/languages.js";
import { getGitHubRepos, getGitHubPinnedRepos } from "./core/repositories.js";
import { getGitHubYearlyRecap } from "./core/gitRecap.js";
import {
  getGitHubContributions,
  getGitHubContributionTypesPerYear,
  getGitHubYearlyContributions,
  getMonthlyContributions
} from "./core/contributions.js";

import WrapGitError from "./model/WrapGitError.js";

import {
  GitHubProfile,
  GitHubCommit,
  GitHubLanguage,
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
  getMonthlyContributions,
  getGitHubLanguagesByYear,
  getGitHubYearlyRecap,
  WrapGitError
};

export type {
  GitHubProfile,
  GitHubCommit,
  GitHubLanguage,
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
  getGitHubRepos,
  getGitHubPinnedRepos,
  getGitHubYearlyRecap,
  WrapGitError
};
