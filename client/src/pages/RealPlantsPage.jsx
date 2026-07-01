import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';

const RealPlantsPage = () => {
    const { user } = useContext(AuthContext);
    const [plants, setPlants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', species: '', location: 'Indoors' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchPlants();
    }, []);

    const fetchPlants = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/real-plants', {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            const data = await res.json();
            setPlants(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleCreatePlant = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/real-plants', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                const newPlant = await res.json();
                setPlants([newPlant, ...plants]);
                setShowForm(false);
                setFormData({ name: '', species: '', location: 'Indoors' });
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
            <Navbar />
            <div className="layout_container" style={{ padding: '2rem 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>My Physical Plants</h1>
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        style={{
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            padding: '0.75rem 1.5rem',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                        }}
                    >
                        {showForm ? 'Cancel' : <><Plus size={18} /> Add Plant</>}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleCreatePlant} style={{
                        background: 'var(--panel-bg)',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-lg)',
                        marginBottom: '2rem',
                        border: '1px solid var(--border)'
                    }}>
                        <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Add a New Plant</h2>
                        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                            <input
                                type="text"
                                placeholder="Plant Name (e.g. Freddie)"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                            />
                            <input
                                type="text"
                                placeholder="Species (Optional)"
                                value={formData.species}
                                onChange={(e) => setFormData({...formData, species: e.target.value})}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                            />
                            <select
                                value={formData.location}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                            >
                                <option value="Indoors">Indoors</option>
                                <option value="Outdoors">Outdoors</option>
                                <option value="Balcony">Balcony</option>
                            </select>
                        </div>
                        <button type="submit" style={{
                            marginTop: '1rem',
                            background: 'var(--text-primary)',
                            color: 'var(--bg-color)',
                            padding: '0.75rem 1.5rem',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: 'pointer'
                        }}>Save Plant</button>
                    </form>
                )}

                {loading ? (
                    <p>Loading plants...</p>
                ) : plants.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--panel-bg)', borderRadius: 'var(--radius-lg)' }}>
                        <span style={{ fontSize: '3rem' }}>🪴</span>
                        <h2 style={{ margin: '1rem 0' }}>No plants yet!</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Add your real plants to start tracking their health with AI.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                        {plants.map(p => (
                            <div 
                                key={p._id}
                                onClick={() => navigate(`/real-plants/${p._id}`)}
                                style={{
                                    background: 'var(--panel-bg)',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: '1.5rem',
                                    border: '1px solid var(--border)',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s, boxShadow 0.2s',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{p.name}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                                        {p.species || 'Unknown Species'} • {p.location}
                                    </p>
                                </div>
                                <div style={{ color: 'var(--primary)', background: 'var(--bg-color)', padding: '0.5rem', borderRadius: '50%' }}>
                                    <ChevronRight size={20} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RealPlantsPage;
