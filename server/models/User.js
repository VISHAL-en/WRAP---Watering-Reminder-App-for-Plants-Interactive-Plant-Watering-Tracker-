const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true }, // Sparse to allow existing users without email
    profilePic: { type: String, default: '' },
    password: { type: String, required: true },
    joinDate: { type: Date, default: Date.now },
    badges: [{
        id: String, // e.g., 'first_water'
        name: String,
        icon: String,
        acquiredAt: { type: Date, default: Date.now }
    }],
    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastWatered: { type: Date, default: null },
    totalWateredDays: { type: Number, default: 0 },
    settings: {
        theme: { type: String, default: 'light' },
        emailNotifications: { type: Boolean, default: false }
    }
});

module.exports = mongoose.model('User', UserSchema);
