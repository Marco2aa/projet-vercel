import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const PortfolioChart = ({ coinGeckoData, symfonyOrders }) => {
    const [portfolioHistory, setPortfolioHistory] = useState([]);

    useEffect(() => {
        const calculatePortfolioValues = () => {
            let portfolioValues = [];

            const cryptos = Object.keys(coinGeckoData); // Récupère tous les cryptoIds

            cryptos.forEach(cryptoId => {
                let currentQuantity = 0;
                const sortedOrders = symfonyOrders
                    .filter(order => order.cryptoId === cryptoId)
                    .sort((a, b) => a.createdAt - b.createdAt);
                let nextOrderIndex = 0;

                coinGeckoData[cryptoId].forEach(([timestamp, price]) => {
                    const coinGeckoTimestamp = Math.floor(timestamp / 1000);

                    while (nextOrderIndex < sortedOrders.length && sortedOrders[nextOrderIndex].createdAt <= coinGeckoTimestamp) {
                        const order = sortedOrders[nextOrderIndex];

                        if (order.type === 'Achat') {
                            currentQuantity += order.quantity;
                        } else if (order.type === 'Vente') {
                            currentQuantity -= order.quantity;
                        }

                        nextOrderIndex++;
                    }

                    const portfolioValue = price * currentQuantity;

                    portfolioValues.push({
                        cryptoId, // Stocker l'ID de la crypto
                        x: coinGeckoTimestamp,
                        y: portfolioValue,
                    });
                });
            });

            setPortfolioHistory(portfolioValues);
        };

        calculatePortfolioValues();
    }, [coinGeckoData, symfonyOrders]);

    // Diviser les données par cryptoId pour avoir plusieurs courbes
    const groupedData = portfolioHistory.reduce((acc, dataPoint) => {
        if (!acc[dataPoint.cryptoId]) {
            acc[dataPoint.cryptoId] = [];
        }
        acc[dataPoint.cryptoId].push(dataPoint);
        return acc;
    }, {});

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div>
                <h3>Valeur du portefeuille dans le temps</h3>
                {Object.keys(groupedData).map(cryptoId => (
                    <div key={cryptoId}>
                        <h4>Crypto : {cryptoId}</h4>
                        <LineChart
                            dataset={groupedData[cryptoId]}
                            xAxis={[{ dataKey: 'x' }]}
                            series={[{ dataKey: 'y', showMark: false }]}
                            height={300}
                            margin={{ left: 60, right: 30, top: 30, bottom: 30 }}
                            grid={{ vertical: true, horizontal: true }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PortfolioChart;