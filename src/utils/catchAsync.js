module.exports = (statusCode, message) => {
  return (req, res, next) => {
    // In a real app we might not want to expose internal execution errors
    // but for now simple catch is fine
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

// Better implementation commonly used:
module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};