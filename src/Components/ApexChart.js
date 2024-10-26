import React from 'react';
import ReactApexChart from 'react-apexcharts'; // Import ReactApexChart
import axios from 'axios'; // Import Axios
import { BASE_URL } from '../config/api';

export default class ApexChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [], // Initialiser la série de données vide
            options: {
                legend: {
                    show: true,
                    labels: {
                        colors: '#000', // Couleur noire pour la légende
                    },
                },
                chart: {
                    height: 350,
                    type: 'treemap',
                    // Ajout des marges de 10% à gauche et à droite
                    margin: {
                        left: '10%',
                        right: '10%'
                    }
                },
                theme: {
                    palette: 'palette1', // Palette de couleurs pour rendre le texte visible
                },
                title: {
                    text: 'Treemap with Color scale',
                    align: 'center', // Centrer le titre
                    style: {
                        color: "orange",
                        fontSize: "20px"
                    }
                },
                tooltip: {
                    theme: 'dark', // Changer le thème du tooltip pour éviter le blanc sur blanc
                    style: {
                        fontSize: '16px',
                        color: '#000' // Couleur du texte du tooltip en noir
                    }
                },
                dataLabels: {
                    enabled: true,
                    style: {
                        fontSize: '20px',
                    },
                    formatter: function (text, op) {
                        return [text, op.value];
                    },
                    offsetY: -4
                },
                plotOptions: {
                    treemap: {
                        enableShades: true,
                        shadeIntensity: 0.5,
                        reverseNegativeShade: true,
                        colorScale: {
                            ranges: [
                                {
                                    from: -100,
                                    to: 0,
                                    color: '#CD363A'
                                },
                                {
                                    from: 0.001,
                                    to: 100,
                                    color: '#52B12C'
                                }
                            ]
                        }
                    }
                }
            }
        };
    }

    componentDidMount() {
        this.fetchCryptoData();
    }

    fetchCryptoData = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/cryptos`); // Remplacer l'URL par votre endpoint
            const data = response.data['hydra:member'];

            // Transformer les données pour le treemap
            const transformedData = data.map((crypto) => ({
                x: crypto.name,
                y: crypto.market_cap_change_percentage_24h, // Utiliser la variation du market cap sur 24h comme valeur
            }));

            this.setState({
                series: [
                    {
                        data: transformedData
                    }
                ]
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
        }
    };

    render() {
        return (
            <div style={{ margin: '0 5%' }}>
                <div id="chart">
                    <ReactApexChart
                        options={this.state.options}
                        series={this.state.series}
                        type="treemap"
                        height={950}
                    />
                </div>
                <div id="html-dist"></div>
            </div>
        );
    }
}
