import React, { Component } from 'react';
import { WebView } from 'react-native';

export default class ViewOrderScreen extends Component {
  render() {
    return (
      <WebView
        source={{uri: 'https://viet-trade.org/ordertire/getDetailOrder?order='+this.props.navigation.state.params.order}}
      />
    );
  }
}