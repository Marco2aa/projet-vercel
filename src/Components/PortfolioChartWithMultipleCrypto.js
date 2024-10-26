import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart } from '@mui/x-charts/LineChart'; // Assurez-vous que la bibliothèque MUI est correctement installée
import { BASE_URL } from '../config/api'; // Assurez-vous que BASE_URL est correctement défini

const PortfolioChartWithMultipleCryptos = () => {
    const [orders, setOrders] = useState([]);
    const [coinGeckoData, setCoinGeckoData] = useState({});
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    // Fonction pour récupérer les données de CoinGecko pour chaque cryptoId
    const fetchCoinGeckoData = async (cryptoId, fromTimestamp) => {
        try {
            const response = await axios.get(
                `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart/range`, {
                params: {
                    vs_currency: 'eur',
                    from: fromTimestamp,
                    to: Math.floor(Date.now() / 1000), // Jusqu'à maintenant
                },
            }
            );
            if (response.data && Array.isArray(response.data.prices)) {
                return response.data.prices;
            } else {
                return [];
            }
        } catch (error) {
            console.error(`Erreur lors de la récupération des données pour ${cryptoId}:`, error);
            return [];
        }
    };

    // Fonction pour récupérer les ordres de l'utilisateur
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
    }, []); // Cela s'exécutera une seule fois au montage du composant

    useEffect(() => {
        const fetchAllCryptoData = async () => {
            const cryptos = [...new Set(orders.map(order => order.cryptoId))];
            const firstTimestamp = Math.floor(
                Math.min(...orders.map(order => new Date(order.createdAt).getTime()))
            ); // Le timestamp le plus ancien (utilisé comme référence)

            const coinData = {};

            for (const cryptoId of cryptos) {
                const data = await fetchCoinGeckoData(cryptoId, firstTimestamp);
                coinData[cryptoId] = data;
            }

            setCoinGeckoData(coinData);
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

    // Fonction pour calculer les valeurs du portefeuille pour une cryptomonnaie donnée
    const calculateCryptoValues = (cryptoId) => {
        let currentQuantity = 0;
        const sortedOrders = orders
            .filter(order => order.cryptoId === cryptoId)
            .sort((a, b) => a.createdAt - b.createdAt);

        let nextOrderIndex = 0;
        let firstOrderPassed = false;
        const cryptoValues = [];

        // Parcourir les timestamps de la cryptomonnaie
        coinGeckoData[cryptoId]?.forEach(([timestamp, price]) => {
            // Appliquer les transactions avant ce timestamp
            while (nextOrderIndex < sortedOrders.length && sortedOrders[nextOrderIndex].createdAt <= timestamp / 1000) {
                const order = sortedOrders[nextOrderIndex];
                if (order.type === 'Achat') {
                    currentQuantity += order.quantity;
                    firstOrderPassed = true;
                } else if (order.type === 'Vente') {
                    currentQuantity -= order.quantity;
                    firstOrderPassed = true;
                }
                nextOrderIndex++;
            }

            // Ajouter la valeur actuelle de la cryptomonnaie
            cryptoValues.push({
                timestamp,
                [cryptoId]: firstOrderPassed ? price * currentQuantity : 0, // Si le premier ordre n'est pas passé, valeur = 0
            });
        });

        return cryptoValues;
    };

    // Fusion des valeurs des cryptos dans un tableau basé sur la crypto avec le plus de données
    const mergeCryptoValues = (primaryValues, secondaryValuesList) => {
        const mergedData = [...primaryValues];

        secondaryValuesList.forEach(({ cryptoId, values }) => {
            // Nombre de lignes dans le tableau principal
            const primaryLength = mergedData.length;
            const secondaryLength = values.length;

            // Insérer les valeurs de la crypto secondaire à partir de la fin du tableau principal
            const secondaryStartIndex = primaryLength - secondaryLength;

            mergedData.forEach((entry, index) => {
                if (index >= secondaryStartIndex) {
                    entry[cryptoId] = values[index - secondaryStartIndex]?.[cryptoId] || 0;
                } else {
                    entry[cryptoId] = 0; // Avant le premier ordre, la valeur est 0
                }
            });
        });

        // Calculer le total des cryptos à chaque timestamp en additionnant toutes les colonnes (sauf le timestamp)
        mergedData.forEach(entry => {
            let total = 0;
            Object.keys(entry).forEach(key => {
                if (key !== 'timestamp') { // On ne somme pas les timestamps
                    total += entry[key] || 0;
                }
            });
            entry.total = total; // Ajouter la clé 'total'
        });

        return mergedData;
    };

    // Calcul dynamique des valeurs pour toutes les cryptos
    const allCryptoValues = {};
    Object.keys(coinGeckoData).forEach(cryptoId => {
        allCryptoValues[cryptoId] = calculateCryptoValues(cryptoId);
    });

    // Vérification : s'assurer que allCryptoValues n'est pas vide
    if (Object.keys(allCryptoValues).length === 0) {
        return <div>Aucune donnée disponible pour les cryptomonnaies.</div>;
    }

    // Déterminer la cryptomonnaie avec le plus de lignes comme référence
    const [primaryCryptoId, ...otherCryptos] = Object.keys(allCryptoValues)
        .sort((a, b) => allCryptoValues[b].length - allCryptoValues[a].length);

    // S'assurer que primaryValues est bien un tableau
    const primaryValues = allCryptoValues[primaryCryptoId] || [];

    // Liste des autres cryptomonnaies
    const secondaryValuesList = otherCryptos.map(cryptoId => ({
        cryptoId,
        values: allCryptoValues[cryptoId] || []
    }));

    // Fusion des cryptos dans le tableau principal basé sur la crypto avec le plus de données
    const combinedData = mergeCryptoValues(primaryValues, secondaryValuesList);

    // Générer dynamiquement les séries du graphique pour chaque cryptomonnaie
    const series = [
        ...Object.keys(allCryptoValues).map(cryptoId => ({
            dataKey: cryptoId,
            label: cryptoId.charAt(0).toUpperCase() + cryptoId.slice(1),
            labelPosition: 'end',
            labelOffset: 10 + Object.keys(allCryptoValues).indexOf(cryptoId) * 10,
            showMark: false
        })),
        {
            dataKey: 'total', // Nouvelle clé pour la somme des cryptos
            label: 'Total',
            labelPosition: 'end',
            labelOffset: 30,
            showMark: false
        }
    ];

    console.log("Combined data for chart:", combinedData);

    return (
        <div>
            <h3>Valeur du portefeuille dans le temps</h3>
            <LineChart
                dataset={combinedData}
                xAxis={[{
                    dataKey: 'timestamp',
                    label: 'Date',
                    valueFormatter: (timestamp) => {
                        const date = new Date(timestamp);
                        return date.toLocaleDateString(); // Convertir le timestamp en une date lisible
                    }
                }]}
                series={series} // Séries dynamiques pour chaque cryptomonnaie et le total
                height={300}
                margin={{ left: 60, right: 30, top: 30, bottom: 30 }}

                grid={{ vertical: true, horizontal: true }}
            />
        </div>
    );
};

export default PortfolioChartWithMultipleCryptos;
