import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Navigate } from 'react-router-dom';
import { Flame, Droplet, Calendar } from 'lucide-react';

const StreakPage = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return null;
    if (!user) return <Navigate to="/login" />;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
            <Navbar />
            <main className="layout_container" style={{ maxWidth: '800px' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Your Consistency</h1>
                    <p>Track your daily habits and long-term progress.</p>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '3rem', marginBottom: '2rem', textAlign: 'center' }}>
                    <div className="animate-pulse-slow" style={{
                        fontSize: '4rem',
                        background: '#FFF7ED',
                        color: '#EA580C',
                        padding: '2rem',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '8rem', height: '8rem',
                        boxShadow: '0 0 0 8px rgba(255, 247, 237, 0.5)'
                    }}>
                        <Flame size={64} fill="#EA580C" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '4rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1, fontWeight: '800', letterSpacing: '-0.05em' }}>{user.streak}</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', marginTop: '0.5rem', fontWeight: '500' }}>Day Streak</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
                        <div style={{ padding: '1rem', background: '#F0FDF4', borderRadius: '50%', color: '#16A34A' }}>
                            <Calendar size={32} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '0.25rem' }}>Longest Streak</h3>
                            <p style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>{user.longestStreak || user.streak} Days</p>
                        </div>
                    </div>
                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
                        <div style={{ padding: '1rem', background: '#F0F9FF', borderRadius: '50%', color: '#0284C7' }}>
                            <Droplet size={32} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '0.25rem' }}>Total Watered</h3>
                            <p style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>{user.totalWateredDays || 0} Times</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StreakPage;
