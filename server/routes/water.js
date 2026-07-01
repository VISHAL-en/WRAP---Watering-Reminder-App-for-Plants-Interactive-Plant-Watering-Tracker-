const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const DailyWatering = require('../models/DailyWatering');

// Water Plant
router.post('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const now = new Date();
        const todayMidnight = new Date(now);
        todayMidnight.setHours(0, 0, 0, 0);

        const yesterdayMidnight = new Date(todayMidnight);
        yesterdayMidnight.setDate(yesterdayMidnight.getDate() - 1);

        // Check if already watered today
        // Look at lastWatered date
        if (user.lastWatered) {
            const lastMidnight = new Date(user.lastWatered);
            lastMidnight.setHours(0, 0, 0, 0);

            if (lastMidnight.getTime() === todayMidnight.getTime()) {
                return res.status(400).json({ msg: 'Already watered today!' });
            }
        }

        // Streak Logic
        let streak = user.streak;

        if (user.lastWatered) {
            const lastMidnight = new Date(user.lastWatered);
            lastMidnight.setHours(0, 0, 0, 0);

            if (lastMidnight.getTime() === yesterdayMidnight.getTime()) {
                // Was yesterday, so consecutive
                streak += 1;
            } else if (lastMidnight.getTime() < yesterdayMidnight.getTime()) {
                // Missed a day or more
                streak = 1;
            }
            // If it was today, caught above.
        } else {
            // First time ever
            streak = 1;
        }

        // Check Badges
        const badges = user.badges || [];
        const newBadges = [];

        const addBadge = (id, name, icon) => {
            if (!badges.find(b => b.id === id)) {
                const b = { id, name, icon, acquiredAt: new Date() };
                badges.push(b);
                newBadges.push(b);
            }
        };

        // Streak Slayer Logic
        if (user.lastWatered && streak === 1) {
            addBadge('streak_slayer', 'Streak Slayer', '💀');
        }

        user.streak = streak;
        if (streak > user.longestStreak) user.longestStreak = streak;
        user.lastWatered = now;
        user.totalWateredDays += 1;


        addBadge('first_water', 'First Water', '🌱');
        if (streak >= 7) addBadge('7_day_streak', '7 Day Streak', '🔥');
        if (streak >= 30) addBadge('30_day_streak', '30 Day Streak', '🌳');

        // Plant Stage Logic
        let plantStage = 'seed'; // 0-2
        if (streak >= 3) plantStage = 'sprout'; // 3-6
        if (streak >= 7) plantStage = 'plant'; // 7-13
        if (streak >= 14) plantStage = 'bush'; // 14-29
        if (streak >= 30) plantStage = 'tree'; // 30+

        user.badges = badges;
        user.markModified('badges');
        await user.save();

        // Create Log
        const log = new DailyWatering({
            userId: user.id,
            date: now,
            dateString: now.toISOString().split('T')[0],
            method: 'manual'
        });
        await log.save();

        res.json({
            msg: 'Watering Recorded',
            streak: user.streak,
            badges: user.badges, // Return ALL badges to ensure frontend sync
            totalWateredDays: user.totalWateredDays,
            plantStage: plantStage,
            isWateredToday: true
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Get History for Heatmap
router.get('/history', auth, async (req, res) => {
    try {
        const history = await DailyWatering.find({ userId: req.user.id }).sort({ date: 1 });
        res.json(history);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
