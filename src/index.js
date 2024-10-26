import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import 'react-alice-carousel/lib/alice-carousel.css';
import CryptoContext from "../src/Context/CryptoContext.js"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CryptoContext>
    <App />
  </CryptoContext>
);

