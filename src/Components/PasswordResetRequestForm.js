import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Typography } from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from '../config/api';

function PasswordResetRequestForm() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // État pour gérer l'état d'envoi

    const useStyles = makeStyles(() => ({
        title: {
            fontFamily: "Poppins",
            fontWeight: "700",
            marginBottom: "50px"
        },
        form: {
            display: "flex",
            gap: "35px",
            flexDirection: "column",
            width: "100%",
            marginBottom: "10px"
        },
        button: {
            height: "55px",
            backgroundColor: "orange",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1.2em",
            fontWeight: "500"
        }
    }));

    const classes = useStyles();

    const notifysuccess = () => toast.success('Un email de réinitialisation a été envoyé !');
    const notifyfailure = () => toast.error('Échec de la demande de réinitialisation.');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BASE_URL}/api/forgot-password`, {
                email,
            });

            console.log('Password reset email sent:', response.data);
            notifysuccess();
        } catch (error) {
            console.error('Error sending password reset email:', error.message);
            notifyfailure();
        }
    };


    return (
        <Box
            width={500}
            marginTop={10}
            display="flex"
            alignItems="center"
            gap={4}
            p={2}
            flexDirection='column'
            justifyContent='center'
            sx={{
                border: '1px solid grey',
                borderRadius: '16px'
            }}
        >
            <Typography variant='h5' className={classes.title}>
                Demande de réinitialisation de mot de passe
            </Typography>
            <form className={classes.form} onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    color='warning'
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                />
                <button
                    className={classes.button}
                    type="submit"
                    disabled={isSubmitting} // Désactive le bouton pendant l'envoi
                >
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
                </button>
            </form>

            <ToastContainer
                position="bottom-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </Box>
    );
}

export default PasswordResetRequestForm;
