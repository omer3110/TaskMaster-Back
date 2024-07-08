const express = require("express");
const router = express.Router();

const {
  getTasks,
  getTaskById,
  deleteTask,
  createTask,
  editTask,
} = require("../controllers/tasks.controller");
const {
  verifyToken,
  authorizeTaskOwner,
} = require("../middleware/authmiddleware");

router.get("/", verifyToken, getTasks);
router.get("/:id", verifyToken, getTaskById);
router.delete("/:id", verifyToken, authorizeTaskOwner, deleteTask);
router.post("/create", verifyToken, createTask);
router.patch("/edit/:id", verifyToken, authorizeTaskOwner, editTask);

module.exports = router;
