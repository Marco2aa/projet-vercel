import React, { useState, useEffect } from 'react'
import { CryptoState } from '../Context/CryptoContext'
import AutocompleteHint from './Autocomplete';
import { Button, InputAdornment, TextField } from '@mui/material';
import SelectWallet from './SelectWallet';
import axios from 'axios'
import { useNavigate } from 'react-router';
import { loadStripe } from '@stripe/stripe-js';
import { BASE_URL } from '../config/api';


const Deposit = () => {

    const { currency, devises } = CryptoState()
    const [selectedValue, setSelectedValue] = useState(null);
    const [montant, setMontant] = useState(0)
    const [wallet, setWallet] = useState([])
    const [selectedWallet, setSelectedWallet] = useState('')
    const [sessionId, setSessionId] = useState('')
    const [username, setUsername] = useState(null)

    const navigate = useNavigate()

    const token = localStorage.getItem('jwtToken')


    const handleEuroDeposit = async () => {
        const stripe = await loadStripe('pk_test_51Ovg9SK0rs45oKLrHtLQYiAIGDvnTmnLNl0PhVWSq7fUI5q9i4nrpGInw3rSf02dT9iSpZXOQzmUOTytWIBD2Kom00bcCSMTyd')
        if (selectedValue && thisWallet) {
            const token = localStorage.getItem('jwtToken');


            const montantEuros = montant / selectedValue.valeur;
            try {

                const decodedToken = decodeJWT(token);
                const username = decodedToken.username;
                console.log(decodedToken)
                console.log(username)
                setUsername(username);

                const response = await axios.post(
                    `${BASE_URL}/api/create-checkout-session`,
                    {
                        montantEuros: montantEuros.toFixed(2),
                        deviseId: parseInt(selectedValue.id),
                        email: username,
                        walletId: parseInt(thisWallet.id),
                        type: "Dépôt"

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
        } else {
            console.log('No value selected');
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


    const handleSelectWallet = (selectedValue) => {
        console.log("Wallet selected:", selectedValue);
        setSelectedWallet(selectedValue)
    }

    useEffect(() => {
        fetchWallet()
    }, [])

    const fetchWallet = async () => {
        try {
            console.log(token)
            const response = await axios.get('https://localhost:8000/api/walletuser', {
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

    const handleSelectedValueChange = (newValue) => {
        setSelectedValue(newValue);
    }

    const thisWallet = wallet.find(item => item.name === selectedWallet)
    console.log(thisWallet);

    return (
        <div style={{ width: '100%', }}>
            <div style={{ width: '50%', margin: 'auto', marginTop: 40, border: 'solid 1px grey', borderRadius: '8px', }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '20px' }}>
                    <SelectWallet wallets={wallet} onSelect={handleSelectWallet} />
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '35px', fontFamily: 'Poppins' }}>
                        <AutocompleteHint
                            options={devises}
                            label="Devises"
                            id="2"
                            onChange={handleSelectedValueChange}
                        />
                        <p style={{ fontWeight: 600 }}>
                            {selectedValue ? '1 ' + selectedValue.name + '=' : ''}
                            {selectedValue ? (1 / selectedValue.valeur).toString().slice(0, 6) : ''}
                            {selectedValue ? '€' : ''}
                        </p>
                    </div>
                    <TextField
                        fullWidth
                        value={montant}
                        onChange={(e) => setMontant(e.target.value)}
                        color='warning'
                        label="Déposer"
                        placeholder='Saisissez un montant'
                        type="number"
                        InputProps={{
                            startAdornment: <InputAdornment position="start">{selectedValue ? selectedValue.name : ''}</InputAdornment>,
                        }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', margin: 'auto', gap: '20px' }}>
                            <p style={{ fontWeight: 700, fontFamily: 'Poppins', justifyContent: 'space-around' }}>
                                {thisWallet ? 'Portefeuille : ' + thisWallet.name : ''}

                            </p>
                            <p>|</p>
                            <p style={{ fontWeight: 700, fontFamily: 'Poppins', margin: 'auto' }}>
                                {thisWallet ? 'Solde : ' + thisWallet.solde + ' €' : ''}

                            </p>
                        </div>
                        <p style={{ fontWeight: 700, fontFamily: 'Poppins', margin: 'auto' }}> Montant reçu : {selectedValue ? (montant / selectedValue.valeur).toString().slice(0, 6) : 0} € </p>
                        <p style={{ fontWeight: 700, fontFamily: 'Poppins', margin: 'auto' }}>Montant du solde après opération
                            <span> : </span>
                            <span style={{ marginLeft: '10px', fontWeight: 700, fontFamily: 'Poppins', color: 'orange' }}>
                                {thisWallet && selectedValue ? (thisWallet.solde + montant / selectedValue.valeur) : ''} €
                            </span>
                        </p>
                    </div>
                    <button style={{
                        height: "55px",
                        backgroundColor: "orange",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        color: 'black',
                        fontSize: "1.2em",
                        fontWeight: "500",
                        width: "100%"
                    }} onClick={() => handleEuroDeposit()} >Déposer</button>
                </div>
            </div>
        </div>
    )
}

export default Deposit
