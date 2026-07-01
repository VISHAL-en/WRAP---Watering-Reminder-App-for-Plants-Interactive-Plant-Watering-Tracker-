const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const webpush = require('web-push');
const Subscription = require('./models/Subscription');
// Web Push Configuration
const publicVapidKey = process.env.VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

if (publicVapidKey && privateVapidKey) {
  webpush.setVapidDetails(
    'mailto:test@example.com',
    publicVapidKey,
    privateVapidKey
  );
}

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wrapdb')
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch(err => console.error('MongoDB Connection Error:', err));

// Serve static assets if in production (or just always for this fix)
app.use(express.static(path.join(__dirname, '../client/dist')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/water', require('./routes/water'));
app.use('/api/user', require('./routes/user'));
app.use('/api/real-plants', require('./routes/realPlants'));
app.use('/api/cron', require('./routes/cron'));

const auth = require('./middleware/auth');

// Subscribe Route
app.post('/api/subscribe', auth, async (req, res) => {
  try {
    const subscription = req.body;
    const exists = await Subscription.findOne({ endpoint: subscription.endpoint });
    if (!exists) {
      await Subscription.create({
        userId: req.user.id,
        endpoint: subscription.endpoint,
        keys: subscription.keys
      });
    }
    res.status(201).json({ msg: 'Subscription saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Catch-all route to serve index.html for client-side routing
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
