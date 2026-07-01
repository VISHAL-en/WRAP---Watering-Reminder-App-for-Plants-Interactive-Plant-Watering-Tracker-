const mongoose = require('mongoose');

let cachedDb = null;

const connectDB = async () => {
    // If the database connection is cached and connected, return it
    if (cachedDb && mongoose.connection.readyState === 1) {
        return cachedDb;
    }
    
    try {
        console.log('Connecting to MongoDB...');
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wrapdb';
        
        // Timeout after 5 seconds instead of buffering indefinitely
        cachedDb = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000, 
        });
        
        console.log('MongoDB Connected successfully!');
        return cachedDb;
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
        throw err;
    }
};

module.exports = connectDB;
