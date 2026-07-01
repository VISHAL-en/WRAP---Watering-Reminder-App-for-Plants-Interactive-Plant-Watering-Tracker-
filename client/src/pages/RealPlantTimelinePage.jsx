import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, ArrowLeft, Upload, Droplets, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';

const RealPlantTimelinePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [plant, setPlant] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [uploading, setUploading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [wateredToday, setWateredToday] = useState(false);
    
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchPlantData();
    }, [id]);

    const fetchPlantData = async () => {
        try {
            const res = await fetch(`/api/real-plants/${id}`, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            if (res.ok) {
                const data = await res.json();
                setPlant(data.plant);
                setLogs(data.logs);
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    const handleSubmitLog = async (e) => {
        e.preventDefault();
        if (!selectedImage) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('watered', wateredToday);

        try {
            const res = await fetch(`/api/real-plants/${id}/logs`, {
                method: 'POST',
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                },
                body: formData
            });

            if (res.ok) {
                const newLog = await res.json();
                setLogs([newLog, ...logs]);
                setSelectedImage(null);
                setWateredToday(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div style={{ minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
    if (!plant) return <div style={{ minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Plant not found.</div>;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
            <Navbar />
            
            <div className="layout_container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
                <button 
                    onClick={() => navigate('/real-plants')}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1.5rem', padding: 0 }}
                >
                    <ArrowLeft size={18} /> Back to My Plants
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{plant.name}</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{plant.species || 'Unknown Species'} • {plant.location}</p>
                    </div>
                </div>

                {/* Upload Section */}
                <div style={{
                    background: 'var(--panel-bg)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    border: '1px solid var(--border)',
                    marginBottom: '3rem'
                }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Check Plant Health</h2>
                    
                    {!selectedImage ? (
                        <div 
                            onClick={() => fileInputRef.current.click()}
                            style={{
                                border: '2px dashed var(--border)',
                                borderRadius: 'var(--radius-md)',
                                padding: '3rem 1rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                background: 'var(--bg-color)',
                                color: 'var(--text-secondary)',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                        >
                            <Camera size={32} style={{ margin: '0 auto 1rem auto', color: 'var(--primary)' }} />
                            <p style={{ fontWeight: '500' }}>Snap a photo or upload an image</p>
                            <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>AI will analyze its health and give you tips</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <img 
                                src={URL.createObjectURL(selectedImage)} 
                                alt="Selected" 
                                style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} 
                            />
                            
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-sm)' }}>
                                <input 
                                    type="checkbox" 
                                    checked={wateredToday} 
                                    onChange={(e) => setWateredToday(e.target.checked)} 
                                    style={{ width: '1.2rem', height: '1.2rem' }}
                                />
                                <Droplets size={18} color="var(--primary)" /> I watered it just now
                            </label>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button 
                                    onClick={() => setSelectedImage(null)}
                                    disabled={uploading}
                                    style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--panel-bg)', color: 'var(--text-primary)', cursor: uploading ? 'not-allowed' : 'pointer' }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSubmitLog}
                                    disabled={uploading}
                                    style={{ flex: 2, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: uploading ? 'not-allowed' : 'pointer' }}
                                >
                                    {uploading ? <><Loader2 size={18} className="spin" /> Analyzing Health...</> : <><Upload size={18} /> Analyze & Save</>}
                                </button>
                            </div>
                        </div>
                    )}
                    
                    <input 
                        type="file" 
                        accept="image/*" 
                        ref={fileInputRef} 
                        onChange={handleFileSelect} 
                        style={{ display: 'none' }} 
                    />
                </div>

                {/* Timeline */}
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Timeline <span style={{ fontSize: '1rem', fontWeight: 'normal', color: 'var(--text-tertiary)' }}>({logs.length})</span>
                    </h2>
                    
                    {logs.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)' }}>
                            No logs yet. Upload a photo to start tracking!
                        </div>
                    ) : (
                        <div style={{ position: 'relative', borderLeft: '2px solid var(--border)', paddingLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {logs.map((log) => (
                                <div key={log._id} style={{ position: 'relative' }}>
                                    <div style={{
                                        position: 'absolute',
                                        left: '-2.5rem',
                                        width: '1rem',
                                        height: '1rem',
                                        background: log.watered ? 'var(--primary)' : 'var(--text-tertiary)',
                                        borderRadius: '50%',
                                        top: '1.5rem',
                                        border: '3px solid var(--bg-color)'
                                    }}></div>
                                    
                                    <div style={{
                                        background: 'var(--panel-bg)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius-lg)',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.02)' }}>
                                            <div style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>
                                                {new Date(log.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </div>
                                            {log.watered && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)', fontWeight: '600', fontSize: '0.85rem', background: 'var(--primary-light)', padding: '0.25rem 0.5rem', borderRadius: '1rem' }}>
                                                    <Droplets size={14} /> Watered
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem' }}>
                                            <div style={{ flex: '1' }}>
                                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: log.healthStatus.includes('Healthy') || log.healthStatus.includes('Good') ? '#10B981' : 'var(--text-primary)' }}>
                                                    {log.healthStatus}
                                                </h3>
                                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{log.tips}</p>
                                            </div>
                                            
                                            <img 
                                                src={`${log.imageUrl}`} 
                                                alt="Plant Log" 
                                                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {/* Adding a simple global style for the spin animation if it isn't defined yet */}
            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default RealPlantTimelinePage;
