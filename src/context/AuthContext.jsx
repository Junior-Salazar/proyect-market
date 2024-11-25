import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiPath } from '../config/constants';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [token, setToken] = useState(() => {
        return localStorage.getItem('token') || null;
    });

    const setUserAndToken = (newUser, newToken) => {
        setUser(newUser);
        setToken(newToken);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    const login = async (userData) => {
        try {
            const response = await fetch(`${ApiPath.apiBaseUrl}auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('Error en la autenticación');
            }

            const data = await response.json();
            setUserAndToken(data.user, data.token);

            console.log('Usuario logueado con éxito:');
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.log('Usuario ha cerrado sesión');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, setUserAndToken }}>
            {children}
        </AuthContext.Provider>
    );
};