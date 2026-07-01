const mongoose = require('mongoose');

const RealPlantSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    species: { type: String }, // Can be optionally filled if the user knows, or detected by AI
    location: { type: String, default: 'Indoors' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('RealPlant', RealPlantSchema);
