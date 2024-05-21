import React from "react";
import {useState, useEffect} from 'react';
import './login-currency-conversion.css';
import graphPic from './graph.png';

interface CurrencyRates {
  [key: string]: { [key: string]: number };
}

const LoginCurrencyConversion: React.FC = () => {

  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>('Galleon');
  const [toCurrency, setToCurrency] = useState<string>('Knut');
  const [exchangeRate, setExchangeRate] = useState<number>(493);
  const [currencies, setCurrencies] = useState<string[]>(['Galleon', 'Knut', 'Sickle']);

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      const rate = getExchangeRate(fromCurrency, toCurrency);
      setExchangeRate(rate);
    }
  }, [fromCurrency, toCurrency]);

  const getExchangeRate = (fromCurrency: string, toCurrency: string): number => {
    const exchangeRates: CurrencyRates = {
        'Galleon': { 'Knut': 493, 'Sickle':29 , 'Galleon': 1},
        'Knut': { 'Galleon': 0.002028, 'Sickle': 0.03448 , 'Knut': 1},
        'Sickle': { 'Knut': 29, 'Galleon': 0.05882 , 'Sickle': 1}
    };

    const ratesForFromCurrency = exchangeRates[fromCurrency];
    if (!ratesForFromCurrency) {
        throw new Error(`No rates available for currency: ${fromCurrency}`);
    }
    const rate = ratesForFromCurrency[toCurrency];
    if (rate === undefined) {
        throw new Error(`No exchange rate available from ${fromCurrency} to ${toCurrency}`);
    }
    return rate;
  };

  return (
    <div className="currency-conversion-background">
      <h1>Gringotts Exchange</h1>
      <img src={graphPic} alt="Graph picture"></img>  
      <div className="exchange-container">
        <div className="choose-currency">
          <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
            {currencies.map(currency => <option key={currency} value={currency}>{currency}</option>)}
          </select>
          <span> → </span>
          <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
            {currencies.map(currency => <option key={currency} value={currency}>{currency}</option>)}
          </select>
        </div>
        <div className="output">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}/>
          <h3>{(amount * exchangeRate).toFixed(5)}</h3>
        </div>
      </div>
    </div>
  );
};



export default LoginCurrencyConversion;
