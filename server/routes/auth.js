const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// Register
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ msg: 'Username already taken' });

        if (email) {
            let emailUser = await User.findOne({ email });
            if (emailUser) return res.status(400).json({ msg: 'Email already registered' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            username,
            email,
            password: hashedPassword,
            badges: [], // Initialize empty
            streak: 0,
            longestStreak: 0,
            totalWateredDays: 0
        });
        await user.save();

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '10h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, username: user.username, email: user.email, streak: user.streak } });
        });
    } catch (err) {
        console.error('Signup Error:', err);
        res.status(500).json({ msg: `Signup Error: ${err.message}` });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body; // username can be email or username
    try {
        // Check if input looks like an email
        const isEmail = username.includes('@');
        const query = isEmail ? { email: username } : { username };

        // Also allow checking username field even if it looks like an email (legacy)
        let user = await User.findOne({ $or: [{ username }, { email: username }] });

        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '10h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, username: user.username, email: user.email, streak: user.streak, badges: user.badges } });
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ msg: `Login Error: ${err.message}` });
    }
});

// Update Username
router.put('/username', auth, async (req, res) => {
    const { username } = req.body;
    try {
        // Check uniqueness
        let existingUser = await User.findOne({ username });
        if (existingUser && existingUser.id !== req.user.id) {
            return res.status(400).json({ msg: 'Username already taken' });
        }

        const user = await User.findByIdAndUpdate(req.user.id, { username }, { new: true }).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get User
router.get('/user', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
