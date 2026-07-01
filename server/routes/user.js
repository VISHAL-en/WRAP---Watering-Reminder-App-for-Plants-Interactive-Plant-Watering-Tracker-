const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get User Profile
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer Config
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, 'profile-' + req.user.id + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Upload Profile Pic
router.post('/upload', auth, upload.single('profilePic'), async (req, res) => {
    try {
        if (!req.file) return res.send({ msg: 'No file uploaded' });

        const user = await User.findById(req.user.id);
        // On Windows, backslashes might be an issue in URLs, normalize to forward slashes
        // and ensure we are serving /uploads static folder in server.js
        user.profilePic = `http://127.0.0.1:5000/uploads/${req.file.filename}`;
        await user.save();

        // Require fs at top if not present, but for this edit I will add the route
        res.json({ profilePic: user.profilePic });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Delete Profile Pic
router.delete('/profile-pic', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user.profilePic) {
            // Extract filename from URL - assumes standard format http://.../uploads/filename
            const filename = user.profilePic.split('/').pop();
            const fs = require('fs');
            const filePath = path.join(__dirname, '../uploads', filename);

            // Check if file exists before trying to delete
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        user.profilePic = '';
        await user.save();
        res.json({ msg: 'Profile picture removed' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Get User Profile
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'User not found' });
        res.status(500).send('Server Error');
    }
});

module.exports = router;
