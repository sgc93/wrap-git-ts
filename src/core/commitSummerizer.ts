import { getCommitsBetween } from "../api/commits.js";
import GitWrapperError from "../model/GitWrapperError.js";
import { CommitType } from "../types/CommitType.js";
import { unknowError } from "../utils/error.js";

export const commitSummerizer = async (
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
      success: true,
      data: {
        totalCommits,
        commitsPerYear
      }
    };
  } catch (error) {
    if (error instanceof GitWrapperError) {
      return {
        success: false,
        error: {
          status: error.status,
          message: error.message,
          details: error.details
        }
      };
    }

    return unknowError("Unknown error occurred while fetching commit summary.");
  }
};
