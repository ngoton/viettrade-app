import React, { Component } from 'react';
import {AsyncStorage, Alert, StyleSheet, View, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView } from "react-native";
import { Container, Header, Content, Item, Input, Icon, Picker, Button } from 'native-base';
import Feather from 'react-native-vector-icons/Feather';
import {Currency} from '../Components/Currency';
import RadioGroup from 'react-native-radio-buttons-group';
import {getDataStorage} from "../Components/Auth";

export default class EditOrderCostScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      vendors: [],
      comment: "",
      order_tire_cost: 0,
      order: this.props.navigation.state.params.order,
      ordercost: this.props.navigation.state.params.ordercost,
      role: 0,
      user: null,
      selectedVendor: 0,
      costType: [
            {
                label: 'Trucking',
                value: 1,
                color: 'green',
            },
            {
                label: 'Barging',
                value: 2,
                color: 'green',
            },
            {
                label: 'Feeder',
                value: 3,
                color: 'green',
            },
            {
                label: 'Thu hộ',
                value: 4,
                color: 'green',
            },
            {
                label: 'Hoa hồng',
                value: 5,
                color: 'green',
            },
            {
                label: 'TTHQ',
                value: 6,
                color: 'green',
            },
            {
                label: 'Khác',
                value: 7,
                color: 'green',
            },
        ],
      selectedType:1,
    };
  }

  componentDidMount() {
    this.getVendor();
    this.makeRemoteRequest();
    getDataStorage('role_logined')
      .then(res => this.setState({ role: res }))
      .catch(err => console.log(err));
    getDataStorage('userid_logined')
      .then(res => this.setState({ user: res }))
      .catch(err => console.log(err));
  }

  onPress = data => this.setState({ costType:data },()=>{
    const selectedButton = this.state.costType.find(e => e.selected == true);
    this.setState({ selectedType:selectedButton.value })
  });

  getVendor = () => {
    const url = `https://viet-trade.org/api/vendors`;
    this.setState({ loading: true });

    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          vendors: res.data,
        });
      })
      .catch(error => {
        
      });
  };
  
  makeRemoteRequest = () => {
    const { ordercost, order } = this.state;
    const url = `https://viet-trade.org/api/detailordercost/?order=${order}&ordercost=${ordercost}`;
    this.setState({ loading: true });

    fetch(url)
      .then(res => res.json())
      .then(res => {
        if (!res.data.order_tire_cost_type) {
          this.state.costType[0].selected = true;
        }
        else{
          for (var i = 0; i < this.state.costType.length; i++) {
            this.state.costType[i].selected = false;
            if (parseInt(res.data.order_tire_cost_type)==(i+1)) {
              this.state.costType[i].selected = true;
            }
          }
        }
        
        this.setState({
          data: res.data,
          selectedVendor: res.data.vendor,
          selectedType: !res.data.order_tire_cost_type?1:res.data.order_tire_cost_type,
          comment: !res.data.comment?"":res.data.comment,
          order_tire_cost: !res.data.order_tire_cost?"":res.data.order_tire_cost,
          costType: this.state.costType
        });
        this._addMaskMoney(res.data.order_tire_cost);
        
      })
      .catch(error => {
        
      });
  };
  onChangeVendor(value: string) {
    this.setState({
      selectedVendor: value
    });
  };
  

  _addMaskMoney(money: string){  
    money = money.replace(/\./g,'');
    const price =  money.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    this.setState({ order_tire_cost: price });
  };

  editOrder(){
    const {order,ordercost,selectedType,selectedVendor,comment,order_tire_cost} = this.state;

    if(selectedType>0 && selectedVendor>0 && order_tire_cost>0){
      fetch('https://viet-trade.org/api/editordercost',{
        method:'POST',
        header:{
          'Accept': 'application/json',
          'Content-type': 'application/json'
        },
        body:JSON.stringify({
          order: order,
          ordercost: ordercost,
          type: selectedType,
          vendor: selectedVendor,
          comment: comment,
          order_tire_cost: order_tire_cost,
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
    return (
      <Container>
        <Header>
        <Text>{this.state.data.order_number}</Text>
        </Header>
        <Content style={styles.container}>
          <Item>
            <ScrollView horizontal={true}>
              <RadioGroup 
                  radioButtons={this.state.costType} 
                  onPress={this.onPress} 
                  flexDirection='row'
              />
            </ScrollView>
          </Item>
          <Item picker>
            <Text style={styles.colLeft}>Vendor: </Text>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="ios-arrow-down-outline" />}
              style={{ width: undefined }}
              placeholder="Chọn"
              placeholderStyle={{ color: "#bfc6ea" }}
              placeholderIconColor="#007aff"
              selectedValue={this.state.selectedVendor}
              onValueChange={this.onChangeVendor.bind(this)}
            >
            {this.state.vendors.map((item, key) => {return <Picker.Item value={item.shipment_vendor_id} label={item.shipment_vendor_name} key={item.shipment_vendor_id}  /> })}
            </Picker>
          </Item>
          <Item>
            <Text style={styles.colLeft}>Nội dung: </Text>
            <Input value={`${this.state.comment}`} onChangeText={(value) => this.setState({comment:value})} />
          </Item>
          <Item>
            <Text style={styles.colLeft}>Số tiền: </Text>
            <Input keyboardType="numeric" value={`${this.state.order_tire_cost}`} onChangeText={(value) => this._addMaskMoney(value)} />
          </Item>
          <TouchableOpacity
            style={styles.btnLogin}
            activeOpacity={1}>
            <Button iconLeft full warning onPress={()=>this.editOrder()}>
              <Feather size={15} name='save' />
              <Text>  LƯU</Text>
            </Button>
          </TouchableOpacity>
          
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  colLeft: {
    width: '30%',
    fontWeight: 'bold'
  },
});