import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { CryptoState } from '../Context/CryptoContext.js';
import { makeStyles } from '@mui/styles';
import { LinearProgress, Typography, Box } from '@mui/material';
import axios from 'axios';
import CoinInfo from '../Components/CoinInfo.js';
import { numberWithCommas } from '../Components/Banner/Carousel.js';
import { SingleCoin } from '../config/api.js';

const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState();
  const { currency, symbol } = CryptoState();

  const fetchCoin = async () => {
    const { data } = await axios.get(SingleCoin(id));
    setCoin(data);
  };

  useEffect(() => {
    fetchCoin();
  }, []);

  const useStyles = makeStyles((theme) => ({
    container: {
      display: "flex",
      [theme.breakpoints.down("md")]: {
        flexDirection: "column",
        alignItems: "center",
      },
    },
    sidebar: {
      width: "30%",
      [theme.breakpoints.down("md")]: {
        width: "100%",
      },
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: 25,
      borderRight: "2px solid grey",
    },
    heading: {
      fontWeight: "bold",
      marginBottom: 20,
      fontFamily: "Montserrat",
    },
    description: {
      width: "100%",
      fontFamily: "Montserrat",
      padding: 25,
      paddingBottom: 15,
      paddingTop: 0,
      textAlign: "justify",
    },
    marketData: {
      alignSelf: "start",
      padding: 25,
      paddingTop: 10,
      width: "100%",
      display: "flex",
      gap: "10px",
      flexDirection: "column",
      [theme.breakpoints.up("md")]: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
      },
      [theme.breakpoints.down("sm")]: {
        alignItems: "center",
      },
      [theme.breakpoints.down("xs")]: {
        alignItems: "start",
      },
    },
    gaugeContainer: {
      width: "100%",
      marginTop: 20,
      textAlign: "center",
    },
  }));

  const classes = useStyles();

  if (!coin) return <LinearProgress style={{ backgroundColor: "gold" }} />;

  // Calcul de la position de la jauge
  const low24h = coin?.market_data.low_24h[currency.toLowerCase()];
  const high24h = coin?.market_data.high_24h[currency.toLowerCase()];
  const currentPrice = coin?.market_data.current_price[currency.toLowerCase()];
  const gaugePosition = ((currentPrice - low24h) / (high24h - low24h)) * 100;

  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>
        <img
          src={coin?.image.large}
          alt={coin?.name}
          height="200"
          style={{ marginBottom: 20 }}
        />
        <Typography variant="h3" className={classes.heading}>
          {coin?.name}
        </Typography>
        <Typography variant="subtitle1" className={classes.description}>
          {coin?.description.en.split(". ")[0]}.
        </Typography>
        <div className={classes.marketData}>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Rang:
            </Typography>
            &nbsp; &nbsp;
            <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
              {numberWithCommas(coin?.market_cap_rank)}
            </Typography>
          </span>

          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Prix Actuel:
            </Typography>
            &nbsp; &nbsp;
            <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
              {symbol} {numberWithCommas(currentPrice)} €
            </Typography>
          </span>

          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Capitalisation:
            </Typography>
            &nbsp; &nbsp;
            <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
              {symbol}{" "}
              {numberWithCommas(
                coin?.market_data.market_cap[currency.toLowerCase()]
                  .toString()
                  .slice(0, -6)
              )}
              M €
            </Typography>
          </span>

          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              ATH:
            </Typography>
            &nbsp; &nbsp;
            <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
              {symbol} {numberWithCommas(coin?.market_data.ath[currency.toLowerCase()])} €
            </Typography>
          </span>

          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              ATL:
            </Typography>
            &nbsp; &nbsp;
            <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
              {symbol} {numberWithCommas(coin?.market_data.atl[currency.toLowerCase()])} €
            </Typography>
          </span>

          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Volume (24h):
            </Typography>
            &nbsp; &nbsp;
            <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
              {symbol} {numberWithCommas(coin?.market_data.total_volume[currency.toLowerCase()])} €
            </Typography>
          </span>

          {/* Jauge ATH */}
          <Box className={classes.gaugeContainer}>
            <Typography variant="h5" className={classes.heading}>
              Price Range (24h):
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Low: {symbol} {numberWithCommas(low24h)} € - High: {symbol} {numberWithCommas(high24h)} €
            </Typography>
            <LinearProgress
              variant="determinate"
              value={gaugePosition}
              style={{
                height: 10,
                borderRadius: 5,
                backgroundColor: "orange",
              }}
            />
            <Typography variant="body2" style={{ marginTop: 5 }}>
              Prix Actuel: {symbol} {numberWithCommas(currentPrice)} €
            </Typography>
          </Box>
        </div>
      </div>
      <CoinInfo coin={coin} />
    </div>
  );
};

export default CoinPage;
