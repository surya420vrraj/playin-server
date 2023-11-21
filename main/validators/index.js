const { validationResult } = require("express-validator");

exports.runValidation = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.json({ success: false, message: error.array()[0].msg });
  }
  next();
};
