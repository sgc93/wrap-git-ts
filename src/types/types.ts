export type GitHubProfile = {
    name: string,
    login: string,
    bio: string,
    avatarUrl: string,
    company: string | null,
    location: string | null,
    email: string | null,
    followers: { totalCount: number },
    following: { totalCount: number },
    starredRepositories: { totalCount: number },
    repositories: { totalCount: number },
    createdAt: string,
  }
