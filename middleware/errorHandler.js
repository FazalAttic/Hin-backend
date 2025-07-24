const errorHandler = (err, req, res, next) => {
  console.error(`❌ Server error: ${err.message}`, err.stack);
  res.status(500).json({ error: "Internal server error" });
};

module.exports = errorHandler;
