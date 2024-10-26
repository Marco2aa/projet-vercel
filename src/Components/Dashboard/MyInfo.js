import React, { useState, useEffect } from 'react';
import PortfolioChart from '../PortfolioLineChart';
import axios from 'axios';
import { BASE_URL } from '../../config/api'; // Assurez-vous que BASE_URL est correctement défini
import PortfolioChartWithMultipleCryptos from '../PortfolioChartWithMultipleCrypto';
import PortfolioPieChart from '../PortfolioPieChart';

const MyInfo = () => {
    const [orders, setOrders] = useState([]);
    const [coinGeckoData, setCoinGeckoData] = useState({}); // Utilisation d'un objet pour stocker les données par crypto
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const fetchCoinGeckoData = async (cryptoId, fromTimestamp) => {
        try {
            const response = await axios.get(
                `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart/range`, {
                params: {
                    vs_currency: 'eur',
                    from: fromTimestamp,
                    to: Math.floor(Date.now() / 1000), // Jusqu'à maintenant
                },
            });
            return response.data.prices;
        } catch (error) {
            console.error(`Erreur lors de la récupération des données pour ${cryptoId}:`, error);
            return [];
        }
    };

    const fetchUserOrders = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get(`${BASE_URL}/api/user/orders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });

            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Erreur lors de la récupération des ordres:', error);
            setErrorMessage('Erreur lors de la récupération des données.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserOrders();
    }, []);

    useEffect(() => {
        const fetchAllCryptoData = async () => {
            const cryptos = [...new Set(orders.map(order => order.cryptoId))]; // Récupérer tous les cryptoIds uniques
            const coinData = {};

            for (const cryptoId of cryptos) {
                const fromTimestamp = Math.floor(orders.find(order => order.cryptoId === cryptoId).createdAt); // Récupère le premier ordre de la crypto pour le timestamp de départ
                coinData[cryptoId] = await fetchCoinGeckoData(cryptoId, fromTimestamp);
            }

            setCoinGeckoData(coinData); // Stocker les données par cryptoId
        };

        if (orders.length > 0) {
            fetchAllCryptoData();
        }
    }, [orders]);

    if (loading) {
        return <div>Chargement des ordres...</div>;
    }

    if (errorMessage) {
        return <div>{errorMessage}</div>;
    }

    return (
        <div style={{ width: "90%", margin: "auto" }}>
            <PortfolioChartWithMultipleCryptos />
            <PortfolioPieChart />
            <PortfolioChart coinGeckoData={coinGeckoData} symfonyOrders={orders} />
        </div>
    );
};
export default MyInfo;