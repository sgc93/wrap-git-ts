import WrapGitError from "../model/WrapGitError.js";

export const throwGitError = (
  status: number,
  error: string,
  detail?: string
) => {
  switch (status) {
    case 400:
      throw new WrapGitError(
        "BAD REQUEST",
        error,
        detail || "Package error while trying to call github api"
      );
    case 401:
      throw new WrapGitError(
        "UNAUTHORIZED",
        "Invalid token or unauthorized access",
        error
      );
    case 403:
      throw new WrapGitError(
        "RATE_LIMIT_EXCEEDED",
        "Rate limit exceeded. Please wait before making more requests.",
        error
      );
    case 404:
      throw new WrapGitError(
        "NOT_FOUND",
        "The requested resource was not found",
        error
      );
    default:
      throw new WrapGitError(
        "GITHUB_API_ERROR",
        error,
        detail || "An error occurred while interacting with the GitHub API"
      );
  }
};

export const throwError = (err: any) => {
  throw new WrapGitError(
    "NETWORK_ERROR",
    "No internet, Please check your internet connection.",
    err
  );
};
