import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import Header from "./Components/Header.js"
import Homepage from "./Pages/Homepage.js";
import CoinPage from "./Pages/CoinPage.js";
import { styled } from '@mui/styles';
import Login from "./Pages/Login.js";
import Categorie from "./Pages/Categorie.js";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Buy from "./Pages/Buy.js";
import Transaction from "./Pages/Transaction.js";
import Dashboard from "./Pages/Dashboard.js";
import ProfileDashBoard from "./Pages/ProfileDashBoard.js"
import DashBoardInfo from "./Pages/DashBoardInfo.js"
import Homemap from "./Pages/Homemap.js"
import AuthProvider from "./Context/AuthContext.js";
import ResetPassword from "./Pages/ResetPassword.js";
import CryptoContext from "./Context/CryptoContext.js";
import { UserProvider } from "./Context/UserContext.js";



const AppContainer = styled('div')({
  backgroundColor: "#181A20",
  color: 'white',

  minHeight: '100vh',
  width: '100%',

});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <UserProvider>
        <CryptoContext>
          <AuthProvider>
            <BrowserRouter>
              <div style={{
                backgroundColor: "#181A20",
                color: 'white',

                minHeight: '100vh',
                width: '100%',
              }}>
                <Routes>
                  <Route path='/categories' element={<Categorie />} />
                  <Route path='/' element={<Homepage />} />
                  <Route path='/coins/:id' element={<CoinPage />} />
                  <Route path='/login' element={<Login />} />
                  <Route path='/buy' element={<Buy />} />
                  <Route path='/dashboard' element={<Dashboard />} />
                  <Route path='/transaction' element={<Transaction />} />
                  <Route path="/profile-dashboard" element={<ProfileDashBoard />} />
                  <Route path="/dashboard-info" element={<DashBoardInfo />} />
                  <Route path="/homemap" element={<Homemap />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                </Routes>
              </div>
            </BrowserRouter>
          </AuthProvider>
        </CryptoContext>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
