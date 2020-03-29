const errorHandler = (err, req, res, next) => {
  // Log to console for dec
  console.log(err.stack.red);
  res.status(500).send({ success: false, error: err.message });
};

module.exports = errorHandler;
