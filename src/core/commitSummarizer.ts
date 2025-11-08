import { getCommitsBetween } from "../api/commits.js";
import { CommitType } from "../types/CommitType.js";
import { throwError } from "../utils/error.js";

export const commitSummarizar = async (
  username: string,
  created_at: string,
  token?: string
) => {
  const commitsPerYear: CommitType[] = [];
  let totalCommits = 0;

  try {
    const startYear = new Date(created_at).getFullYear();
    const currentYear = new Date().getFullYear();

    for (let year = startYear; year <= currentYear; year++) {
      const yearlyCommits = await getCommitsBetween(username, year, token);
      commitsPerYear.push({ year: year.toString(), count: yearlyCommits });
      totalCommits += yearlyCommits;
    }

    return {
      totalCommits,
      commitsPerYear,
    };
  } catch (error) {
    throwError(error);
  }
};
