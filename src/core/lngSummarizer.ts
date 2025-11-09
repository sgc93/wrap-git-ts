import { getAllRepos, getRepoLngs } from "../api/repos.js";
import { LngType } from "../types/Lngtype.js";
import { RepoType } from "../types/RepoType.js";
import { throttleAll } from "../utils/throttleAll.js";

const getTopLanguages = (lngCoverage: LngType[]) => {
  const sortedLngCoverage = [...lngCoverage].sort(
    (a, b) => b.coverage - a.coverage
  );
  return sortedLngCoverage.slice(0, 5);
};

export const lngSummarizer = async (username: string, token?: string) => {
  const allRepos: RepoType[] = await getAllRepos(username, token);
  const urls: string[] = allRepos
    .filter((repo) => repo.owner === username)
    .map((repo) => repo.url);

  const lngStats: LngType[] = [];
  let totalCodeSize = 0;

  const languages = await throttleAll(urls, 10, async (url) => {
    return await getRepoLngs(url, token);
  });

  // calc coverage of each language
  for (const language of languages) {
    if (!language) continue;

    for (const [lng, bytes] of Object.entries(language)) {
      const existing = lngStats.find((stat) => stat.lngName === lng);

      if (existing) {
        existing.coverage += bytes as number;
      } else {
        lngStats.push({
          lngName: lng,
          coverage: bytes as number,
          repos: 0
        });
      }
      totalCodeSize += bytes as number;
    }
  }

  // cal no of repos for each lng
  for (const repo of allRepos) {
    const existing = lngStats.find((stat) => stat.lngName === repo.language);
    if (existing) {
      existing.repos += 1;
    }
  }

  /*
   *  Estimated LOC = Code size in bytes / Average bytes per line
   *  Let Average Bytes per Line =  70 bytes/line
   *
   */

  const loc = Math.ceil(totalCodeSize / 70);

  const top5Lngs = getTopLanguages(lngStats);

  return {
    totLineOfCode: loc,
    totalLngs: lngStats.length,
    top5Lngs,
    allLngs: lngStats
  };
};
