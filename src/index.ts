import { getGitHubUser } from "./core/profile.js";
import { getGitHubCommits } from "./core/commits.js";
import {
  getGitHubContributions,
  getGitHubContributionTypesPerYear
} from "./core/contributions.js";

import { GitHubProfile, GitHubCommit } from "./types/types.js";

export {
  getGitHubUser,
  getGitHubCommits,
  getGitHubContributions,
  getGitHubContributionTypesPerYear
};

export type { GitHubProfile, GitHubCommit };

export default {
  getGitHubUser,
  getGitHubCommits,
  getGitHubContributions
};
