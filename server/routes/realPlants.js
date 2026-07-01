const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const RealPlant = require('../models/RealPlant');
const PlantLog = require('../models/PlantLog');
const { GoogleGenAI } = require('@google/genai');

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'realplants',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  }
});

const upload = multer({ storage: storage });
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Get all real plants for a user
router.get('/', auth, async (req, res) => {
    try {
        const plants = await RealPlant.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(plants);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Create a new real plant
router.post('/', auth, async (req, res) => {
    try {
        const { name, species, location } = req.body;
        const newPlant = new RealPlant({
            userId: req.user.id,
            name,
            species,
            location
        });
        const savedPlant = await newPlant.save();
        res.json(savedPlant);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Get plant details and logs
router.get('/:id', auth, async (req, res) => {
    try {
        const plant = await RealPlant.findOne({ _id: req.params.id, userId: req.user.id });
        if (!plant) return res.status(404).json({ msg: 'Plant not found' });
        
        const logs = await PlantLog.find({ plantId: plant._id }).sort({ date: -1 });
        res.json({ plant, logs });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Add a log to a plant (Upload Image + AI Analysis)
router.post('/:id/logs', auth, upload.single('image'), async (req, res) => {
    try {
        const plant = await RealPlant.findOne({ _id: req.params.id, userId: req.user.id });
        if (!plant) return res.status(404).json({ msg: 'Plant not found' });

        if (!req.file) {
            return res.status(400).json({ msg: 'Please upload an image' });
        }

        const imageUrl = req.file.path; // Cloudinary secure URL
        
        let healthStatus = "Analysis Failed";
        let tips = "Could not analyze the image. Please try again later.";
        
        // Call Gemini AI
        try {
            const prompt = `You are an expert botanist. The user has uploaded an image of their plant named "${plant.name}" (species: ${plant.species || "Unknown"}). Analyze the plant's health from the image. Provide: 1) A short health status (e.g. "Healthy", "Needs more sunlight", "Looks Dry", "Sunburned") 2) A few sentences of actionable tips for care. Return exactly as a JSON object with keys "healthStatus" and "tips".`;
            const mimeType = req.file.mimetype;
            
            // Fetch the image from Cloudinary to pass to Gemini
            const imageRes = await fetch(imageUrl);
            const arrayBuffer = await imageRes.arrayBuffer();
            const base64Data = Buffer.from(arrayBuffer).toString('base64');

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [
                    prompt,
                    {
                        inlineData: {
                            data: base64Data,
                            mimeType
                        }
                    }
                ],
                config: {
                    responseMimeType: "application/json",
                }
            });
            const text = response.text;
            console.log("Gemini Output:", text);
            const aiData = JSON.parse(text);
            if (aiData.healthStatus) healthStatus = aiData.healthStatus;
            if (aiData.tips) tips = aiData.tips;
        } catch (aiErr) {
            console.error("AI Analysis Error:", aiErr.message);
        }

        const newLog = new PlantLog({
            plantId: plant._id,
            userId: req.user.id,
            imageUrl: imageUrl,
            healthStatus,
            tips,
            watered: req.body.watered === 'true'
        });

        const savedLog = await newLog.save();
        res.json(savedLog);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
