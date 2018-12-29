import React, { Component } from 'react';
import { Alert, Linking, Dimensions, LayoutAnimation, Text, View, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';

const { width } = Dimensions.get('window')
const qrSize = width * 0.7

export default class QRScanScreen extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      hasCameraPermission: null,
      lastScannedUrl: null,
    };

    this.translateY = new Animated.Value(0);
    this.opacity = new Animated.Value(1);
  }

  componentDidMount() {
    this._requestCameraPermission();
    this.animate(qrSize);
    this.animateOpacity(0);
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  _handleBarCodeRead = result => {
    if (result.data !== this.state.lastScannedUrl) {
      LayoutAnimation.spring();
      this.setState({ lastScannedUrl: result.data });
    }
  };

  animate(value) {
    Animated.timing(
      this.translateY,
      { toValue: value,duration: 1500 }
    ).start(()=>{
      this.translateY.setValue(value); 
      if (value==1)
        this.animate(qrSize);
      else
        this.animate(1);
    });
  }
  animateOpacity(value) {
    Animated.timing(
      this.opacity,
      { toValue: value,duration: 30 }
    ).start(()=>{
      this.opacity.setValue(value); 
      if (value==1)
        this.animateOpacity(0);
      else
        this.animateOpacity(1);
    });
  }

  render() {
    return (
      <View style={styles.container}>

        {this.state.hasCameraPermission === null
          ? <Text>Requesting for camera permission</Text>
          : this.state.hasCameraPermission === false
              ? <Text style={{ color: '#fff' }}>
                  Vui lòng cho phép truy cập Camera trong Menu Cài Đặt của thiết bị
                </Text>
              : <BarCodeScanner
                  onBarCodeRead={this._handleBarCodeRead}
                  style={{
                    height: Dimensions.get('window').height,
                    width: Dimensions.get('window').width,
                    alignItems: 'center'
                  }}
                >
                <Animated.View style={{opacity: this.opacity, transform: [{translateY: this.translateY}] }}>
                  <View style={styles.laser}></View>
                </Animated.View>
                <Image
                  style={styles.qr}
                  source={require('../../assets/images/qrscan.png')}
                />
                </BarCodeScanner>
        }

        {this._maybeRenderUrl()}

      </View>
    );
  }

  _handlePressUrl = () => {
    Alert.alert(
      'Bạn muốn tiếp tục không?',
      this.state.lastScannedUrl,
      [
        {
          text: 'Đồng ý',
          onPress: () => Linking.openURL(this.state.lastScannedUrl),
        },
        { text: 'Hủy', onPress: () => {} },
      ],
      { cancellable: true }
    );
  };

  _handlePressCancel = () => {
    this.setState({ lastScannedUrl: null });
  };

  _maybeRenderUrl = () => {
    if (!this.state.lastScannedUrl) {
      return;
    }

    return (
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.url} onPress={this._handlePressUrl}>
          <Text numberOfLines={1} style={styles.urlText}>
            {this.state.lastScannedUrl}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={this._handlePressCancel}>
          <Text style={styles.cancelButtonText}>
            Đóng
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    flexDirection: 'row',
  },
  url: {
    flex: 1,
  },
  urlText: {
    color: '#fff',
    fontSize: 20,
  },
  cancelButton: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 18,
  },
  qr: {
    marginTop: '45%',
    position: 'absolute',
    width: qrSize,
    height: qrSize,
  },
  laser: {
    width: qrSize,
    backgroundColor: 'red',
    height: 1,
    marginTop: '50%',
    zIndex: 2,
    shadowColor: 'red',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
  }
});
