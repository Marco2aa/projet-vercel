import * as React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Autocomplete, Button, InputAdornment, Slider, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import AutocompleteHint from './Autocomplete';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { CryptoState } from '../Context/CryptoContext';
import SelectWallet from './SelectWallet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './RegisterForm/RegisterForm.css'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { loadStripe } from '@stripe/stripe-js';
import { BASE_URL } from '../config/api';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';






function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3, backgroundColor: 'transparent' }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}



TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

export default function BuyCrypto() {
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const { currency, devises } = CryptoState();
    const [loading, setLoading] = useState(false);
    const [coins, setCoins] = useState([]);
    const [page, setPage] = useState(1);
    const [pageTitle, setPageTitle] = useState('Achetez des Cryptos.');
    const [selectedPercentage, setSelectedPercentage] = useState(0);
    const [amount, setAmount] = useState('');
    const [amountToSpend, setAmountToSpend] = useState(0);
    const [amountToReceive, setAmountToReceive] = useState(null);
    const [solde, setSolde] = useState(0)
    const [selectedValue, setSelectedValue] = useState(null);
    const [wallet, setWallet] = useState([])
    const [selectedWallet, setSelectedWallet] = useState('')
    const [error, setError] = useState(false)
    const [cryptoSelected, setCryptoSelected] = useState(null);
    const [deviseSelected, setDeviseSelected] = useState(null);
    const [sessionId, setSessionId] = useState(null)
    const [username, setUsername] = useState(null)
    const [availableCryptos, setAvailableCryptos] = useState([]);
    const [amountToSell, setAmountToSell] = useState(0);
    const [maxAmount, setMaxAmount] = useState(0);
    const [selectedCrypto, setSelectedCrypto] = useState(null);

    const thisWallet = wallet.find(item => item.name === selectedWallet)
    console.log(thisWallet);


    const handleBuyDeposit = async () => {
        const stripe = await loadStripe('pk_test_51Ovg9SK0rs45oKLrHtLQYiAIGDvnTmnLNl0PhVWSq7fUI5q9i4nrpGInw3rSf02dT9iSpZXOQzmUOTytWIBD2Kom00bcCSMTyd')
        const token = localStorage.getItem('jwtToken');
        try {

            const decodedToken = decodeJWT(token);
            const username = decodedToken.username;
            console.log(decodedToken)
            console.log(username)
            setUsername(username);

            const response = await axios.post(
                `${BASE_URL}/api/create-checkout-session/buy-and-sell`,
                {
                    cryptoId: parseInt(cryptoSelected.id),
                    email: username,
                    walletId: parseInt(thisWallet.id),
                    quantity: (amountToReceive.toFixed(5)),
                    amount: amount,
                    deviseId: parseInt(deviseSelected.id),
                    deviseValue: deviseSelected.valeur,
                    cryptoValue: cryptoSelected.current_price,
                    type: "Achat"

                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                }
            );
            console.log(response.data);
            setSessionId(response.data.sessionId)
            stripe.redirectToCheckout({
                sessionId: response.data.sessionId
            })
        } catch (error) {
            console.error(error);
        }

    };

    const fetchUserCryptos = async (walletId) => {
        const token = localStorage.getItem('jwtToken');
        try {
            const response = await axios.get(`${BASE_URL}/api/user-cryptos?walletId=${thisWallet.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });
            console.log(wallet)
            // Mettre à jour la liste des cryptos disponibles à la vente
            setAvailableCryptos(response.data);
        } catch (error) {
            console.error('Error fetching user cryptos:', error);
        }
    };

    useEffect(() => {
        if (selectedWallet) {
            fetchUserCryptos(selectedWallet.id);
        }
    }, [selectedWallet]);

    const handleSellCrypto = async () => {
        const token = localStorage.getItem('jwtToken');
        const decodedToken = decodeJWT(token);
        const username = decodedToken.username;
        setUsername(username);
        const cryptoName = selectedCryptoSell.label.split(" - ")[0];
        try {
            const response = await axios.post(
                `${BASE_URL}/api/sellorder`,
                {
                    type: 'Vente',
                    cryptoId: cryptoName,
                    walletId: parseInt(thisWallet.id),
                    quantity: ((selectedPercentageSell / 100) * portfolioData.cryptoTotals[selectedCryptoSell.value]).toFixed(2),
                    userId: username,
                    cryptoValue: (portfolioData.cryptoTotals[selectedCryptoSell.value] / portfolioData.cryptoByToken[selectedCryptoSell.value]).toFixed(2),


                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                }
            );
            toast.success('Vente de Crypto réussi !');
            console.log('Order created successfully:', response.data);
        } catch (error) {
            toast.error('La vente a echoué , veuillez recommencer plus tard');
            console.error('Error creating sell order:', error);
        }
    };

    const decodeJWT = (token) => {
        try {
            const payload = token.split('.')[1];
            const decodedPayload = atob(payload);
            const parsedPayload = JSON.parse(decodedPayload);
            console.log(parsedPayload)
            return parsedPayload;
        } catch (error) {
            console.error('Error decoding JWT:', error);
            return null;
        }
    };


    const calculateAmount = (percentage) => {
        const walletBalance = thisWallet.solde;
        const calculatedAmount = (percentage / 100) * walletBalance * deviseSelected.valeur;
        return calculatedAmount.toFixed(2);
    };

    useEffect(() => {
        if (cryptoSelected && deviseSelected) {
            const calculatedAmountToReceive = calculateAmountToReceive(amount, cryptoSelected, deviseSelected);
            console.log(amount, cryptoSelected.current_price, deviseSelected.valeur, calculatedAmountToReceive)
            setAmountToReceive(calculatedAmountToReceive)

        }
    }, [cryptoSelected, deviseSelected, amount]);

    const calculateAmountToReceive = (amountToSpend, cryptoSelected, deviseSelected) => {
        const sum = amountToSpend / deviseSelected.valeur / cryptoSelected.current_price
        return sum

    };




    const handlePercentageChange = (event, newValue) => {
        setSelectedPercentage(newValue);
        const newAmount = calculateAmount(newValue);
        setAmount(newAmount);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (newValue === 0) {
            setPageTitle('Achetez des  Cryptos.');
        } else if (newValue === 1) {
            setPageTitle('Vendez vos  Cryptos.');
        }
    };



    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const fetchCoins = useCallback(async () => {
        setLoading(true);
        let allCoins = [];
        try {
            for (let page = 1; page <= 4; page++) {
                const response = await axios.get(`${BASE_URL}/api/cryptos?page=${page}`);
                const data = response.data;
                allCoins = [...allCoins, ...data['hydra:member']];
            }

            setCoins(allCoins);
            setLoading(false);
            console.log(allCoins);
        } catch (error) {
            console.error("Error fetching coins:", error);
            setLoading(false);
        }
    }, [currency, page]);

    useEffect(() => {
        fetchCoins();
    }, [fetchCoins]);

    useEffect(() => {
        fetchWallet()
    }, [])

    const fetchWallet = async () => {
        try {
            const token = localStorage.getItem('jwtToken')
            console.log(token)
            const response = await axios.get(`${BASE_URL}/api/walletuser`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            })
            console.log(response.data)

            setWallet(response.data)
        } catch (error) {
            console.error('erreur lors de la recuperation du portefeuille :', error)
        }

    }


    const useStyles = makeStyles(() => ({
        title: {
            fontFamily: "Poppins",
            fontWeight: "700",
            marginBottom: "50px"


        },
        form: {
            display: "flex",
            gap: "20px",
            flexDirection: "column",
            width: "100%",
            marginTop: "5px",
            marginBottom: '5px'
        },

        button: {
            height: "55px",
            backgroundColor: "orange",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1.2em",
            fontWeight: "500",
            width: "100%",
            // marginTop: '10px'
        },
        div: {
            display: "flex",
            width: "100%",
            flexDirection: "column",
            gap: "10px"
        },
        fields: {

            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            gap: "10px"
        },
        fivecryptos: {
            borderRadius: '8px',
            border: 'solid 1px grey',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            fontFamily: 'Poppins',
            fontWeight: '500',
            padding: '15px'

        },
        icon: {
            height: '20px',
            width: '20px'
        }

    }))

    const classes = useStyles()

    const handleCryptoSelectedChange = (newValue) => {
        setCryptoSelected(newValue);
    }

    const handleDeviseSelectedChange = (newValue) => {
        setDeviseSelected(newValue);
    }

    const handleSelectWallet = (selectedValue) => {
        console.log("Wallet selected:", selectedValue);
        setSelectedWallet(selectedValue)
    }

    const handleAmountChange = (e) => {
        const inputValue = e.target.value;
        if (inputValue === '') {
            setError(false);
            setAmount(inputValue);
        } else if (parseFloat(inputValue) <= thisWallet.solde) {
            setAmount(inputValue);
            setError(false);
        } else {
            setAmount(thisWallet.solde.toString());
            setError(true);
        }
    };

    const [portfolioData, setPortfolioData] = useState({
        cryptoTotals: {},
        cryptoByToken: {},
        fiatBalance: 0,
    });

    // Fonction pour récupérer les données du portfolio
    const fetchPortfolioData = async () => {
        try {
            const token = localStorage.getItem('jwtToken')
            const response = await axios.get(`${BASE_URL}/api/portfolio`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            });
            const data = response.data;
            setPortfolioData({
                cryptoTotals: data.cryptoTotals,
                cryptoByToken: data.cryptoByToken,
                fiatBalance: data.fiatBalance,
            });
            console.log(portfolioData)
        } catch (error) {
            console.error('Erreur lors de la récupération des données du portfolio:', error);
        }
    };

    useEffect(() => {
        fetchPortfolioData();
    }, [selectedWallet]);

    // Options pour l'Autocomplete
    const cryptoOptions = Object.keys(portfolioData.cryptoTotals).map((crypto) => ({
        label: `${crypto} - Quantité: ${portfolioData.cryptoByToken[crypto].toFixed(4)}`,
        value: crypto,
    }));

    const [selectedCryptoSell, setSelectedCryptoSell] = useState(null);

    const selectedCryptoValueSell = selectedCryptoSell
        ? portfolioData.cryptoTotals[selectedCryptoSell.value].toFixed(2)
        : null;

    const [selectedPercentageSell, setSelectedPercentageSell] = useState(30);


    const handlePercentageChangeSell = (event, newValue) => {
        setSelectedPercentageSell(newValue);
    };



    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '250px',
            justifyContent: 'space-evenly',
            width: '100%',
            marginTop: 3,
        }}>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '60px' }}>
                <Typography fontWeight={700} variant="h2">{pageTitle}</Typography>
                <div className={classes.fivecryptos}>
                    <p style={{ marginLeft: '15px', fontWeight: 500 }}>Cryptos populaires</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {coins.slice(0, 5).map((coin) => (
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', justifyContent: 'space-between' }}>
                                <div style={{ marginLeft: '15px', display: 'flex', flexDirection: 'row', gap: '15px' }}>
                                    <img className={classes.icon} src={coin.image} />
                                    <p>{coin.symbol.toUpperCase()}</p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', marginRight: '15px', gap: '65px' }}>
                                    <p>{coin.currentPrice}</p>
                                    <p style={{
                                        color: coin.price_change_percentage_24h > 0 ? "rgb(14, 203, 129)" : "red"
                                    }}>{coin.price_change_percentage_24h} %</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </Box>
            <Box sx={{
                bgcolor: 'transparent',
                width: '100%',
                height: '100%',
                borderRadius: 5,
                // overflow: "hidden",
                border: '1px solid grey',
                marginTop: "20px"
            }} >
                <AppBar color='transparent' position="static"

                    sx={{
                        borderTopRightRadius: '8px',
                        borderTopLeftRadius: '8px',
                        width: '100%',
                    }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        textColor="inherit"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                        sx={{
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#FFA500',
                            },
                        }}
                    >
                        <Tab label="Acheter" {...a11yProps(0)} />
                        <Tab label="Vendre" {...a11yProps(1)} />
                    </Tabs>
                </AppBar>
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={value}
                    onChangeIndex={handleChangeIndex}
                >
                    <TabPanel sx={{
                        '& .MuiTabPanel-root': {
                            backgroundColor: 'transparent'
                        }
                    }} value={value} index={0} dir={theme.direction}>
                        <div
                            className={classes.form}>
                            <SelectWallet wallets={wallet} onSelect={handleSelectWallet} />

                            <div className={classes.div}>
                                <div className={classes.fields}>
                                    <div style={{ width: '100%' }}>
                                        <TextField
                                            id="outlined-number"
                                            color='warning'
                                            fullWidth
                                            label="Dépenser"
                                            type="text"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            placeholder={deviseSelected && thisWallet
                                                ? `0.00 - ${(thisWallet.solde * deviseSelected.valeur).toFixed(2)}`
                                                : ''}
                                            value={amount}
                                            onChange={handleAmountChange}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">{deviseSelected ? deviseSelected.name : ''}</InputAdornment>,
                                            }}
                                        />
                                        {console.log(thisWallet)}
                                        {error && (
                                            <p id="pwdnote" className={error ? "instructions" : "offscreen"}>
                                                <FontAwesomeIcon icon={faInfoCircle} />
                                                Le montant dépasse le solde maximum autorisé.
                                            </p>
                                        )}

                                    </div>


                                    <AutocompleteHint
                                        options={devises}
                                        label="Devises"
                                        id="2"
                                        onChange={handleDeviseSelectedChange}
                                    />
                                    {console.log(coins)}
                                </div>
                                <div className={classes.fields}>
                                    <TextField
                                        fullWidth
                                        color='warning'
                                        label="Recevoir"
                                        placeholder='0.00'
                                        type="text"
                                        value={amountToReceive}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">{cryptoSelected ? cryptoSelected.symbol : ''}</InputAdornment>,
                                        }}

                                    />
                                    <AutocompleteHint
                                        options={coins}
                                        label="Cryptos"
                                        id="1"
                                        onChange={handleCryptoSelectedChange}
                                    />
                                </div>
                            </div>
                            {thisWallet && deviseSelected && cryptoSelected &&
                                < Slider
                                    value={selectedPercentage}
                                    onChange={handlePercentageChange}
                                    aria-label="Temperature"
                                    defaultValue={30}
                                    color='warning'
                                    valueLabelDisplay="auto"
                                    shiftStep={30}
                                    step={10}
                                    marks
                                    min={0}
                                    max={100}
                                />
                            }
                            {deviseSelected && cryptoSelected &&
                                <>
                                    <Typography margin='auto' fontWeight={600}>
                                        Montant : {amount + deviseSelected.name}
                                    </Typography>
                                    <Typography margin='auto' fontWeight={600}>
                                        Montant en Euros: {(amount / deviseSelected.valeur).toFixed(2)} €
                                    </Typography>
                                </>
                            }


                            <button
                                onClick={() => handleBuyDeposit()}
                                className={classes.button}
                            >Recevoir</button>
                        </div>
                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                        <Box>
                            <div style={{
                                display: "flex",
                                width: "100%",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <SelectWallet wallets={wallet} onSelect={handleSelectWallet} />
                            </div>
                            {/* Autocomplete pour choisir la crypto à vendre */}

                            <Box sx={{ p: 3 }}>
                                {/* Affichage du solde fiat */}

                                {/* Autocomplete pour les cryptos possédées */}
                                <Autocomplete
                                    options={cryptoOptions}
                                    sx={{ marginBottom: 3 }}
                                    getOptionLabel={(option) => option.label}
                                    onChange={(event, newValue) => setSelectedCryptoSell(newValue)}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Rechercher une crypto" variant="outlined" />
                                    )}
                                    renderOption={(props, option) => (
                                        <li {...props} key={option.value}>
                                            {option.label}
                                        </li>
                                    )}
                                />
                                {selectedCryptoSell && (
                                    <>
                                        <Typography variant="body1" sx={{ mt: 2 }}>
                                            Valeur de {selectedCryptoSell.value} en euros : {selectedCryptoValueSell} €
                                        </Typography>
                                        <Slider
                                            value={selectedPercentageSell}
                                            onChange={handlePercentageChangeSell}
                                            aria-label="Pourcentage de crypto"
                                            defaultValue={30}
                                            color="warning"
                                            valueLabelDisplay="auto"
                                            step={10}
                                            marks
                                            min={0}
                                            max={100}
                                            sx={{ mt: 2 }} // Ajout d'un peu d'espace au-dessus du slider
                                        />
                                        <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
                                            Quantité sélectionnée : {((selectedPercentageSell / 100) * portfolioData.cryptoTotals[selectedCryptoSell.value]).toFixed(2)} EUR
                                        </Typography>
                                    </>
                                )}
                                <button
                                    onClick={() => handleSellCrypto()}
                                    className={classes.button}
                                >Vendre</button>
                            </Box>
                        </Box>
                    </TabPanel>
                </SwipeableViews>
            </ Box >
        </Box>
    );
}