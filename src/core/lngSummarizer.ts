import { getAllRepos, getRepoLngs } from "../api/repos.js";
import { RepoType } from "../types/RepoType.js";

type LngCoverageType = {
  lngName: string;
  coverage: number;
};

const getTopLng = (lngCoverage: LngCoverageType[]) => {
  let topCoverage = 0;
  let toplngName = "";

  for (let { lngName, coverage } of lngCoverage) {
    if (topCoverage < coverage) {
      toplngName = lngName;
      topCoverage = coverage;
    }
  }

  return { lngName: toplngName, lngCoverage: topCoverage };
};

const getTopLanguages = (lngCoverage: LngCoverageType[]) => {
  const sortedLngCoverage = lngCoverage.sort((a, b) => b.coverage - a.coverage);

  const topFive =
    sortedLngCoverage.length > 5
      ? sortedLngCoverage.slice(0, 5)
      : sortedLngCoverage;

  return topFive;
};

export const lngSummarizer = async (username: string, token?: string) => {
  const allRepos: RepoType[] = await getAllRepos(username, token);
  const urls: string[] = allRepos
    .filter((repo) => repo.owner === username)
    .map((repo) => repo.url);

  const lngStats: Record<string, number> = {};
  let totalCodeSize = 0;

  for (const url of urls) {
    const languages = await getRepoLngs(url, token);

    for (const [language, bytes] of Object.entries(languages)) {
      if (!lngStats[language]) {
        lngStats[language] = 0;
      }

      lngStats[language] += bytes as number;
      totalCodeSize += bytes as number;
    }
  }

  const lngs = Object.entries(lngStats);
  const totalLngs = lngs.length;
  const lngCoverage: LngCoverageType[] = [];

  /*
   *  Estimated LOC = Code size in bytes / Average bytes per line
   *  Let Average Bytes per Line =  70 bytes/line
   *
   */

  const loc = Math.ceil(totalCodeSize / 70);

  for (const [lng, bytes] of lngs) {
    lngCoverage.push({ lngName: lng, coverage: (bytes / totalCodeSize) * 100 });
  }

  const topLanguage = getTopLng(lngCoverage);
  const topThreeLanguages = getTopLanguages(lngCoverage);

  return {
    totalLineOfCode: loc,
    totalLngs,
    topThreeLanguages,
    lngCoverage,
    topLanguage,
  };
};
