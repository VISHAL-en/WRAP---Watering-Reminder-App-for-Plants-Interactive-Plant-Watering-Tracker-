import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Navigate } from 'react-router-dom';
import { Award, Droplet, Flame, Shield } from 'lucide-react';

const AchievementsPage = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return null;
    if (!user) return <Navigate to="/login" />;

    const badges = user.badges || [];

    const badgeCatalog = [
        { name: 'First Water', icon: <Droplet size={24} />, desc: 'Water your plant for the first time.' },
        { name: '7 Day Streak', icon: <Flame size={24} />, desc: 'Maintain a streak for 7 days.' },
        { name: '30 Day Streak', icon: <Award size={24} />, desc: 'Maintain a streak for 30 days.' },
        { name: 'Streak Slayer', icon: <Shield size={24} />, desc: 'Recover from a broken streak.' }
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
            <Navbar />
            <main className="layout_container" style={{ maxWidth: '800px' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Your Progress</h1>
                    <p>Track your gardening milestones.</p>
                </div>

                {/* My Badges Section */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Unlocked Badges</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1.5rem' }}>
                        {badges.length > 0 ? badges.map((b, i) => (
                            <div key={i} title={b.name} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{
                                    height: '4rem', width: '4rem',
                                    background: '#F0FDF4',
                                    color: '#15803D',
                                    borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '0.75rem',
                                    fontSize: '1.5rem'
                                }}>
                                    {b.icon}
                                </div>
                                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>{b.name}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                                    {new Date(b.acquiredAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                        )) : (
                            <div style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                <div style={{ marginBottom: '1rem', fontSize: '2rem', opacity: 0.5 }}>🌱</div>
                                <p>No badges yet. Start watering to begin your collection!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* All Badges Section */}
                <div>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Available Badges</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                        {badgeCatalog.map((badge) => {
                            const isUnlocked = badges.some(b => b.name === badge.name);
                            return (
                                <div key={badge.name} className="card" style={{
                                    opacity: isUnlocked ? 1 : 0.5,
                                    borderStyle: isUnlocked ? 'solid' : 'dashed',
                                    display: 'flex',
                                    gap: '1rem',
                                    padding: '1rem',
                                    alignItems: 'center'
                                }}>
                                    <div style={{
                                        color: isUnlocked ? '#15803D' : 'var(--text-tertiary)',
                                        background: isUnlocked ? '#DCFCE7' : 'transparent',
                                        padding: '0.5rem', borderRadius: '50%'
                                    }}>
                                        {badge.icon}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '0.9rem', color: isUnlocked ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{badge.name}</div>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.3 }}>{badge.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AchievementsPage;
