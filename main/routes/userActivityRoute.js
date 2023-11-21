const express = require("express");
const router = express.Router();
const userActivity = require("../controllers/userActivity");
const { authenticateToken } = require("../middlewares/authnetication");

router.get("/", userActivity.logoutAllUsers);
router.get("/single/:id", userActivity.logoutSingleUser);
router.get("/all", authenticateToken, userActivity.allUserActivity);

module.exports = router;
