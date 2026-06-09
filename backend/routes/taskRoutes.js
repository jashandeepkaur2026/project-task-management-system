const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const axios = require("axios");
const User = require("../models/User");

// GET all tasks
router.get("/", async (req, res) => {
    const { userId, role } = req.query;

    let tasks;

    if (role === "manager" || role === "admin") {
        tasks = await Task.find()
            .populate("assignedTo", "name")
            .populate("assignedBy", "name");
    } else {
        tasks = await Task.find({ assignedTo: userId }).populate("assignedTo", "name");
    }

    res.json(tasks);
});

// POST create task
router.post("/", async (req, res) => {
    try {
        const { title, description, deadline, assignedTo, assignedBy } = req.body;

        const task = new Task({
            title,
            description,
            status: "Pending",
            deadline,
            assignedTo,
            assignedBy
        });

        await task.save();

        // Find employee name
        const employee = await User.findById(assignedTo);

        // Send Slack Notification
        await axios.post(process.env.SLACK_WEBHOOK_URL, {
            text:
`📌 New Task Assigned

📝 Task: ${title}
👤 Assigned To: ${employee.name}
📅 Deadline: ${deadline}
📊 Status: Pending`
        });

        res.json(task);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete
router.delete("/:id", async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task Deleted" });
});

// Update status
router.put("/:id", async (req, res) => {
    const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
    );
    res.json(updatedTask);
});

module.exports = router;