import GitWrapperError from "../model/GitWrapperError.js";
import { throwErrorMessage } from "../utils/format.js";

export const getCommitsBetween = async (
  username: string,
  year: number,
  token?: string
) => {
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;
  const url = `https://api.github.com/search/commits?q=author:${username}+author-date:${startDate}..${endDate}`;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.cloak-preview+json"
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      const message = `GitHub API returned status ${response.status}`;
      throw throwErrorMessage(response.status, message);
    }

    const data = await response.json();
    return data.total_count;
  } catch (err: any) {
    if (err instanceof GitWrapperError) throw err;

    throw new GitWrapperError(
      "NETWORK_ERROR",
      "A network error occurred. Please check your internet connection.",
      err.message
    );
  }
};
