import { RepoType } from "../types/RepoType.js";
import { sortReposByStars } from "../utils/sort.js";

const calcTotalStars = (repos: RepoType[]) => {
  let stars = 0;
  repos.forEach((repo) => {
    stars = stars + repo.stargazers_count;
  });

  return stars;
};

export const repoSummerizer = (repos: RepoType[]) => {
  const sortedRepos = sortReposByStars(repos);
  const totalRepos = sortedRepos.length;

  const starsEarned = calcTotalStars(repos);
  const topStarredRepos =
    totalRepos > 5 ? sortedRepos.slice(0, 6) : sortedRepos;

  const topCommitedRepos: RepoType[] = [];

  return {
    totalRepos,
    starsEarned,
    topStarredRepos,
    topCommitedRepos
  };
};
