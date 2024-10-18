const express = require('express');
const becryptJs = require("bcryptjs");
const User = require("../models/user");

const router = express.Router();

router.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Check if the user already exists
        const exitedUser = await User.findOne({ email });
        if (exitedUser) {
            return res.status(400).json({ msg: "User already exists" });
        }

       const hashedPassword = await becryptJs.hash(password, 8);

        // Create a new user
        let user = new User({
            email,
            password:hashedPassword,
            name,
        });

        user = await user.save();
        res.json(user);
    } catch (e) {
        // Check if it's a Mongoose validation error
        if (e.name === 'ValidationError') {
            const messages = Object.values(e.errors).map(err => err.message);
            return res.status(400).json({ msg: messages.join(', ') }); // Custom error message for validation errors
        }
        // General error handler
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
