const express = require('express');
const router = express.Router();
const webpush = require('web-push');
const Subscription = require('../models/Subscription');
const quotes = require('../utils/quotes');

router.post('/trigger-notifications', async (req, res) => {
    // Optional: Add a simple security check using an environment variable
    // if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    //     return res.status(401).json({ error: 'Unauthorized' });
    // }

    console.log('Running daily notification job via webhook...');
    try {
        const subscriptions = await Subscription.find();
        const quote = quotes[Math.floor(Math.random() * quotes.length)];

        const payload = JSON.stringify({
            title: 'Time to Water! 🌿',
            body: quote,
            icon: '/icon.png' 
        });

        const promises = subscriptions.map(sub => {
            return webpush.sendNotification(sub, payload).catch(err => {
                console.error('Error sending notification', err);
                if (err.statusCode === 410 || err.statusCode === 404) {
                    return Subscription.findByIdAndDelete(sub._id).exec();
                }
            });
        });
        
        await Promise.all(promises);
        res.status(200).json({ success: true, message: 'Notifications sent.' });
    } catch (err) {
        console.error('Scheduler error:', err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

module.exports = router;
