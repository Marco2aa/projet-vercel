import axios from 'axios';
import { BASE_URL } from '../config/api';

const convertDateToUnixTimestamp = (date) => {
    return Math.floor(new Date(date).getTime() / 1000); // Convertir la date en secondes
};

// Fonction pour récupérer les prix d'une crypto sur une période définie
export const fetchCryptoHistoricalData = async (cryptoId, startDate) => {
    try {
        // Convertir en timestamp UNIX
        const toTimestamp = Math.floor(Date.now() / 1000); // Date actuelle en timestamp UNIX

        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart/range`, {
            params: {
                vs_currency: 'eur', // Monnaie de référence
                from: startDate, // Date de début en timestamp UNIX
                to: toTimestamp, // Date actuelle en timestamp UNIX
            },
        });
        console.log(response.data.prices);
        return response.data.prices; // Retourne les données de prix historiques
    } catch (error) {
        console.error('Erreur lors de la récupération des données historiques:', error);
        throw error;
    }
};


// Assurez-vous que BASE_URL est bien configuré

// Fonction pour récupérer les ordres d'un utilisateur
export const fetchUserOrders = async (userId) => {
    try {
        const token = localStorage.getItem('jwtToken'); // Assurez-vous que l'utilisateur est authentifié
        const response = await axios.get(`${BASE_URL}/api/user/${userId}/orders`, {
            headers: {
                Authorization: `Bearer ${token}`, // Envoyer le token JWT dans les en-têtes
                Accept: 'application/json',
            },
        });

        return response.data; // Retourne les données des ordres
    } catch (error) {
        console.error('Erreur lors de la récupération des ordres :', error);
        throw error; // Lève une erreur si quelque chose ne va pas
    }
};