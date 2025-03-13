export const errorHandeler = (err, req, res, next) => {
  console.log(err);

  if (err.status === 404) {
    return res.status(404).json({ message: "Page not found!" });
  }

  if (err.name === "ValidationError") {
    // Mongoose validation errors often contain details in `err.errors`
    const errorMessages = Object.values(err.errors).map((error) => ({
      path: error.path,
      message: error.message,
    }));
    return res.status(400).json({
      message: "Validation Error",
      errors: errorMessages, // Provide a more structured error response
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      message: `Invalid value for ${err.path}`,
      error: err.message,
    });
  }
  return res.status(500).json({
    message: "Internal Server Error",
    error: err.message || "An unexpected error occurred",
  });
};
