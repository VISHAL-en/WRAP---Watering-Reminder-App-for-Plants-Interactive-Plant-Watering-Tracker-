import { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Plant from '../components/Plant';
import axios from 'axios';
import { Droplet, Check, ArrowLeft } from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';

const PlantPage = () => {
    const { user, loading, loadUser } = useContext(AuthContext);
    const [message, setMessage] = useState('');
    const [plantStage, setPlantStage] = useState('seed');
    const [isWateredToday, setIsWateredToday] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const audioRef = useRef(new Audio('/water-sound.mp3'));

    const calculateStage = (s) => {
        if (s >= 30) return 'tree';
        if (s >= 14) return 'bush';
        if (s >= 7) return 'plant';
        if (s >= 3) return 'sprout';
        return 'seed';
    };

    useEffect(() => {
        if (user) {
            setPlantStage(calculateStage(user.streak));
            if (user.lastWatered) {
                const last = new Date(user.lastWatered);
                const today = new Date();
                const isSameDay = last.getDate() === today.getDate() &&
                    last.getMonth() === today.getMonth() &&
                    last.getFullYear() === today.getFullYear();
                setIsWateredToday(isSameDay);
            } else {
                setIsWateredToday(false);
            }
        }
    }, [user]);

    const handleWater = async () => {
        if (isWateredToday || isAnimating) return;

        setIsAnimating(true);
        try {
            audioRef.current.volume = 0.5;
            audioRef.current.play().catch(() => { });
        } catch (e) { /* ignore */ }

        try {
            const minAnimationTime = 1500;
            const start = Date.now();

            await axios.post('/api/water');

            const remainingTime = minAnimationTime - (Date.now() - start);

            setTimeout(async () => {
                setIsWateredToday(true);
                setIsAnimating(false);
                setMessage('Done.'); // Simple, minimal message
                await loadUser();
            }, remainingTime > 0 ? remainingTime : 0);

        } catch (err) {
            setIsAnimating(false);
            setMessage(err.response?.data?.msg || 'Error watering');
        }
    };

    if (loading) return null;
    if (!user) return <Navigate to="/login" />;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
            <Navbar />

            <main className="layout_container" style={{ maxWidth: '800px' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <Link to="/dashboard" className="btn btn-ghost" style={{ paddingLeft: 0, gap: '0.5rem' }}>
                        <ArrowLeft size={18} /> Back to Dashboard
                    </Link>
                </div>

                <div className="card" style={{
                    minHeight: '600px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative'
                }}>

                    {/* Minimal Header */}
                    <div style={{ position: 'absolute', top: '2rem', textAlign: 'center', width: '100%' }}>
                        <h2 style={{ fontSize: '1.25rem', color: isWateredToday ? '#059669' : 'var(--text-primary)' }}>
                            {isAnimating ? 'Watering...' : (isWateredToday ? 'Hydrated' : 'Needs Water')}
                        </h2>
                    </div>

                    <div style={{ transform: 'scale(1.2)' }}>
                        <Plant
                            streak={user.streak}
                            stage={plantStage}
                            isWatered={isWateredToday}
                            isAnimating={isAnimating}
                        />
                    </div>

                    <div style={{ marginTop: '3rem' }}>
                        <button
                            onClick={handleWater}
                            disabled={isWateredToday || isAnimating}
                            className={`btn ${isWateredToday ? 'btn-outline' : 'btn-primary'}`}
                            style={{
                                fontSize: '1.1rem',
                                padding: '0.875rem 2.5rem',
                                minWidth: '200px',
                                gap: '0.5rem'
                            }}
                        >
                            {isWateredToday ? <><Check size={18} /> Complete</> : <><Droplet size={18} /> Water Plant</>}
                        </button>
                    </div>
                </div>

                {/* Footnote / Legend */}
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>Current Streak: <strong>{user.streak} days</strong></p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', opacity: 0.6 }}>
                        {['seed', 'sprout', 'plant', 'bush', 'tree'].map((s, i) => {
                            const emoji = s === 'tree' ? '🌲' : s === 'bush' ? '🌳' : s === 'plant' ? '🪴' : s === 'sprout' ? '🌿' : '🌱';
                            const isActive = plantStage === s;
                            return (
                                <div key={s} style={{
                                    opacity: isActive ? 1 : 0.3,
                                    filter: isActive ? 'none' : 'grayscale(1)',
                                    transform: isActive ? 'scale(1.2)' : 'scale(1)',
                                    transition: 'all 0.3s'
                                }} title={s}>
                                    <span style={{ fontSize: '1.5rem' }}>{emoji}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PlantPage;
