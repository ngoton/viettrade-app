import React, { Component } from 'react';
import {AsyncStorage, Alert, StyleSheet, View, Text, TouchableOpacity, KeyboardAvoidingView, ListView, Animated, ScrollView, ActivityIndicator } from "react-native";
import { Container, Header, Content, Item, Input, Icon, Picker, Button, Radio, CheckBox, Textarea, Separator, List, ListItem  } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Feather from 'react-native-vector-icons/Feather';
import RadioGroup from 'react-native-radio-buttons-group';

import SuggestionInput from '../Components/SuggestionInput';
import {getDataStorage} from "../Components/Auth";


export default class CustomerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      role: 0,
      data: [],
      loading: false,
      customerType: [
            {
                label: 'Trực tiếp',
                value: 2,
                color: 'green',
            },
            {
                label: 'Đại lý',
                value: 1,
                color: 'green',
            },
        ],
      selectedCustomerType:2,
      selectedStaff: 0,
      staffs: [],
      company:"",
      mst:"",
      phone:"",
      email:"",
      type:2,
      staff:"",
      customer_name:"",
      customer: this.props.navigation.state.params.customer,
      address:"",
      contact:"",
    };
   
  }

  componentDidMount() {
    getDataStorage('role_logined')
      .then(res => this.setState({ role: res }))
      .catch(err => console.log(err));
    getDataStorage('userid_logined')
      .then(res => this.setState({ user: res }))
      .catch(err => console.log(err));

      this.getAllStaff();
      this.makeRemoteRequest();
      
  };

  onPress = data => this.setState({ customerType:data },()=>{
    const selectedButton = this.state.customerType.find(e => e.selected == true);
    this.setState({ selectedCustomerType:selectedButton.value,type:selectedButton.value })
  });

  makeRemoteRequest = () => {
    const { customer } = this.state;
    const url = `https://viet-trade.org/api/customer/?id=${customer}`;
    this.setState({ loading: true });

    fetch(url)
      .then(res => res.json())
      .then(res => {
        if (res.data.customer_tire_type==1) {
          this.state.customerType[1].selected = true;
          this.state.customerType[0].selected = false;
        }
        else{
          this.state.customerType[0].selected = true;
          this.state.customerType[1].selected = false;
        }

        this.setState({
          data: res.data,
          selectedCustomerType:res.data.customer_tire_type,
          selectedStaff: res.data.customer_create_user,
          company:res.data.company_name,
          mst:res.data.mst,
          phone:res.data.customer_phone,
          email:res.data.customer_email,
          type:res.data.customer_tire_type,
          staff:res.data.customer_create_user,
          customer_name:res.data.customer_name,
          customer: res.data.customer_id,
          address:res.data.customer_address,
          contact:res.data.customer_contact,
          customerType: this.state.customerType,
          loading: false
        });
        
        
      })
      .catch(error => {
        
      });
  };
  
  getAllStaff = () => {
    
    const url = `https://viet-trade.org/api/staffs`;

    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          staffs: res.data,
          selectedStaff: this.state.user
        });
      })
      .catch(error => {
        
      });
  };
  onChangeStaff(value: string) {
    this.setState({
      selectedStaff: value
    });
  };
  editCustomer(){
    const {type,customer,customer_name,company,mst,address,phone,email,contact,selectedStaff} = this.state;
    if (customer_name=='') {
      Alert.alert('Thông báo', 'Vui lòng nhập vào tên khách hàng!');
      return;
    }
    else if(address==''){
      Alert.alert('Thông báo', 'Vui lòng nhập vào địa chỉ!');
      return;
    }
    else if(phone=='' || phone=='0' || phone=='0000000000' || phone.length < 10){
      Alert.alert('Thông báo', 'Vui lòng nhập vào số điện thoại!');
      return;
    }
    else if(contact==''){
      Alert.alert('Thông báo', 'Vui lòng nhập vào tên người liên hệ!');
      return;
    }
    else{
      fetch('https://viet-trade.org/api/editcustomer',{
        method:'POST',
        header:{
          'Accept': 'application/json',
          'Content-type': 'application/json'
        },
        body:JSON.stringify({
          type:type,
          customer:customer,
          customer_name:customer_name,
          company:company,
          mst:mst,
          address:address,
          phone:phone,
          email:email,
          contact:contact,
          staff:selectedStaff,
          user: this.state.user
        })

      })
      .then((response) => response.json())
       .then((res)=>{
         if(res.err == 1){
            Alert.alert('Thông báo', res.msg);
            this.makeRemoteRequest();
         }else{
           Alert.alert('Thông báo', res.msg);
         }
       })
    }
    
  }


  render() {
    if (this.state.loading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <ActivityIndicator animating size="large" />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={styles.progressiveInput}>
            <RadioGroup 
                radioButtons={this.state.customerType} 
                onPress={this.onPress} 
                flexDirection='row'
            />
            <Text>Tên khách hàng</Text>
            <SuggestionInput 
              value={this.state.customer_name}
              isLoading={false}
              onChangeText={(value)=>{this.setState({customer_name:value})}}
            />
            <Text>Công ty</Text>
            <SuggestionInput 
              value={this.state.company}
              isLoading={false}
              onChangeText={(value)=>{this.setState({company:value})}}
            />
            <Text>MST</Text>
            <SuggestionInput 
              value={this.state.mst}
              isLoading={false}
              onChangeText={(value)=>{this.setState({mst:value})}}
            />
            <Text>Địa chỉ</Text>
            <SuggestionInput 
              value={this.state.address}
              isLoading={false}
              onChangeText={(value)=>{this.setState({address:value})}}
            />
            <Text>SĐT</Text>
            <SuggestionInput 
              value={this.state.phone}
              isLoading={false}
              keyboardType="numeric"
              onChangeText={(value)=>{this.setState({phone:value})}}
            />
            <Text>Email</Text>
            <SuggestionInput
              value={this.state.email} 
              isLoading={false}
              keyboardType="email-address"
              onChangeText={(value)=>{this.setState({email:value})}}
            />
            <Text>Người liên hệ</Text>
            <SuggestionInput 
              value={this.state.contact}
              isLoading={false}
              onChangeText={(value)=>{this.setState({contact:value})}}
            />
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="ios-arrow-down-outline" />}
              style={{ width: undefined }}
              placeholder="Nhân viên"
              placeholderStyle={{ color: "black" }}
              placeholderIconColor="#007aff"
              selectedValue={this.state.selectedStaff}
              onValueChange={this.onChangeStaff.bind(this)}
            >
            {this.state.staffs.map((item, key) => {return <Picker.Item value={item.account} label={item.staff_name} key={item.staff_id}  /> })}
            </Picker>
            <Button full danger iconLeft onPress={()=>this.editCustomer()} >
              <Text style={{color: 'white' }}> LƯU</Text>
            </Button>
          </View>
      </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressiveInput: {
    margin: 0,
    padding: 10,
  },
  col: {
    flexDirection: 'row',
    height: 'auto',
    alignItems:'center',
    borderWidth: 0.5,
    borderColor: 'lightgrey',
  },
  colLeft: {
    fontWeight: 'bold'
  },
  borderRound: {
    paddingLeft: 5,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#e3116c',
    fontWeight: 'bold',
    width: 20,
    height: 20,
    justifyContent:'center',
    alignItems:'center'
  },
  viewHolder:
  {
      justifyContent: 'center',
      alignItems: 'center',
  },

  text:
  {
      color: 'white',
      fontSize: 25
  },

  btn:
  {
      position: 'absolute',
      right: 15,
      bottom: 15,
      borderRadius: 20,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#e3116c',
      padding: 5,
  },
  checkbox: {
    marginRight: 10, 
    width: 30, 
    height: 30, 
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textRight: {
    textAlign: 'right'
  }
});