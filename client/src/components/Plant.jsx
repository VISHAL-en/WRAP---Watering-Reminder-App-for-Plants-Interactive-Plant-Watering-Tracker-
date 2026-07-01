import React from 'react';
import './PlantVisuals.css'; // Ensure you've created this file

const Plant = ({ streak, stage, isWatered, isAnimating }) => {
    // Stage logic handles the main emoji visualization
    const getEmoji = () => {
        if (stage === 'tree') return '🌲';
        if (stage === 'bush') return '🌳';
        if (stage === 'plant') return '🪴';
        if (stage === 'sprout') return '🌿';
        return '🌱'; // Seed
    };

    return (
        <div className={`plant-container ${isAnimating ? 'animating' : ''}`}>
            {/* Water Stream Animation Layer */}
            <div className="water-stream"></div>

            {/* Splash Droplets */}
            <div className="splash-zone">
                <div className="droplet"></div>
                <div className="droplet"></div>
                <div className="droplet"></div>
            </div>

            {/* Main Plant Entity */}
            <div className={`plant-core ${isWatered ? 'watered' : 'dry'}`}>
                {/* Visual Shine for Watered State */}
                {isWatered && <div className="shine"></div>}

                {/* The actual Plant Emoji/Graphic */}
                <div className="plant-emoji">
                    {getEmoji()}
                </div>
            </div>

            {/* Floating Status Particles (Hearts/Sparkles) */}
            <div className="status-particle">✨</div>

            {/* Soil Base */}
            <div className={`soil ${isWatered ? 'watered' : 'dry'}`}></div>
        </div>
    );
};

export default Plant;
