import { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, CloudLightning, CloudSnow, Wind } from 'lucide-react';

const WeatherWidget = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const response = await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`
                    );

                    if (!response.ok) {
                        throw new Error(`Weather API Error: ${response.status}`);
                    }

                    const data = await response.json();
                    setWeather(data.current);
                    setLoading(false);
                } catch (err) {
                    console.error("Weather fetch error:", err);
                    setError(err.message || 'Failed to fetch weather data');
                    setLoading(false);
                }
            },
            (err) => {
                console.error("Geolocation error:", err);
                setError('Location access denied.');
                setLoading(false);
            }
        );
    }, []);

    const getWeatherIcon = (code) => {
        if (code === 0 || code === 1) return <Sun className="w-8 h-8" style={{ color: '#F59E0B' }} />;
        if (code === 2 || code === 3) return <Cloud className="w-8 h-8" style={{ color: 'var(--text-tertiary)' }} />;
        if (code >= 51 && code <= 67) return <CloudRain className="w-8 h-8" style={{ color: '#3B82F6' }} />;
        if (code >= 71 && code <= 77) return <CloudSnow className="w-8 h-8" style={{ color: '#6366F1' }} />;
        if (code >= 95) return <CloudLightning className="w-8 h-8" style={{ color: '#8B5CF6' }} />;
        return <Wind className="w-8 h-8" style={{ color: 'var(--text-tertiary)' }} />;
    };

    const getWeatherMessage = (code) => {
        if (code >= 51 && code <= 67) return "It's raining. Nature is watering your plants today.";
        if (code >= 95) return "Stormy weather. Keep your plants safe.";
        if (code >= 71 && code <= 77) return "It's freezing. Make sure your plants are warm.";
        if (code === 0 || code === 1) return "It's sunny. Check the soil moisture.";
        return "A good day to check on your plants.";
    };

    if (loading) return (
        <div className="card" style={{ display: 'flex', justifyContent: 'center', padding: '1.5rem', alignItems: 'center', height: '100%' }}>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>Checking weather...</span>
        </div>
    );

    if (error) return (
        <div className="card" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <Cloud size={16} /> {error}
            </p>
        </div>
    );

    return (
        <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {getWeatherIcon(weather.weather_code)}
                    <div>
                        <h4 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>{Math.round(weather.temperature_2m)}°</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Local Weather</span>
                    </div>
                </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
                {getWeatherMessage(weather.weather_code)}
            </p>
        </div>
    );
};

export default WeatherWidget;
