const express = require("express");
const {
  createProject,
  getProjects,
  deleteProject
} = require("../controllers/projectController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, authorize("admin", "manager"), createProject);
router.get("/", protect, getProjects);
router.delete("/:id", protect, authorize("admin"), deleteProject);

module.exports = router;