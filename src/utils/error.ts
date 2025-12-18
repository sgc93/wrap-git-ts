import GitWrapperError from "../model/GitWrapperError.js";

export const throwGitError = (
  status: number,
  error: string,
  detail?: string
) => {
  switch (status) {
    case 400:
      throw new GitWrapperError(
        "BAD REQUEST",
        error,
        detail || "Package error while trying to call github api"
      );
    case 401:
      throw new GitWrapperError(
        "UNAUTHORIZED",
        "Invalid token or unauthorized access",
        error
      );
    case 403:
      throw new GitWrapperError(
        "RATE_LIMIT_EXCEEDED",
        "Rate limit exceeded. Please wait before making more requests.",
        error
      );
    case 404:
      throw new GitWrapperError(
        "NOT_FOUND",
        "The requested resource was not found",
        error
      );
    default:
      throw new GitWrapperError(
        "GITHUB_API_ERROR",
        error,
        detail || "An error occurred while interacting with the GitHub API"
      );
  }
};

export const throwError = (err: any) => {
  throw new GitWrapperError(
    "NETWORK_ERROR",
    "No internet, Please check your internet connection.",
    err
  );
};
