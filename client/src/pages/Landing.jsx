import { Link } from 'react-router-dom';
import { Droplet, Trophy, Cloud } from 'lucide-react';

const Landing = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <nav style={{ padding: '1.5rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src="/assets/logo/wrap-logo.png" alt="WRAP" style={{ height: '48px', width: 'auto' }} />
                    <span style={{ letterSpacing: '-0.025em' }}>WRAP</span>
                </div>
                <div>
                    <Link to="/login" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}>Get Started</Link>
                </div>
            </nav>

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 2rem' }}>
                <div className="animate-fade-in" style={{ maxWidth: '800px', width: '100%' }}>
                    <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: '1.1', marginBottom: '1.5rem', color: 'var(--text-primary)', fontWeight: '800', letterSpacing: '-0.03em' }}>
                        Grow consistency.<br />
                        <span style={{ color: 'var(--primary)', backgroundImage: 'linear-gradient(135deg, var(--primary) 0%, #4ADE80 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Not just leaves.</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: '1.6' }}>
                        Join thousands of plant parents building better habits. Track your watering, earn badges, and keep your plants happy.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link to="/login" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 3rem', boxShadow: 'var(--shadow-md)' }}>
                            Start Growing Now
                        </Link>
                    </div>
                </div>

                <div style={{ marginTop: '8rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1200px' }}>
                    <div className="card" style={{ padding: '2rem', textAlign: 'left', border: '1px solid var(--border)' }}>
                        <div style={{ width: '3rem', height: '3rem', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', marginBottom: '1rem', color: '#F97316' }}>
                            <Droplet size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Maintain Streaks</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>Build a daily habit and watch your streak grow as you care for your digital garden.</p>
                    </div>
                    <div className="card" style={{ padding: '2rem', textAlign: 'left', border: '1px solid var(--border)' }}>
                        <div style={{ width: '3rem', height: '3rem', background: '#F0F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', marginBottom: '1rem', color: '#0EA5E9' }}>
                            <Cloud size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Smart Weather</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>We automatically skip reminders if it rained in your area, so you never overwater.</p>
                    </div>
                    <div className="card" style={{ padding: '2rem', textAlign: 'left', border: '1px solid var(--border)' }}>
                        <div style={{ width: '3rem', height: '3rem', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', marginBottom: '1rem', color: '#16A34A' }}>
                            <Trophy size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Earn Badges</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>Collect unique achievements and unlock rewards as you consistently care for your plants.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Landing;
