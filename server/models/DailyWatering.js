const mongoose = require('mongoose');

const DailyWateringSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true }, // Normalized to midnight or specific time? Storing exact time.
    dateString: { type: String }, // YYYY-MM-DD for easier querying
    method: { type: String, enum: ['manual', 'rain'], default: 'manual' },
    imageUrl: { type: String }
});

module.exports = mongoose.model('DailyWatering', DailyWateringSchema);
