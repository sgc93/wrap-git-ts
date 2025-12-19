export type GitHubProfile = {
  name: string;
  login: string;
  bio: string;
  avatarUrl: string;
  company: string | null;
  location: string | null;
  email: string | null;
  followers: { totalCount: number };
  following: { totalCount: number };
  starredRepositories: { totalCount: number };
  repositories: { totalCount: number };
  createdAt: string;
};

export type GitHubRepo = {
  name: string;
  full_name: string;
  owner: string;
  description: string;
  stargazers_count: number;
  forks: number;
  language: { name: string; color: string };
  created_at: string;
  open_issues: number;
  html_url: string;
  url: string;
  visibility: string;
};

export type GitHubCommit = {
  totalCommits: number;
  commitsPerYear: {
    year: number;
    count: number;
  }[];
};

export type GitHubContribution = {
  year: number;
  totalContributions: number;
  days: { contributionCount: number; date: string; color: string }[];
};

export type UserLangStat = {
  lngName: string;
  coverage: number;
  repos: number;
};
