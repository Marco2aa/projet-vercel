import { AppBar, Toolbar, Typography, Avatar, makeStyles, createTheme, ThemeProvider, Box, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext'; // Import du contexte AuthContext
import CategoryIcon from '@mui/icons-material/Category';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LoginIcon from '@mui/icons-material/Login'; // Icône pour Connexion
import LogoutIcon from '@mui/icons-material/Logout'; // Icône pour Déconnexion
import MenuIcon from '@mui/icons-material/Menu'; // Icône pour menu burger
import NavLink from './Navlink.js'; // Import du composant NavLink
import useMediaQuery from '@mui/material/useMediaQuery';

const useStyles = makeStyles(() => ({
  title: {
    color: "orange",
    fontFamily: "Montserrat",
    fontWeight: "bold",
    cursor: "pointer",
    marginLeft: 20,
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  links: {
    display: "flex",
    gap: 15, // Espacement entre les liens
    marginLeft: 20, // Pour que les liens soient légèrement décalés de "Afflo Crypto"
  },
  avatar: {
    marginRight: 5, // Réduire la marge entre l'avatar et Déconnexion
    cursor: 'pointer',
  },
  container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  drawerList: {
    width: 250,
  },
  menuIcon: {
    color: "orange", // Couleur orange pour l'icône du menu burger
  }
}));

const Header = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isTablet = useMediaQuery('(max-width:960px)'); // Taille écran tablette
  const isMobile = useMediaQuery('(max-width:600px)'); // Taille écran téléphone

  const handleNavigate = () => {
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAvatarClick = () => {
    navigate("/profile-dashboard"); // Redirection vers le dashboard
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  const renderDrawer = () => (
    <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
      <div className={classes.drawerList} onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
        <List>
          <ListItem button onClick={() => navigate('/heatmap')}>
            <ListItemIcon><TrendingUpIcon /></ListItemIcon>
            <ListItemText primary="Heatmap" />
          </ListItem>
          <ListItem button onClick={() => navigate('/achat-vente')}>
            <ListItemIcon><MonetizationOnIcon /></ListItemIcon>
            <ListItemText primary="Achat/Vente" />
          </ListItem>
          <ListItem button onClick={() => navigate('/categories')}>
            <ListItemIcon><CategoryIcon /></ListItemIcon>
            <ListItemText primary="Catégories" />
          </ListItem>
          <ListItem button onClick={() => navigate('/transaction')}>
            <ListItemIcon><AccountBalanceWalletIcon /></ListItemIcon>
            <ListItemText primary="Transaction" />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar position='static' color='transparent'>
        <Toolbar className={classes.toolbar}>

          {/* Si la taille est mobile, afficher uniquement le menu burger et Déconnexion */}
          {isMobile ? (
            <>
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                <MenuIcon className={classes.menuIcon} />
              </IconButton>
              {isAuthenticated && (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    alt={user?.username}
                    src={user?.profileImage}
                    className={classes.avatar}
                    onClick={handleAvatarClick} // Redirection vers le dashboard
                  />
                  <NavLink to="/login" icon={LogoutIcon} onClick={handleLogout} variant="text" /> {/* Icône uniquement */}
                </Box>
              )}
            </>
          ) : (
            <>
              {!isTablet && (
                <Typography variant='h5' onClick={handleNavigate} className={classes.title}>
                  Afflo Crypto
                </Typography>
              )}

              {/* Liens de navigation */}
              <div className={classes.links}>
                <NavLink to="/homemap" label={!isTablet ? "Heatmap" : ""} icon={TrendingUpIcon} variant="text" />
                <NavLink to="/buy" label={!isTablet ? "Achat/Vente" : ""} icon={MonetizationOnIcon} variant="text" />
                <NavLink to="/categories" label={!isTablet ? "Catégories" : ""} icon={CategoryIcon} variant="text" />
                <NavLink to="/transaction" label={!isTablet ? "Transaction" : ""} icon={AccountBalanceWalletIcon} variant="text" />
              </div>

              {/* Connexion ou déconnexion */}
              {isAuthenticated ? (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    alt={user?.username}
                    src={user?.profileImage}
                    className={classes.avatar}
                    onClick={handleAvatarClick} // Redirection vers le dashboard
                  />
                  <NavLink to="/login" label={!isTablet ? "Déconnexion" : ""} icon={LogoutIcon} onClick={handleLogout} variant="text" />
                </Box>
              ) : (
                <NavLink to="/login" label={!isTablet ? "Connexion" : ""} icon={LoginIcon} variant="text" />
              )}
            </>
          )}

        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      {renderDrawer()}
    </ThemeProvider>
  );
};

export default Header;
