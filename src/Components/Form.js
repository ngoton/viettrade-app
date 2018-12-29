import React, {Component} from 'react';
import Dimensions from 'Dimensions';
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Keyboard,
  Animated,
  Easing,
  Alert,
  AsyncStorage
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import UserInput from './UserInput';
import SignupSection from './SignupSection';

import usernameImg from '../../assets/images/username.png';
import passwordImg from '../../assets/images/password.png';
import spinner from '../../assets/images/loading.gif';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showPass: true,
      press: false,
      username:'',
      password:''
    };
    this.showPass = this.showPass.bind(this);
    this.buttonAnimated = new Animated.Value(0);
    this.growAnimated = new Animated.Value(0);
    this._onPress = this._onPress.bind(this);

    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
  }

  async saveItem(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.error('AsyncStorage error: ' + error.message);
    }
  }

  showPass() {
    this.state.press === false
      ? this.setState({showPass: false, press: true})
      : this.setState({showPass: true, press: false});
  }
  focusNextField(id) {
    this.inputs[id].focus();
  }
  _onPress() {
    const {username,password} = this.state;
    if(username==""){
      this.focusNextField('username');
      Alert.alert('Thông báo', "Vui lòng nhập vào Username.");
    }
    else if(password==""){
      this.focusNextField('password');
      Alert.alert('Thông báo', "Vui lòng nhập vào Password.");
    }
    else{
      if (this.state.isLoading) return;

      this.setState({isLoading: true});
      Animated.timing(this.buttonAnimated, {
        toValue: 1,
        duration: 200,
        easing: Easing.linear,
      }).start();

      setTimeout(() => {
        this._onGrow();
      }, 2000);

      setTimeout(() => {
        //Actions.secondScreen();
        this.setState({isLoading: false});
        this.buttonAnimated.setValue(0);
        this.growAnimated.setValue(0);

        this.login(username, password);
      }, 2300);
    }
    
  }

  _onGrow() {
    Animated.timing(this.growAnimated, {
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
    }).start();
  }
  login(username, password) {
    fetch('https://viet-trade.org/api/login',{
      method:'POST',
      header:{
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body:JSON.stringify({
        username: username,
        password: password
      })

    })
    .then((response) => response.json())
     .then((res)=>{
       if(res.err == 1){
        this.saveItem('userid_logined', res.data.user_id);
        this.saveItem('user_logined', res.data.username);
        this.saveItem('role_logined', res.data.role);
        this.props.navigation.navigate('PriceScreen');
         // Alert.alert(
         //   'Thành công',
         //   'Welcome "' + username + '"',
         //   [
         //     {text:'Tiếp tục', onPress: () => this.props.navigation.navigate('PriceScreen') }
         //   ]
         // );
       }else{
         Alert.alert('Thông báo', res.msg);
       }
     })
     .catch((error)=>{
     Alert.alert(error);
     });
    
    Keyboard.dismiss();
  }

  render() {
    const changeWidth = this.buttonAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [DEVICE_WIDTH - MARGIN, MARGIN],
    });
    const changeScale = this.growAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [1, MARGIN],
    });
    return (
      
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.inputGroup}>
          <UserInput
            source={usernameImg}
            placeholder="Username"
            autoCapitalize={'none'}
            returnKeyType={'next'}
            autoCorrect={false}
            onRef={(ref) => {
              this.inputs['username'] = ref;
            }}
            onSubmitEditing={() => {
              this.focusNextField('password');
            }}
            onChangeText={(username) => this.setState({username})}
          />
          <UserInput
            source={passwordImg}
            secureTextEntry={this.state.showPass}
            placeholder="Password"
            returnKeyType={'go'}
            autoCapitalize={'none'}
            autoCorrect={false}
            onRef={(ref) => {
              this.inputs['password'] = ref;
            }}
            onSubmitEditing={() => {
              this._onPress();
            }}
            onChangeText={(password) => this.setState({password})}
          />
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.btnEye}
            onPress={this.showPass}>
            <Feather name="eye" size={20} style={styles.iconEye} />
          </TouchableOpacity>
        </View>
        
        <Animated.View style={{width: changeWidth}}>
          <TouchableOpacity
            style={styles.btnLogin}
            onPress={this._onPress}
            activeOpacity={1}>
            {this.state.isLoading ? (
              <Image source={spinner} style={styles.spinner} />
            ) : (
              <Text style={styles.textLogin}>ĐĂNG NHẬP</Text>
            )}
          </TouchableOpacity>
          <Animated.View
            style={[styles.circle, {transform: [{scale: changeScale}]}]}
          />
        </Animated.View>
      </KeyboardAvoidingView>
    );
  }
}

const MARGIN = 40;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  inputGroup: {
    marginBottom: 20
  },
  btnEye: {
    position: 'absolute',
    top: 65,
    right: 28,
  },
  iconEye: {
    color: 'rgba(0,0,0,0.5)',
  },
  btnLogin: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F035E0',
    height: MARGIN,
    borderRadius: 20,
    zIndex: 100
  },
  circle: {
    height: MARGIN,
    width: MARGIN,
    marginTop: -MARGIN,
    borderWidth: 1,
    borderColor: '#F035E0',
    borderRadius: 100,
    alignSelf: 'center',
    zIndex: 99,
    backgroundColor: '#F035E0',
  },
  textLogin: {
    color: 'white',
    backgroundColor: 'transparent',
  },
  spinner: {
    width: 24,
    height: 24,
  }
});
