import GitWrapperError from "../model/GitWrapperError.js";

export const throwGitError = (status: number, error: string) => {
  switch (status) {
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
        "An error occurred while interacting with the GitHub API",
        error
      );
  }
};

export const throwError = (err: any) => {
  if (err instanceof GitWrapperError) throw err;

  throw new GitWrapperError(
    "NETWORK_ERROR",
    "A network error occurred. Please check your internet connection.",
    err.message
  );
};
