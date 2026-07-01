    import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import { Droplet, Award, Sun } from 'lucide-react';
import Navbar from '../components/Navbar';
import Plant from '../components/Plant';
import WeatherWidget from '../components/WeatherWidget';

const Dashboard = () => {
    const { user, loading } = useContext(AuthContext);
    const [streak, setStreak] = useState(0);
    const [badges, setBadges] = useState([]);
    const [plantStage, setPlantStage] = useState('seed');
    const [isWateredToday, setIsWateredToday] = useState(false);

    useEffect(() => {
        if (user) {
            setStreak(user.streak);
            setBadges(user.badges || []);

            // Check water status
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

    const calculateStage = (s) => {
        if (s >= 30) return 'tree';
        if (s >= 14) return 'bush';
        if (s >= 7) return 'plant';
        if (s >= 3) return 'sprout';
        return 'seed';
    };

    useEffect(() => {
        if (user) setPlantStage(calculateStage(user.streak));
    }, [user, user?.streak]);

    if (loading) return null; // Or a skeleton if preferred, but null prevents flash
    if (!user) return <Navigate to="/login" />;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
            <Navbar />

            <main className="layout_container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>

                    {/* Primary Plant Card */}
                    <div className="card" style={{ gridColumn: 'span 1', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minHeight: '400px', justifyContent: 'center' }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <Plant streak={streak} stage={plantStage} isWatered={isWateredToday} />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>My Plant</h2>
                            <p style={{ textTransform: 'capitalize', color: 'var(--text-tertiary)' }}>{plantStage} Stage</p>
                        </div>

                        <Link
                            to="/plant"
                            className="btn btn-primary"
                            style={{ gap: '0.5rem', textDecoration: 'none', paddingLeft: '2rem', paddingRight: '2rem' }}
                        >
                            <Droplet size={18} />
                            Visit Garden
                        </Link>
                    </div>

                    {/* Sidebar / Stats */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* Streak Card */}
                        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{
                                height: '3.5rem', width: '3.5rem',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: '#FFF7ED', borderRadius: '50%', fontSize: '1.5rem'
                            }}>
                                🔥
                            </div>
                            <div>
                                <h3 style={{ fontSize: '2rem', lineHeight: 1, marginBottom: '0.25rem' }}>{streak}</h3>
                                <p style={{ fontSize: '0.875rem' }}>Day Streak</p>
                            </div>
                        </div>

                        {/* Recent Achievements */}
                        <div className="card">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <h3>Achievements</h3>
                                <Link to="/achievements" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textDecoration: 'none' }}>View All</Link>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                {badges && badges.length > 0 ? badges.slice(0, 4).map((b, i) => (
                                    <div key={i} title={b.name} style={{
                                        height: '3rem', width: '3rem',
                                        background: 'var(--bg-color)',
                                        borderRadius: 'var(--radius-md)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1.5rem'
                                    }}>
                                        {b.icon || <Award size={18} />}
                                    </div>
                                )) : (
                                    <p style={{ fontSize: '0.875rem', fontStyle: 'italic' }}>Start watering to earn badges.</p>
                                )}
                            </div>
                        </div>

                        {/* Weather - Assumed clean */}
                        <WeatherWidget />

                        {/* Tips */}
                        <div className="card" style={{ background: '#F0F9FF', borderColor: '#BAE6FD' }}>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <div style={{ color: '#0284C7' }}><Sun size={20} /></div>
                                <div>
                                    <h4 style={{ color: '#0369A1', marginBottom: '0.25rem', fontSize: '0.95rem' }}>Tip of the day</h4>
                                    <p style={{ color: '#334155', fontSize: '0.9rem', lineHeight: 1.4 }}>
                                        Overwatering is the #1 cause of houseplant death. Always check the soil dampness before watering.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
