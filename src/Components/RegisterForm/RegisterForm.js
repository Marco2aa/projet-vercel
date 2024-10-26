import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Box, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Typography } from '@material-ui/core';
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import './RegisterForm.css'

function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState(false);


    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
    const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/



    const [validPwd, setValidPwd] = useState(false);
    const [validMatch, setValidMatch] = useState(false);
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false)
    const [passwordFocus, setPasswordFocus] = useState(false);
    const [validMatchFocus, setValidMatchFocus] = useState(false)


    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    useEffect(() => {
        const isValidEmail = EMAIL_REGEX.test(email);
        setValidEmail(isValidEmail);
    }, [email])



    useEffect(() => {
        setValidPwd(PWD_REGEX.test(password));
        setValidMatch(password === passwordConfirm);
    }, [password, passwordConfirm])





    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const useStyles = makeStyles(() => ({
        title: {
            fontFamily: "Poppins",
            fontWeight: "700",
        },
        form: {
            display: "flex",
            gap: "25px",
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

    }))



    const classes = useStyles()

    const handleRegister = async (e) => {
        e.preventDefault();
        if (validPwd === validMatch) {
            try {
                const response = await axios.post('https://localhost:8000/api/register', {
                    email,
                    password,
                    nom,
                    prenom
                });
                console.log(response.data);
                navigate('/');
            } catch (error) {
                setError('Invalid credentials. Please try again.');
                console.log('Invalid credentials. Please try again.');
            }
        }
    };



    return (


        <Box
            width='500px'
            display="flex"
            alignItems="center"
            gap={4}
            p={4}
            flexDirection='column'
            justifyContent='center'
            sx={{
                border: '1px solid grey',
                borderRadius: '16px'
            }}
        >
            <Typography
                variant='h5'

                className={classes.title}>
                Bienvenue sur Afflo'Crypto
            </Typography>
            <form
                className={classes.form}
                onSubmit={handleRegister}>
                {/* <TextField
                    fullWidth
                    color='warning'
                    label="Email"
                    value={email}
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}

                /> */}
                <FormControl variant="outlined">

                    <InputLabel color='warning' htmlFor="outlined-adornment-password">Email</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type="email"
                        endAdornment={
                            <InputAdornment position="end">
                                <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                            </InputAdornment>
                        }
                        label="Email"
                        color='warning'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setEmailFocus(true)}
                        onBlur={() => setEmailFocus(false)}
                    />
                    <p id="uidnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Please , enter a valid Email.
                    </p>
                </FormControl>
                <TextField
                    fullWidth
                    color='warning'
                    label="Nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    type="text"
                />
                <TextField
                    fullWidth
                    color='warning'
                    label="Prénom"
                    value={prenom}
                    type="text"
                    onChange={(e) => setPrenom(e.target.value)}
                />
                <FormControl variant="outlined">
                    <InputLabel color='warning' htmlFor="outlined-adornment-password">Mot de passe</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment style={{ display: 'flex', gap: '10px' }} position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                                <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validPwd || !password ? "hide" : "invalid"} />
                            </InputAdornment>
                        }
                        label="Mot de passe"
                        color='warning'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setPasswordFocus(true)}
                        onBlur={() => setPasswordFocus(false)}
                    />
                    <p id="pwdnote" className={passwordFocus && !validPwd ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        8 à 20 caracères.<br />
                        Doit contenir 1 majuscule,1 minuscule, 1 caractère spécial.<br />
                        Caractères spéciaux autorisés: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                    </p>
                </FormControl>
                <FormControl variant="outlined">
                    <InputLabel color='warning' htmlFor="outlined-adornment-password">Confirmez le mot de passe</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment style={{ display: 'flex', gap: '10px' }} f position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                                <FontAwesomeIcon icon={faCheck} className={validMatch && passwordConfirm ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validMatch || !passwordConfirm ? "hide" : "invalid"} />
                            </InputAdornment>
                        }
                        label="Confirmez le mot de passe"
                        color='warning'
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        onFocus={() => setValidMatchFocus(true)}
                        onBlur={() => setValidMatchFocus(false)}

                    />
                    <p id="confirmnote" className={validMatchFocus && !validMatch ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Must match the first password input field.
                    </p>
                </FormControl>

                <button
                    className={classes.button}
                    type="sumbit">Inscrivez vous</button>
            </form>



        </Box>



    )
}

export default RegisterForm;
