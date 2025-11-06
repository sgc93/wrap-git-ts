import { RepoType } from "../types/RepoType";

export const sortReposByStars = (repos: RepoType[]) => {
  return repos.sort((a, b) => {
    if (b.stargazers_count !== a.stargazers_count) {
      return b.stargazers_count - a.stargazers_count;
    }

    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });
};

