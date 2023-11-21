const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { isEmail } = require("../validators/validators");
const { runValidation } = require("../validators");
const { authenticateToken } = require("../middlewares/authnetication");

router.get("/users", userController.index);
router.post("/signup", userController.addUser);
router.post("/signin", isEmail, runValidation, userController.signIn);
router.post("/logout", authenticateToken, userController.logout);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
