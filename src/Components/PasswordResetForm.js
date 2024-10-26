import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from '../config/api';

function PasswordResetForm() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { token } = useParams(); // Récupération du token depuis l'URL
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const notifysuccess = () => toast('Mot de passe réinitialisé avec succès!');
    const notifyfailure = () => toast('Échec de la réinitialisation du mot de passe.');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        try {
            await axios.post(`${BASE_URL}/api/reset-password/${token}`, {
                newPassword,
            });
            notifysuccess();
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            notifyfailure();
            setError('Erreur lors de la réinitialisation. Veuillez réessayer.');
        }
    };

    return (
        <Box
            sx={{
                width: 500,
                marginTop: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                p: 2,
                flexDirection: 'column',
                justifyContent: 'center',
                border: '1px solid grey',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
            }}
        >
            <Typography variant='h5' sx={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: '50px' }}>
                Réinitialiser votre mot de passe
            </Typography>
            <form
                style={{ display: 'flex', flexDirection: 'column', gap: '35px', width: '100%', marginBottom: '10px' }}
                onSubmit={handleSubmit}
            >
                <TextField
                    fullWidth
                    color='warning'
                    label="Nouveau mot de passe"
                    value={newPassword}
                    type="password"
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <TextField
                    fullWidth
                    color='warning'
                    label="Confirmez le mot de passe"
                    value={confirmPassword}
                    type="password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                {error && <Typography color="error">{error}</Typography>}
                <Button
                    type="submit"
                    variant="contained"
                    sx={{
                        height: '55px',
                        backgroundColor: 'orange',
                        borderRadius: '8px',
                        fontSize: '1.2em',
                        fontWeight: 500,
                        textTransform: 'none'
                    }}
                >
                    Réinitialiser le mot de passe
                </Button>
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

export default PasswordResetForm;
