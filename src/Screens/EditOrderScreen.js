import React, { Component } from 'react';
import {AsyncStorage, Alert, StyleSheet, View, Text, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { Container, Header, Content, Item, Input, Icon, Picker, Button } from 'native-base';
import Feather from 'react-native-vector-icons/Feather';
import {Currency} from '../Components/Currency';
import {getDataStorage} from "../Components/Auth";

export default class EditOrderScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      brands: [],
      sizes: [],
      patterns: [],
      number: 0,
      price: 0,
      order: this.props.navigation.state.params.order,
      orderlist: this.props.navigation.state.params.orderlist,
      role: 0,
      user: null,
      selectedBrand: 0,
      selectedSize: 0,
      selectedPattern: 0,
      maxNumber: 0,
      orderNumber: 0
    };
  }

  componentDidMount() {
    this.getTire();
    this.makeRemoteRequest();
    getDataStorage('role_logined')
      .then(res => this.setState({ role: res }))
      .catch(err => console.log(err));
    getDataStorage('userid_logined')
      .then(res => this.setState({ user: res }))
      .catch(err => console.log(err));
  }

  getTire = () => {
    const url = `https://viet-trade.org/api/brands`;
    this.setState({ loading: true });

    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          brands: res.brand,
          sizes: res.size,
          patterns: res.pattern,
        });
      })
      .catch(error => {
        
      });
  };
  getMax = () => {
    const {selectedBrand,selectedSize,selectedPattern} = this.state;
    const url = `https://viet-trade.org/api/maxorder/?brand=${selectedBrand}&size=${selectedSize}&pattern=${selectedPattern}`;
    this.setState({ loading: true });

    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          maxNumber: parseFloat(res.data)+parseFloat(this.state.orderNumber),
        }, () => {
          if (this.state.number>this.state.maxNumber) {
            this.setState({ number: this.state.maxNumber });
          }
        });
      })
      .catch(error => {
        
      });
  };
  makeRemoteRequest = () => {
    const { orderlist, order } = this.state;
    const url = `https://viet-trade.org/api/detailorderlist/?order=${order}&orderlist=${orderlist}`;
    this.setState({ loading: true });

    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: res.data,
          number: !res.data.tire_number?'':res.data.tire_number,
          selectedBrand: res.data.tire_brand,
          selectedSize: res.data.tire_size,
          selectedPattern: res.data.tire_pattern,
          orderNumber: !res.data.tire_number?0:res.data.tire_number
        }, () => {
          this.getMax();
        });
        this._addMaskMoney(res.data.tire_price_vat);
        
      })
      .catch(error => {
        
      });
  };
  onChangeBrand(value: string) {
    this.setState({
      selectedBrand: value
    }, () => {
      this.getMax();
    });
  };
  onChangeSize(value: string) {
    this.setState({
      selectedSize: value
    }, () => {
      this.getMax();
    });
  };
  onChangePattern(value: string) {
    this.setState({
      selectedPattern: value
    }, () => {
      this.getMax();
    });
  };

  checkMax(value){
    const max = this.state.maxNumber;
    if (value>max) {
      value = max;
      Alert.alert('Thông báo', 'Vượt quá số lượng tồn');
    }
    this.setState({
      number: value
    });
    
  }

  _addMaskMoney(money: string){  
    money = money.replace(/\./g,'');
    const price =  money.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    this.setState({ price: price });
  };

  editOrder(){
    const {order,orderlist,selectedBrand,selectedSize,selectedPattern,number,price} = this.state;
    const lock = this.state.data.sale_lock;
    if (lock==1) {
      Alert.alert('Thông báo', 'Đơn hàng đang bị khóa. Bạn không thể cập nhật đơn hàng!');
      return;
    }
    if(selectedBrand>0 && selectedSize>0 && selectedPattern>0 && number>0){
      fetch('https://viet-trade.org/api/editorder',{
        method:'POST',
        header:{
          'Accept': 'application/json',
          'Content-type': 'application/json'
        },
        body:JSON.stringify({
          order: order,
          orderlist: orderlist,
          brand: selectedBrand,
          size: selectedSize,
          pattern: selectedPattern,
          number: number,
          price: price,
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
          <Item picker>
            <Text style={styles.colLeft}>Thương hiệu: </Text>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="ios-arrow-down-outline" />}
              style={{ width: undefined }}
              placeholder="Chọn"
              placeholderStyle={{ color: "#bfc6ea" }}
              placeholderIconColor="#007aff"
              selectedValue={this.state.selectedBrand}
              onValueChange={this.onChangeBrand.bind(this)}
            >
            {this.state.brands.map((item, key) => {return <Picker.Item value={item.tire_brand_id} label={item.tire_brand_name} key={item.tire_brand_id}  /> })}
            </Picker>
          </Item>
          <Item picker>
            <Text style={styles.colLeft}>Kích cỡ: </Text>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="ios-arrow-down-outline" />}
              style={{ width: undefined }}
              placeholder="Chọn"
              placeholderStyle={{ color: "#bfc6ea" }}
              placeholderIconColor="#007aff"
              selectedValue={this.state.selectedSize}
              onValueChange={this.onChangeSize.bind(this)}
            >
            {this.state.sizes.map((item, key) => {return <Picker.Item value={item.tire_size_id} label={item.tire_size_number} key={item.tire_size_id}  /> })}
            </Picker>
          </Item>
          <Item picker>
            <Text style={styles.colLeft}>Mã gai: </Text>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="ios-arrow-down-outline" />}
              style={{ width: undefined }}
              placeholder="Chọn"
              placeholderStyle={{ color: "#bfc6ea" }}
              placeholderIconColor="#007aff"
              selectedValue={this.state.selectedPattern}
              onValueChange={this.onChangePattern.bind(this)}
            >
            {this.state.patterns.map((item, key) => {return <Picker.Item value={item.tire_pattern_id} label={item.tire_pattern_name} key={item.tire_pattern_id}  /> })}
            </Picker>
          </Item>
          <Item>
            <Text style={styles.colLeft}>Số lượng: </Text>
            <Input keyboardType="numeric" value={`${this.state.number}`} onChangeText={(value) => this.checkMax(value)} />
          </Item>
          <Item>
            <Text style={styles.colLeft}>Giá bán: </Text>
            <Input keyboardType="numeric" value={`${this.state.price}`} onChangeText={(value) => this._addMaskMoney(value)} />
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