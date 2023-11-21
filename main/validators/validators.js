const { body } = require("express-validator");
exports.isEmail = body("email")
  .isEmail()
  .withMessage("Enter Correct email address");

exports.hasStarttime = body("start")
  .notEmpty()
  .withMessage("Start time cannot be empty");

exports.hasEndtime = body("end")
  .notEmpty()
  .withMessage("End time cannot be empty");

exports.hasReason = body("reason")
  .notEmpty()
  .withMessage("Reason cannot be empty");
