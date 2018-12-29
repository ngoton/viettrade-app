import React, { Component } from 'react';
import { WebView } from 'react-native';

export default class PrintQuotationScreen extends Component {
  async componentWillMount() {
    try {
      await Expo.Print.printAsync({uri: 'https://viet-trade.org/public/files/quotation.pdf'})
    } catch (error) {
      console.log('ERROR', error)
    }
  }
  render() {
    return (
      <WebView
        source={{uri: 'https://viet-trade.org/api/quotationview'}}
      />
    );
  }
}