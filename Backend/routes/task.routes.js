const express = require("express");
const router = express.Router();
const { verifyToken, allowRoles } = require("../middleware/auth.middleware");
const {
    getTasksByStudent,
    getTasksByMentor,
    createTask,
    updateTask,
    deleteTask,
} = require("../controllers/task.controller");

// Get all tasks for a student
router.get("/student/:enrollmentNo", verifyToken, allowRoles("admin", "staff", "student"), getTasksByStudent);

// Get all tasks assigned by a mentor
router.get("/mentor/:staffId", verifyToken, allowRoles("admin", "staff"), getTasksByMentor);

// Create a task (mentor only)
router.post("/", verifyToken, allowRoles("admin", "staff"), createTask);

// Update a task
router.put("/:taskId", verifyToken, allowRoles("admin", "staff", "student"), updateTask);

// Delete a task
router.delete("/:taskId", verifyToken, allowRoles("admin", "staff"), deleteTask);

module.exports = router;
