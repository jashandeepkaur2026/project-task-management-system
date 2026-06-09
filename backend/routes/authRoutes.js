const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await user.save();
        res.json({ message: "User Registered Successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User Not Found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            "secretkey",
            { expiresIn: "1d" }
        );

        res.json({
            token,
            role: user.role,
            name: user.name,
            id: user._id
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/employees", async (req, res) => {
    const employees = await User.find({ role: "employee" }).select("name _id");
    res.json(employees);
});

module.exports = router;