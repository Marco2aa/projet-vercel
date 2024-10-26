import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart } from '@mui/x-charts/PieChart';
import { BASE_URL } from '../config/api';

const PortfolioPieChart = () => {
    const [portfolioData, setPortfolioData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fonction pour récupérer les données du portefeuille via l'API Symfony
    const fetchPortfolioData = async () => {
        try {
            const token = localStorage.getItem('jwtToken'); // Assurez-vous que le token est stocké dans le localStorage

            const response = await axios.get(`${BASE_URL}/api/portfolio`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Token JWT passé dans l'en-tête Authorization
                    Accept: 'application/json',
                },
            });
            setPortfolioData(response.data);
            setLoading(false);
            console.log(portfolioData)
        } catch (err) {
            console.error("Erreur lors de la récupération des données du portefeuille:", err);
            setError('Erreur lors de la récupération des données');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPortfolioData();
    }, []);

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    // Préparer les données pour le premier PieChart (cryptoTotals)
    const chartDataTotals = Object.keys(portfolioData.cryptoTotals).map((crypto) => ({
        label: crypto,
        value: portfolioData.cryptoTotals[crypto] // Conversion en euros
    }));

    // Préparer les données pour le deuxième PieChart (cryptoByToken)
    const chartDataByToken = Object.keys(portfolioData.cryptoByToken).map((crypto) => ({
        label: crypto,
        value: portfolioData.cryptoByToken[crypto]
    }));

    return (
        <div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center", flexDirection: "row", width: "90%", margin: "auto" }}>
            <div>
                <h3>Répartition des cryptomonnaies (Total en Euros)</h3>
                <PieChart
                    series={[
                        {
                            data: chartDataTotals,
                            innerRadius: 30,
                            outerRadius: 100,
                            paddingAngle: 5,
                            cornerRadius: 5,
                            startAngle: -45,
                            endAngle: 225,
                            cx: 150,
                            cy: 150,
                        }
                    ]}
                    width={400}
                    height={400}
                />
            </div>
            <div>
                <h3>Répartition des cryptomonnaies (Par Tokens)</h3>
                <PieChart
                    series={[
                        {
                            data: chartDataByToken,
                            innerRadius: 30,
                            outerRadius: 100,
                            paddingAngle: 5,
                            cornerRadius: 5,
                            startAngle: -45,
                            endAngle: 225,
                            cx: 150,
                            cy: 150,
                        }
                    ]}
                    width={400}
                    height={400}
                />
            </div>
        </div>
    );
};

export default PortfolioPieChart;
