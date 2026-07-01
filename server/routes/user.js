const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get User Profile
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_pics',
    allowed_formats: ['jpeg', 'jpg', 'png', 'gif']
  }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }
});

// Upload Profile Pic
router.post('/upload', auth, upload.single('profilePic'), async (req, res) => {
    try {
        if (!req.file) return res.send({ msg: 'No file uploaded' });

        const user = await User.findById(req.user.id);
        
        user.profilePic = req.file.path; // Cloudinary secure URL
        await user.save();

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
            try {
                // Extract public ID from Cloudinary URL to delete it from Cloudinary
                const parts = user.profilePic.split('/');
                const filename = parts[parts.length - 1];
                const publicId = 'profile_pics/' + filename.split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            } catch(e) {
                console.error("Cloudinary delete error", e);
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
