import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            axios.defaults.headers.common['x-auth-token'] = token;
            const res = await axios.get('http://127.0.0.1:5000/api/auth/user');
            setUser(res.data);
        } catch (err) {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['x-auth-token'];
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        const res = await axios.post('http://127.0.0.1:5000/api/auth/login', { username, password });
        localStorage.setItem('token', res.data.token);
        await loadUser();
    };

    const register = async (username, password, email) => {
        const res = await axios.post('http://127.0.0.1:5000/api/auth/signup', { username, password, email });
        localStorage.setItem('token', res.data.token);
        await loadUser();
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        delete axios.defaults.headers.common['x-auth-token'];
    };

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, loadUser }}>
            {children}
        </AuthContext.Provider>
    );
};
