import { Link, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Menu, X, Droplet, User, Award, Flame, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    if (!user) return null;

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: <Droplet size={18} /> },
        { path: '/plant', label: 'Garden', icon: <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>🌿</span> },
        { path: '/real-plants', label: 'My Plants', icon: <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>🪴</span> },
        { path: '/achievements', label: 'Progress', icon: <Award size={18} /> },
        { path: '/profile', label: 'Profile', icon: <User size={18} /> },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            background: 'var(--panel-bg)',
            borderBottom: '1px solid var(--border)',
            padding: '0.75rem 1rem'
        }}>
            <div className="layout_container" style={{ padding: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)' }}>
                    <img src="/assets/logo/wrap-logo.png" alt="WRAP" style={{ height: '40px', width: 'auto' }} />
                    <span style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.025em' }}>WRAP</span>
                </Link>

                {/* Desktop Nav */}
                <div className="desktop-nav" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                textDecoration: 'none',
                                color: isActive(item.path) ? 'var(--text-primary)' : 'var(--text-secondary)',
                                fontWeight: isActive(item.path) ? '600' : '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 0.75rem',
                                borderRadius: 'var(--radius-md)',
                                background: isActive(item.path) ? 'var(--bg-color)' : 'transparent',
                                transition: 'all 0.2s',
                                fontSize: '0.9rem'
                            }}
                        >
                            {item.icon} {item.label}
                        </Link>
                    ))}
                    <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 0.5rem' }}></div>
                    <button
                        onClick={logout}
                        style={{
                            color: 'var(--text-tertiary)',
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>

                {/* Mobile Menu Toggle */}
                <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ display: 'none', color: 'var(--text-primary)' }}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isMenuOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'var(--panel-bg)',
                    borderBottom: '1px solid var(--border)',
                    padding: '1rem',
                    boxShadow: 'var(--shadow-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                }}>
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMenuOpen(false)}
                            style={{
                                textDecoration: 'none',
                                color: isActive(item.path) ? 'var(--text-primary)' : 'var(--text-secondary)',
                                fontWeight: isActive(item.path) ? '600' : '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                background: isActive(item.path) ? 'var(--bg-color)' : 'transparent'
                            }}
                        >
                            {item.icon} {item.label}
                        </Link>
                    ))}
                    <div style={{ height: '1px', background: 'var(--border)', margin: '0.5rem 0' }}></div>
                    <button onClick={logout} style={{ color: '#EF4444', fontWeight: '600', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', textAlign: 'left' }}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            )}
            <style>{`
                @media (max-width: 768px) {
                    .desktop-nav { display: none !important; }
                    .mobile-menu-btn { display: block !important; }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
