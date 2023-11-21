const express = require("express");
const router = express.Router();
const referalController = require("../controllers/referalController");
const { authenticateToken } = require("../middlewares/authnetication");

router.get("/", authenticateToken, referalController.index);
router.post("/addreferal", authenticateToken, referalController.addUser);
router.put("/:id", authenticateToken, referalController.updateUser);
router.delete("/:id", authenticateToken, referalController.deleteUser);

module.exports = router;
