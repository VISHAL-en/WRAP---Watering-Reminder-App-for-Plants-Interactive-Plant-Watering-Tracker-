const mongoose = require('mongoose');

const PlantLogSchema = new mongoose.Schema({
    plantId: { type: mongoose.Schema.Types.ObjectId, ref: 'RealPlant', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    imageUrl: { type: String, required: true }, // The URL relative path where the image is stored
    healthStatus: { type: String }, // AI's assessment (e.g., "Healthy", "Needs Water")
    tips: { type: String }, // Detailed tips from the AI
    watered: { type: Boolean, default: false }, // Did the user water it on this day?
});

module.exports = mongoose.model('PlantLog', PlantLogSchema);
