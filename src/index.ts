import { getGitHubUser } from "./core/profile.js";
import { getGitHubCommits } from "./core/commits.js";
import { repoSummarizer } from "./core/repoSummarizer.js";
import { lngSummarizer } from "./core/lngSummarizer.js";

import { GitHubProfile } from "./types/types.js";
import { CommitType } from "./types/CommitType.js";
import { LngType } from "./types/Lngtype.js";
import { RepoType } from "./types/RepoType.js";

export { getGitHubUser };
export { getGitHubCommits };
export { repoSummarizer };
export { lngSummarizer };

export type { CommitType, GitHubProfile, LngType, RepoType };

export default {
  getGitHubUser,
  getGitHubCommits,
  repoSummarizer,
  lngSummarizer
};
