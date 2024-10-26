import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config/api';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [register, setRegister] = useState(false);


    const decodeJWT = (token) => {
        try {
            const payload = token.split('.')[1];
            const decodedPayload = atob(payload);
            const parsedPayload = JSON.parse(decodedPayload);
            return parsedPayload;
        } catch (error) {
            console.error('Error decoding JWT:', error);
            return null;
        }
    };

    const isTokenExpired = (decodedToken) => {
        if (!decodedToken || !decodedToken.exp) {
            return true;
        }
        const currentTime = Date.now() / 1000;
        return decodedToken.exp < currentTime;
    };

    const loadToken = () => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const decodedToken = decodeJWT(token);
            if (isTokenExpired(decodedToken)) {
                logout();
            } else {
                setAuthToken(token);
                setIsAuthenticated(true);
                setUser(decodedToken);
            }
        }
    };

    useEffect(() => {
        loadToken();

        const intervalId = setInterval(() => {
            const token = localStorage.getItem('jwtToken');
            if (token) {
                const decodedToken = decodeJWT(token);
                if (isTokenExpired(decodedToken)) {
                    logout();
                }
            }
        }, 3000);

        return () => clearInterval(intervalId);
    }, []);

    const login = async (email, password, notifysuccess, notifyfailure, navigate) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/login`, {
                email: email,
                password: password,
            });

            const token = response.data.token;
            localStorage.setItem('jwtToken', token);

            const decodedToken = decodeJWT(token);
            setAuthToken(token);
            setIsAuthenticated(true);
            setUser(decodedToken);

            // Notification de succès
            notifysuccess('Connexion réussie !');

            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (error) {
            if (error.response && error.response.status === 401 && error.response.data.message === 'Invalid credentials.') {
                // Notification d'échec personnalisée pour les identifiants invalides
                notifyfailure('Mot de passe incorrect ou email incorrect.');
            } else {
                // Notification générique pour toute autre erreur
                notifyfailure('Échec de la connexion, veuillez réessayer.');
            }
        }
    };


    const toggleRegister = () => {
        console.log('Toggle register clicked');
        setRegister((prevState) => !prevState);
    };

    // Fonction pour déconnecter l'utilisateur
    const logout = () => {
        localStorage.removeItem('jwtToken');
        setAuthToken(null);
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ authToken, isAuthenticated, user, error, register, toggleRegister, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
