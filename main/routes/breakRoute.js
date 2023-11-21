const express = require("express");
const router = express.Router();
const breakController = require("../controllers/breakController");
const { authenticateToken } = require("../middlewares/authnetication");
const {
  hasStarttime,
  hasEndtime,
  hasReason,
} = require("../validators/validators");
const { runValidation } = require("../validators");

router.get("/:param?", authenticateToken, breakController.allBreaksbystaus);
router.post(
  "/apply-break",
  authenticateToken,
  [hasStarttime, hasEndtime, hasReason],
  runValidation,
  breakController.applybreak
);
router.post("/:id", authenticateToken, breakController.breakAction);

module.exports = router;
