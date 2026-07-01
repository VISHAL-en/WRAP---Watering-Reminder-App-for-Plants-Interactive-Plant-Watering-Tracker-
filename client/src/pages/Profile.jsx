import { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { Camera, Trash2, X, Check, Edit2, User, Bell } from 'lucide-react';
import Navbar from '../components/Navbar';
import MonthlyHeatmap from '../components/MonthlyHeatmap';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropUtils';

const Profile = () => {
    const { user, loadUser, loading } = useContext(AuthContext);
    const [history, setHistory] = useState([]);
    const [isEditingName, setIsEditingName] = useState(false);
    const [editName, setEditName] = useState('');

    const fileInputRef = useRef(null);
    const [profilePic, setProfilePic] = useState('');

    // Crop State
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    useEffect(() => {
        if (user) setProfilePic(user.profilePic);
    }, [user]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get('/api/water/history');
                setHistory(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchHistory();
    }, []);

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const saveName = async () => {
        try {
            await axios.put('/api/auth/username', { username: editName });
            await loadUser(); // Refresh user data
            setIsEditingName(false);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || 'Failed to update username');
        }
    };

    const handleFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => setImageSrc(reader.result));
            reader.readAsDataURL(file);
            e.target.value = null; // Clear input
        }
    };

    const uploadCroppedImage = async () => {
        try {
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

            const formData = new FormData();
            formData.append('profilePic', croppedImageBlob, 'profile.jpg');

            const res = await axios.post('/api/user/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setProfilePic(res.data.profilePic);
            setImageSrc(null); // Close modal
            setZoom(1);
        } catch (err) {
            console.error(err);
            alert('Upload failed');
        }
    };

    const deleteProfilePic = async () => {
        if (!confirm('Are you sure you want to remove your profile picture?')) return;
        try {
            await axios.delete('/api/user/profile-pic');
            setProfilePic('');
        } catch (err) {
            console.error(err);
            alert('Failed to delete profile picture');
        }
    };

    if (loading) return null;
    if (!user) return <Navigate to="/login" replace />;

    const publicVapidKey = 'BGpr5KkZmmWm9bqrvUHr2Vx2zJOwnS_J_yx4gM_-hK3jAixzNn3VTDPtnMCrCm3TGa_QiQ2jvIf-jAvxFIJGiw0'; // Hardcoded public key from env

    const [isSubscribed, setIsSubscribed] = useState(false);

    // Check if Service Worker is supported and check current permission
    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            // Check permission status
            if (Notification.permission === 'granted') {
                setIsSubscribed(true);
            }
        }
    }, []);

    const urlBase64ToUint8Array = (base64String) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    const subscribeToPush = async () => {
        if (!('serviceWorker' in navigator)) return;

        try {
            const register = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });

            const subscription = await register.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
            });

            await axios.post('/api/subscribe', subscription);
            setIsSubscribed(true);
            alert('Notifications enabled! You will receive daily reminders at 9 AM.');
        } catch (err) {
            console.error('Failed to subscribe:', err);
            if (Notification.permission === 'denied') {
                alert('Permission denied. Please enable notifications in your browser settings.');
            } else {
                alert(`Failed to enable notifications. Error: ${err.message}`);
            }
        }
    };

    const closeCrop = () => {
        setImageSrc(null);
        setZoom(1);
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
            <Navbar />
            <main className="layout_container" style={{ maxWidth: '800px' }}>

                {/* Crop Modal */}
                {imageSrc && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        zIndex: 100, background: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(2px)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        padding: '1rem'
                    }}>
                        <div className="card" style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.25rem' }}>Adjust Photo</h3>
                                <button onClick={closeCrop} style={{ color: 'var(--text-secondary)' }}><X size={20} /></button>
                            </div>

                            <div style={{ position: 'relative', height: '300px', width: '100%', background: '#F3F4F6', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Zoom</span>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    onChange={(e) => setZoom(e.target.value)}
                                    style={{ flex: 1, accentColor: 'var(--text-primary)' }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
                                <button onClick={closeCrop} className="btn btn-ghost">Cancel</button>
                                <button onClick={uploadCroppedImage} className="btn btn-primary" style={{ gap: '0.5rem' }}>
                                    <Check size={16} /> Save Photo
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Profile Header Card */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', md: { flexDirection: 'row' }, gap: '2rem', alignItems: 'center' }}>
                        {/* Avatar Section */}
                        <div style={{ position: 'relative' }}>
                            <div
                                style={{
                                    width: '120px', height: '120px',
                                    background: profilePic ? 'white' : '#F0FDF4',
                                    borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '3rem', fontWeight: 'bold', color: '#15803D',
                                    overflow: 'hidden',
                                    border: '4px solid white',
                                    boxShadow: 'var(--shadow-md)',
                                    cursor: 'pointer'
                                }}
                                onClick={() => fileInputRef.current.click()}
                            >
                                {profilePic ? (
                                    <img src={profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    user?.username[0].toUpperCase()
                                )}
                            </div>

                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />

                            {/* Actions Overlay */}
                            <div style={{ position: 'absolute', bottom: 0, right: 0, display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className="btn"
                                    style={{
                                        padding: '0.4rem', borderRadius: '50%', background: 'white',
                                        boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)',
                                        color: 'var(--text-secondary)'
                                    }}
                                    title="Change Photo"
                                >
                                    <Camera size={16} />
                                </button>
                                {profilePic && (
                                    <button
                                        onClick={deleteProfilePic}
                                        className="btn"
                                        style={{
                                            padding: '0.4rem', borderRadius: '50%', background: '#FEE2E2',
                                            color: '#B91C1C', border: '1px solid #FECACA',
                                            boxShadow: 'var(--shadow-sm)'
                                        }}
                                        title="Remove Photo"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Info Section */}
                        <div style={{ flex: 1, textAlign: 'center', width: '100%' }}>
                            {isEditingName ? (
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="input-field"
                                        style={{ fontSize: '1.5rem', fontWeight: '600', padding: '0.25rem 0.5rem', width: 'auto', minWidth: '200px', textAlign: 'center' }}
                                        autoFocus
                                    />
                                    <button onClick={saveName} className="btn btn-primary" style={{ padding: '0.5rem' }}><Check size={18} /></button>
                                    <button onClick={() => setIsEditingName(false)} className="btn btn-ghost" style={{ padding: '0.5rem' }}><X size={18} /></button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{user?.username}</h2>
                                    <button
                                        onClick={() => { setEditName(user?.username); setIsEditingName(true); }}
                                        style={{ color: 'var(--text-tertiary)' }}
                                        title="Edit Username"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                </div>
                            )}

                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                Member since {new Date(user?.joinDate || Date.now()).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>

                            <div style={{ display: 'inline-flex', gap: '2rem', padding: '1rem 2rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-lg)' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{user?.streak}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Streak</div>
                                </div>
                                <div style={{ width: '1px', background: 'var(--border)' }}></div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{user?.badges?.length || 0}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Badges Earned</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gap: '2rem' }}>

                    {/* Notifications Setting */}
                    <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{
                                padding: '0.75rem', borderRadius: '50%', background: '#EFF6FF', color: '#3B82F6'
                            }}>
                                <Bell size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Daily Reminders</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                                    Get notified at 9 AM to water your plants.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={subscribeToPush}
                            disabled={isSubscribed}
                            className={`btn ${isSubscribed ? 'btn-ghost' : 'btn-outline'}`}
                            style={{
                                pointerEvents: isSubscribed ? 'none' : 'auto',
                                opacity: isSubscribed ? 0.6 : 1
                            }}
                        >
                            {isSubscribed ? <><Check size={16} style={{ marginRight: '0.5rem' }} /> Enabled</> : 'Enable'}
                        </button>
                    </div>

                    {/* History */}
                    <div className="card">
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            Watering History
                        </h3>
                        <div style={{ width: '100%', overflowX: 'auto' }}>
                            <MonthlyHeatmap history={history} />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', justifyContent: 'flex-end' }}>
                            <span>Less</span>
                            <div style={{ width: '12px', height: '12px', background: '#F1F5F9', borderRadius: '2px' }}></div>
                            <div style={{ width: '12px', height: '12px', background: '#BBF7D0', borderRadius: '2px' }}></div>
                            <div style={{ width: '12px', height: '12px', background: '#4ADE80', borderRadius: '2px' }}></div>
                            <div style={{ width: '12px', height: '12px', background: '#16A34A', borderRadius: '2px' }}></div>
                            <span>More</span>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default Profile;
