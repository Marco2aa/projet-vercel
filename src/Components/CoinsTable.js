import React, { useState, useEffect } from 'react';
import axios from "axios";
import { numberWithCommas } from './Banner/Carousel.js';
import { CryptoState } from '../Context/CryptoContext.js';
import { useNavigate } from "react-router-dom";
import { makeStyles } from '@mui/styles';
import { FormControl, Select, MenuItem, LinearProgress, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Container } from '@mui/material';
import { Box, Typography } from '@material-ui/core';
import { BASE_URL } from "../config/api.js"


const CoinsTable = () => {
    const [coins, setCoins] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const [value, setValue] = useState(1)

    const { currency, devises, setCurrency } = CryptoState();
    console.log(devises);
    console.log("devise", currency)

    const fetchCoins = async () => {
        setLoading(true);
        let allCoins = [];
        try {
            const response = await axios.get(`${BASE_URL}/api/cryptos`);
            const data = response.data;
            allCoins = data['hydra:member'];
            setCoins(allCoins);
            setLoading(false);
            console.log(allCoins);
        } catch (error) {
            console.error("Error fetching coins:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoins();
    }, []);

    useEffect(() => {
        if (devises && devises.length > 0) {
            const newValue = devises.find((devise) => devise.name === currency);
            if (newValue) {
                setValue(newValue.valeur);
                console.log(newValue.valeur)
            }
        }
    }, [currency, devises]);

    // const darktheme = createTheme({
    //     palette: {
    //         primary: {
    //             main: "#c0bfbe",
    //         }
    //     },
    //     type: "dark",
    // });

    const handleSearch = () => {
        return coins.filter((coin) => (
            coin.name
                .toLowerCase().replace(/[^a-z0-9]/g, '')
                .includes(search.toLowerCase().replace(/[^a-z0-9]/g, '')
                )
        ));
    };

    const useStyles = makeStyles(() => ({
        row: {
            backgroundColor: "16171a",
            cursor: "pointer",
            "&:hover": {
                backgroundColor: "#131111"
            },
            fontFamily: "Montserrat"
        },
        pagination: {
            "& .MuiPaginationItem-root": {
                color: "orange"
            },
        },
    }));

    const classes = useStyles();
    console.log(coins);

    return (
        // <ThemeProvider theme={darktheme}>
        <Container style={{ textAlign: "center" }}>

            <Typography variant='h4' style={{ margin: 18, fontFamily: 'Montserrat' }}>
                CryptoMonnaies par parts de marché
            </Typography>
            <Box
                sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "flex-start", gap: 2 }}
            >
                <FormControl sx={{ minWidth: 120, mt: 0 }}> {/* Supprimer la marge */}
                    <Select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        label="Devise"
                        autoWidth
                    >
                        {devises.map((devise) => (
                            <MenuItem key={devise.id} value={devise.name}>{devise.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Recherchez une Crypto Monnaie"
                    variant="outlined"
                    sx={{ mb: 2, width: "100%" }}
                    InputLabelProps={{ style: { color: "white" } }}
                    inputProps={{ style: { borderColor: "white", color: "white" } }}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </Box>


            <TableContainer>
                {loading ? (
                    <LinearProgress style={{ backgroundColor: "orange" }} />
                ) : (
                    <Table>
                        <TableHead style={{ backgroundColor: "orange" }}>
                            <TableRow>
                                {["Coin", "Rank", "Price", "24h Change", "Market Cap"].map((head) => (
                                    <TableCell
                                        style={{
                                            color: "black",
                                            fontWeight: "700",
                                            fontFamily: "Montserrat",
                                        }}
                                        key={head}
                                        align={head === "Coin" ? "" : "right"}
                                    >
                                        {head}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {handleSearch().slice((page - 1) * 10, (page - 1) * 10 + 10).map((row) => {
                                const profit = row.price_change_percentage_24h > 0;
                                return (
                                    <TableRow
                                        onClick={() => navigate(`/coins/${row.idenitifiant}`)}
                                        className={classes.row}
                                        key={row.name}
                                    >
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                display: "flex",
                                                gap: 15,
                                            }}
                                        >
                                            <img
                                                src={row?.image}
                                                alt={row.name}
                                                height="50"
                                                style={{ marginBottom: 10 }}
                                            />
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        textTransform: "uppercase",
                                                        fontSize: 22,
                                                        color: "white",
                                                    }}
                                                >
                                                    {row.symbol}
                                                </span>
                                                <span style={{ color: "darkgray" }}>
                                                    {row.name}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell align="right">
                                            <span style={{ color: "white" }}>

                                                {row.market_cap_rank}
                                            </span>
                                        </TableCell>
                                        <TableCell align="right">
                                            <span style={{ color: "white" }}>

                                                {numberWithCommas((row.current_price * value).toFixed(2))}{currency}
                                            </span>
                                        </TableCell>
                                        <TableCell
                                            align='right'
                                            style={{
                                                color: profit ? "rgb(14, 203, 129)" : "red"
                                            }}
                                        >
                                            {profit && "+"}
                                            {row.price_change_percentage_24h.toFixed(2)}%
                                        </TableCell>
                                        <TableCell align='right'>
                                            <span style={{ color: "white" }}>

                                                {numberWithCommas(
                                                    (row.market_cap * value).toString().slice(0, -6)
                                                )}
                                                M
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            <Pagination
                style={{
                    padding: 20,
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    borderColor: "lightgrey",
                    color: "lightgrey"
                }}
                classes={{ ul: classes.pagination }}
                count={(handleSearch()?.length / 10).toFixed(0)}
                onChange={(_, value) => {
                    setPage(value);
                    window.scroll(0, 450);
                }}
            />
        </Container>
        // </ThemeProvider>
    );
};

export default CoinsTable;
