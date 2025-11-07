import { getErrorMessage } from "./format.js";

const unknowError = (err: string) => {
  return {
    success: false,
    error: {
      code: "UNKNOWN_ERROR",
      message: "An unknown error occurred",
      details: err
    }
  };
};

const customError = (error: { status: number; details: string }) => {
  const err = getErrorMessage(error.status);
  return {
    success: false,
    error: {
      code: err.code,
      message: err.message,
      details: error.details
    }
  };
};

export { unknowError, customError };
