import React, { useEffect, useState } from 'react'
import { makeStyles } from '@mui/styles'
import { GetDataBaseCoins, TrendingCoins } from '../../config/api.js';
import { CryptoState } from '../../Context/CryptoContext.js';
import axios from 'axios';
import AliceCarousel from 'react-alice-carousel'
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    carousel: {
        height: "100%",
        display: "flex",
        alignItems: "center"
    },
    carouselItem: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        textTransform: "uppercase",
        color: "white",
    },

}))

export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



const Carousel = () => {
    const [trending, setTrending] = useState([])
    const [value, setValue] = useState(1)
    const classes = useStyles();
    const { currency, symbol, devises } = CryptoState()
    const fetchTrendingCoins = async () => {
        const { data } = await axios.get(GetDataBaseCoins(1));
        console.log(data);
        setTrending(data['hydra:member']);
    };

    useEffect(() => {
        if (devises && devises.length > 0) {
            const newValue = devises.find((devise) => devise.nom === currency);
            if (newValue) {
                setValue(newValue.valeur);
                console.log(newValue.valeur)
            }
        }
    }, [currency, devises]);

    console.log(trending);

    useEffect(() => {
        fetchTrendingCoins();
    }, [currency]);

    const responsive = {
        0: {
            items: 2,
        },
        512: {
            items: 5,
        }
    }

    const items = trending.map((coin) => {
        let profit = coin.price_change_percentage_24h >= 0

        return (
            <Link
                className={classes.carouselItem}
                to={`/coins/${coin.id}`}>
                <img
                    src={coin?.image}
                    alt={coin.name}
                    height="80"
                    style={{ marginBottom: 10 }} />

                <span>{coin?.symbol}
                    &nbsp;
                    <span
                        style={{
                            color: profit > 0 ? "rgb(14,203,129)" : "red",
                            fontWeight: 500,
                        }}

                    >
                        {profit && '+'} {coin?.price_change_percentage_24h?.toFixed(2)}%
                    </span>
                </span>

                <span style={{
                    fontSize: 22,
                    fontWeight: 500
                }}>
                    {symbol} {numberWithCommas((coin?.current_price * value).toFixed(2))}
                </span>

            </Link>
        )
    })

    return (
        <div className={classes.carousel}>
            <AliceCarousel
                mouseTracking
                infinite
                autoPlayInterval={1000}
                animationDuration={1500}
                disableDotsControls
                responsive={responsive}
                autoPlay
                items={items}>

            </AliceCarousel>
        </div>
    )
}

export default Carousel
