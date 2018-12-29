import React, { Component } from 'react';
import { WebView } from 'react-native';

export default class PrintOrderScreen extends Component {
  async componentWillMount() {
    try {
      await Expo.Print.printAsync({uri: 'https://viet-trade.org/api/createPDF/'+this.props.navigation.state.params.order+'/'+this.props.navigation.state.params.type})
    } catch (error) {
      console.log('ERROR', error)
    }
  }
  render() {
    return (
      <WebView
        source={{uri: 'https://viet-trade.org/ordertire/printview/'+this.props.navigation.state.params.order}}
      />
    );
  }
}