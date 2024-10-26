import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config/api';

const Crypto = createContext();

const CryptoContext = ({ children }) => {
  const [devises, setDevises] = useState([]);
  const [currency, setCurrency] = useState("EUR");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/devises`);
        const data = response.data;
        setDevises(data['hydra:member']);
      } catch (error) {
        console.error('Error fetching devises:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <Crypto.Provider value={{ devises, currency, setCurrency }}>
      {children}
    </Crypto.Provider>
  );
};

export default CryptoContext;

export const CryptoState = () => {
  return useContext(Crypto);
};
