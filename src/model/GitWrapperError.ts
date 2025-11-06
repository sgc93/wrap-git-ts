class GitWrapperError extends Error {
  status: string;
  details: string;
  
  constructor(status: string, message: string, details: string) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export default GitWrapperError;
