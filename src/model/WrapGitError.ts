class WrapGitError extends Error {
  status: string;
  details: string;

  constructor(status: string, message: string, details: string) {
    super(message);
    this.status = status;
    this.details = details;
    this.name = "WrapGitError";

    Object.setPrototypeOf(this, WrapGitError.prototype);
  }
}

export default WrapGitError;
