const express = require("express");
const router = express.Router();
const noteController = require("../controllers/notecontroller");
const { authenticateToken } = require("../middlewares/authnetication");

router.get("/", authenticateToken, noteController.index);
router.post("/", authenticateToken, noteController.addNode);
router.put("/:id", authenticateToken, noteController.updateNote);
router.delete("/:id", authenticateToken, noteController.deleteNote);

module.exports = router;
