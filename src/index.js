import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.js';
import 'react-alice-carousel/lib/alice-carousel.css';
import CryptoContext from "../src/Context/CryptoContext.js";

ReactDOM.render(
  <CryptoContext>
    <App />
  </CryptoContext>,
  document.getElementById('root')
);
