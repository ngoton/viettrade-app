import React from 'react';
import {Text} from 'react-native';

function getLocale(currency) {
  return {
    usd: "en-US",
    rub: "ru-RU",
    vnd: "vi-VN"
  }[currency.toLowerCase()];
}

export const Currency = ({ currency, value }) => {
  const locale = getLocale(currency);
  const options = {
    currency,
    locale,
    currencyDisplay: "symbol",
  };

  return (
    
      Number(value).toLocaleString(locale, options)
    
  );
};