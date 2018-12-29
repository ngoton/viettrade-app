import React, {Component} from 'react';
import {StyleSheet, View, Image, TouchableWithoutFeedback, Keyboard} from 'react-native';

import logoImg from '../../assets/images/logo.png';

export default class Logo extends Component {
  render() {
    return (
      <TouchableWithoutFeedback style={{flex: 1}} onPress={Keyboard.dismiss} >
        <View style={styles.container}>
          <Image source={logoImg} style={styles.image} />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 150,
    height: 150,
  },
});
