import {
  GitHubContribution,
  GitHubLanguage,
  GitHubProfile
} from "../types/types.js";
import { getGitHubYearlyContributions } from "./contributions.js";
import { getGitHubLanguagesByYear } from "./languages.js";
import { getGitHubUser } from "./profile.js";

export const getGitHubYearlyRecap = async (
  username: string,
  year: number,
  token?: string
) => {
  const profile: GitHubProfile = await getGitHubUser(username, token);
  const contributions: GitHubContribution = await getGitHubYearlyContributions(
    username,
    year,
    token
  );

  const langStats: { lngs: GitHubLanguage[]; totalLngs: number } =
    await getGitHubLanguagesByYear(username, year, token);

  console.log(profile);
  console.log(contributions);
  console.log(langStats);

  // universal rank
  return {
    profile,
    contributions,
    langStats
  };
};
