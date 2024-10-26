import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Box, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Typography } from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from '../Context/AuthContext';
import PasswordResetRequestForm from './PasswordResetRequestForm'; // Assurez-vous d'importer ce composant

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

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

  // Modification des notifications de succès et d'échec
  const notifysuccess = (message) => toast.success(message);
  const notifyfailure = (message) => toast.error(message);

  const classes = useStyles();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      await login(email, password, notifysuccess, notifyfailure, navigate);
    } else {
      notifyfailure('Vous êtes déjà connecté.');
    }
  };

  if (showForgotPassword) {
    return <PasswordResetRequestForm />;
  }

  return (
    <>
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
          Connectez vous
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            fullWidth
            color='warning'
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <TextField
            fullWidth
            color='warning'
            label="Mot de passe"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className={classes.button} type="submit">Connexion</button>
        </form>
        <span style={{ cursor: 'pointer', color: 'orange', textDecoration: 'underline' }} onClick={() => setShowForgotPassword(true)}>
          Mot de passe oublié ?
        </span>
      </Box>

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
    </>
  );
}

export default LoginForm;
