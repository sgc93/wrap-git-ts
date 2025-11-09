import { RepoType } from "../types/RepoType.js";
import { sortReposByStars } from "../utils/sort.js";
import { getAllRepos } from "../api/repos.js";

const calcTotalStars = (repos: RepoType[]) => {
  let stars = 0;
  repos.forEach((repo) => {
    stars = stars + repo.stargazers_count;
  });

  return stars;
};

export const repoSummarizer = async (username: string, token?: string) => {
  const repos: RepoType[] = await getAllRepos(username, token);

  const userRepos: RepoType[] = repos.filter((repo) => repo.owner === username);
  const publicRepos: RepoType[] = userRepos.filter(
    (repo) => repo.visibility === "public"
  );

  const sortedRepos = sortReposByStars(userRepos);
  const totalRepos = sortedRepos.length;

  const starsEarned = calcTotalStars(userRepos);
  const topStarredRepos =
    totalRepos > 5 ? sortedRepos.slice(0, 6) : sortedRepos;

  return {
    allRepos: userRepos,
    totalRepos,
    starsEarned,
    topStarredRepos,
    orgRepos: repos.length - userRepos.length,
    publicRepos: publicRepos.length
  };
};
