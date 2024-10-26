import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config/api';

// Créer le contexte
export const UserContext = createContext();

// Fournisseur du contexte pour toute l'application
export const UserProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState({
        firstName: '',
        lastName: '',
        role: '',
        email: '',
        country: '',
        timezone: '',
        bio: '',
        profilePicture: '',
        portfolioFiles: []
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user profile data from backend
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await axios.get(`${BASE_URL}/api/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    }
                });
                setUserProfile(response.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to load user profile');
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    // Fonction pour mettre à jour le profil utilisateur
    const updateUserProfile = async (selectedFile) => {
        if (!selectedFile) {
            alert("Veuillez sélectionner un fichier.");
            return;
        }

        const formData = new FormData();
        formData.append('profilePicture', selectedFile);

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.post(`${BASE_URL}/api/user/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            // Mettre à jour l'image de profil après un upload réussi
            setUserProfile((prevProfile) => ({
                ...prevProfile,
                profilePicture: response.data.user.image, // Assurez-vous que le backend renvoie l'URL correcte
            }));
        } catch (error) {
            console.error('Erreur lors de l\'upload du fichier:', error);
        }
    };

    return (
        <UserContext.Provider value={{ userProfile, updateUserProfile, loading, error }}>
            {children}
        </UserContext.Provider>
    );
};
