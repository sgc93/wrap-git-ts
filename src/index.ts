import { getGitHubUser } from "./core/profile.js";
import { getGitHubCommits } from "./core/commits.js";
import { getGitHubLanguages } from "./core/languages.js";
import { getGitHubRepos, getGitHubPinnedRepos } from "./core/repositories.js";
import {
  getGitHubContributions,
  getGitHubContributionTypesPerYear
} from "./core/contributions.js";

import {
  GitHubProfile,
  GitHubCommit,
  UserLangStat,
  GitHubRepo
} from "./types/types.js";

export {
  getGitHubUser,
  getGitHubCommits,
  getGitHubContributions,
  getGitHubContributionTypesPerYear,
  getGitHubLanguages,
  getGitHubRepos,
  getGitHubPinnedRepos
};

export type { GitHubProfile, GitHubCommit, UserLangStat, GitHubRepo };

export default {
  getGitHubUser,
  getGitHubCommits,
  getGitHubContributions,
  getGitHubContributionTypesPerYear,
  getGitHubLanguages,
  getGitHubRepos,
  getGitHubPinnedRepos
};
