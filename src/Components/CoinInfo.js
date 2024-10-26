import React, { useEffect, useState } from 'react';
import { HistoricalChart } from '../config/api.js';
import axios from 'axios';
import { useTheme } from '@material-ui/core';
import { CircularProgress, ThemeProvider, createTheme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import SelectButton from './SelectButton.js';
import { chartDays } from '../config/data.js';
import { CryptoState } from '../Context/CryptoContext.js';

ChartJS.register(...registerables);

const CoinInfo = ({ coin }) => {
  const [historicalData, setHistoricalData] = useState();
  const [days, setDays] = useState(1);

  const { currency } = CryptoState();

  const theme = useTheme();
  const matchesMD = useMediaQuery(theme.breakpoints.down('md'));

  const fetchHistoricData = async (id, days, currency) => {
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}&x_cg_demo_api_key=CG-gDHAm9CSTV5ATdZaHa7Xx7JS`
    );
    setHistoricalData(data.prices);
    console.log(data.prices);
  };

  useEffect(() => {
    fetchHistoricData(coin.id, days, currency);
    console.log(coin)
  }, [currency, days]);

  const useStyles = makeStyles(() => ({
    container: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 25,
      padding: 40,
      overflow: 'hidden', // Added to prevent overflow
      ...(matchesMD && {
        width: '100%',
        marginTop: 0,
        padding: 20,
        paddingTop: 0,
      }),
    },
  }));

  const classes = useStyles();

  return (
    <div className={classes.container}>
      {!historicalData ? (
        <CircularProgress style={{ color: 'orange' }} size={250} thickness={1} />
      ) : (
        <>
          <Line
            data={{
              labels: historicalData.map((coin) => {
                let date = new Date(coin[0]);
                let time =
                  date.getHours() > 12
                    ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                    : `${date.getHours()}:${date.getMinutes()} AM`;

                return days === 1 ? time : date.toLocaleDateString();
              }),
              datasets: [
                {
                  data: historicalData.map((coin) => coin[1]),
                  label: `Price (Past ${days} Days) in ${currency}`,
                  borderColor: '#EEBC1D',
                  fill: false,
                },
              ],
            }}
            options={{
              elements: {
                point: {
                  radius: 1,
                },
              },
              scales: {
                x: {
                  ticks: {
                    autoSkip: true,
                    maxTicksLimit: 10,
                  },
                },
              },
            }}
            style={{
              maxWidth: '100%',
            }}
          />
          <div
            style={{
              display: 'flex',
              marginTop: 20,
              justifyContent: 'space-around',
              width: '100%',
            }}
          >
            {chartDays.map((day) => (
              <SelectButton key={day.value} onClick={() => setDays(day.value)} selected={day.value === days}>
                {day.label}
              </SelectButton>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CoinInfo;
