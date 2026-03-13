import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminAuthAPI } from '../services/adminApi';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('adminToken'));

    useEffect(() => {
        const initAuth = async () => {
            const savedToken = localStorage.getItem('adminToken');
            if (savedToken) {
                try {
                    const response = await adminAuthAPI.getMe(savedToken);
                    setAdmin(response.data.data);
                    setToken(savedToken);
                } catch (error) {
                    console.error('Token validation failed:', error);
                    localStorage.removeItem('adminToken');
                    setToken(null);
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const signup = async (name, email, password) => {
        try {
            const response = await adminAuthAPI.signup(name, email, password);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Signup failed'
            };
        }
    };

    const login = async (email, password) => {
        try {
            const response = await adminAuthAPI.login(email, password);
            const { token: newToken, admin: adminData } = response.data.data;

            localStorage.setItem('adminToken', newToken);
            setToken(newToken);
            setAdmin(adminData);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        setToken(null);
        setAdmin(null);
    };

    const value = {
        admin,
        token,
        loading,
        signup,
        login,
        logout,
        isAuthenticated: !!token
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
