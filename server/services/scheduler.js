const cron = require('node-cron');
const webpush = require('web-push');
const Subscription = require('../models/Subscription');
const quotes = require('../utils/quotes');

const setupScheduler = () => {
    // Schedule task to run at 9:00 AM every day
    // cron.schedule('0 9 * * *', async () => {
    // For testing/demo purposes, we can run it every minute or on startup if needed. 
    // But let's stick to a schedule.
    // Let's do 9 AM.
    cron.schedule('0 9 * * *', async () => {
        console.log('Running daily notification job...');

        try {
            const subscriptions = await Subscription.find();
            const quote = quotes[Math.floor(Math.random() * quotes.length)];

            const payload = JSON.stringify({
                title: 'Time to Water! 🌿',
                body: quote,
                icon: '/icon.png' // Ensure this exists or use a remote URL
            });

            subscriptions.forEach(sub => {
                webpush.sendNotification(sub, payload).catch(err => {
                    console.error('Error sending notification', err);
                    if (err.statusCode === 410 || err.statusCode === 404) {
                        // Subscription has expired or is no longer valid
                        Subscription.findByIdAndDelete(sub._id).exec();
                    }
                });
            });
        } catch (err) {
            console.error('Scheduler error:', err);
        }
    });

    console.log('Daily notification scheduler initialized (9:00 AM).');
};

module.exports = setupScheduler;
