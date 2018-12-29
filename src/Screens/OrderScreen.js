import React, { Component } from 'react';
import {AsyncStorage, Alert, StyleSheet, SafeAreaView, View, Text, TouchableOpacity, KeyboardAvoidingView, ListView, Animated, ScrollView, ActivityIndicator } from "react-native";
import { Container, Header, Content, Item, Input, Icon, Picker, Button, Radio, CheckBox, Textarea, Separator, List, ListItem  } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Feather from 'react-native-vector-icons/Feather';
import RadioGroup from 'react-native-radio-buttons-group';
import { ViewPager } from 'rn-viewpager';
import StepIndicator from 'react-native-step-indicator';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';

import SuggestionInput from '../Components/SuggestionInput';
import {getDataStorage} from "../Components/Auth";


const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1.id !== r2.id,
});

const PAGES = ['Page 1','Page 2','Page 3','Page 4','Page 5'];
const secondIndicatorStyles = {
  stepIndicatorSize: 40,
  currentStepIndicatorSize:40,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#0070c9',
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: '#0070c9',
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: '#0070c9',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#0070c9',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#0070c9',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 10,
  currentStepLabelColor: '#0070c9'
}


const getStepIndicatorIconConfig = ({ position, stepStatus }) => {
    const iconConfig = {
      name: 'check',
      color: stepStatus === 'finished' ? '#ffffff' : '#0070c9',
      size: 20,
    };
    switch (position) {
      case 0: {
        iconConfig.name = 'user';
        break;
      }
      case 1: {
        iconConfig.name = 'shopping-cart';
        break;
      }
      case 2: {
        iconConfig.name = 'tag';
        break;
      }
      case 3: {
        iconConfig.name = 'map-pin';
        break;
      }
      case 4: {
        iconConfig.name = 'check';
        break;
      }
      default: {
        break;
      }
    }
    return iconConfig;
  };

export default class OrderScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      role: 0,
      isLoading: false,
      loading: false,
      dataSource: ds.cloneWithRows([]),
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
      currentPage:0,
      selectedStaff: 0,
      staffs: [],
      company:"",
      mst:"",
      phone:"",
      email:"",
      type:2,
      staff:"",
      customer_name:"",
      customer:"",
      address:"",
      contact:"",
      brands: [],
      sizes: [],
      patterns: [],
      valueArray: [], 
      disabled: false,
      selectedBrand: [],
      selectedSize: [],
      selectedPattern: [],
      maxNumber: [''],
      number: [''],
      price: [''],
      priceVAT: [''],
      total: 0,
      checkPriceVat: false,
      vatPercent: '',
      vat: '',
      discount: '',
      warrantyPercent: '',
      warranty: '',
      deliveryDate: '',
      dueDate: moment(new Date()).format('DD/MM/YYYY'),
      comment: '',
      sum: ''
    };
    this.searchCustomer = this.searchCustomer.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderSeparator = this.renderSeparator.bind(this);
    this.onInputCleared = this.onInputCleared.bind(this);
    this.index = 0;
    this.animatedValue = new Animated.Value(0);
  }

  refreshScreen() {
    this.setState({
      isLoading: false,
      loading: false,
      dataSource: ds.cloneWithRows([]),
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
      currentPage:0,
      selectedStaff: 0,
      staffs: [],
      company:"",
      mst:"",
      phone:"",
      email:"",
      type:2,
      staff:"",
      customer_name:"",
      customer:"",
      address:"",
      contact:"",
      brands: [],
      sizes: [],
      patterns: [],
      valueArray: [], 
      disabled: false,
      selectedBrand: [],
      selectedSize: [],
      selectedPattern: [],
      maxNumber: [''],
      number: [''],
      price: [''],
      priceVAT: [''],
      total: 0,
      checkPriceVat: false,
      vatPercent: '',
      vat: '',
      discount: '',
      warrantyPercent: '',
      warranty: '',
      deliveryDate: '',
      dueDate: moment(new Date()).format('DD/MM/YYYY'),
      comment: '',
      sum: ''
    });
    this.index = 0;
    this.getTire();
    this.getAllStaff();
    this.viewPager.setPage(0);
  }
  componentDidMount() {
    getDataStorage('role_logined')
      .then(res => this.setState({ role: res }))
      .catch(err => console.log(err));
    getDataStorage('userid_logined')
      .then(res => this.setState({ user: res }))
      .catch(err => console.log(err));

    this.getTire();
    this.getAllStaff();
    

    if (this.props.navigation.state.params) {
      const tireArr = this.props.navigation.state.params.tireArr;
      let newArr = [];
      let newBrand = [];
      let newSize = [];
      let newPattern = [];
      let newPrice = [];
      let newPriceVAT = [];
      let newNumber = [];
      let newMaxNumber = [];

      tireArr.map((item, index) => {
        this.index = this.index + 1;
        newArr.push({index:index});
        newBrand.push(item.tire_brand);
        newSize.push(item.tire_size);
        newPattern.push(item.tire_pattern);
        newPrice.push(item.tire_price.replace(/\B(?=(\d{3})+(?!\d))/g, "."));
        newPriceVAT.push(item.tire_price.replace(/\B(?=(\d{3})+(?!\d))/g, "."));
        newNumber.push('');

        const url = `https://viet-trade.org/api/maxorder/?brand=${item.tire_brand}&size=${item.tire_size}&pattern=${item.tire_pattern}&customer=${this.state.customer}`;
        fetch(url)
          .then(res => res.json())
          .then(res => {
            newMaxNumber.push(res.data);
          })
          .catch(error => {            
          });
        
        
      });
      this.setState({ valueArray:newArr, maxNumber: newMaxNumber, number: newNumber, price: newPrice, priceVAT: newPriceVAT, selectedBrand: newBrand, selectedSize: newSize, selectedPattern: newPattern });
      
    }
    else{
      this.addMore();
    }
  };
  componentWillReceiveProps(nextProps,nextState) {
    if(nextState.currentPage != this.state.currentPage) {
      if(this.viewPager) {
        this.viewPager.setPage(nextState.currentPage)
      }
    }
  };
  renderStepIndicator = params => (
    <Feather {...getStepIndicatorIconConfig(params)} />
  );

  onPress = data => this.setState({ customerType:data },()=>{
    const selectedButton = this.state.customerType.find(e => e.selected == true);
    this.setState({ selectedCustomerType:selectedButton.value,type:selectedButton.value })
  });

  addMore = () =>
  {
      this.animatedValue.setValue(0);

      let newlyAddedValue = { index: this.index }

      this.setState({ disabled: true, valueArray: [ ...this.state.valueArray, newlyAddedValue ] }, () =>
      {
          Animated.timing(
              this.animatedValue,
              {
                  toValue: 1,
                  duration: 500,
                  useNativeDriver: true
              }
          ).start(() =>
          {
              this.index = this.index + 1;
              const copied = [...this.state.maxNumber];
              const copiedNum = [...this.state.number];
              const copiedPrice = [...this.state.price];
              const copiedPriceVAT = [...this.state.priceVAT];
              copied[this.index] = '';
              copiedNum[this.index] = '';
              copiedPrice[this.index] = '';
              copiedPriceVAT[this.index] = '';

              this.setState({ disabled: false, maxNumber: copied, number: copiedNum, price: copiedPrice, priceVAT: copiedPriceVAT });
          }); 
      });              
  }

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

  getTire = () => {
    const url = `https://viet-trade.org/api/brands`;

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
  getMax(brand,size,pattern,index){
    const copied = [...this.state.maxNumber];
    const copiedNum = [...this.state.number];
    const url = `https://viet-trade.org/api/maxorder/?brand=${brand}&size=${size}&pattern=${pattern}&customer=${this.state.customer}`;

    fetch(url)
      .then(res => res.json())
      .then(res => {
        copied[index] = res.data;
        if(this.state.price[index]==''){
          this._addMaskMoney(res.price,index);
        }
        this.setState({
          maxNumber: copied,
        }, () => {
          if (this.state.number[index]>this.state.maxNumber[index]) {
            copiedNum[index] = this.state.maxNumber[index];
            this.setState({ number: copiedNum },()=>{
              this.setState({sum:this.sumOrder()});
            });
          }
        });
      })
      .catch(error => {
        
      });

  };
  checkMax(value,index){
    const max = this.state.maxNumber[index];
    const copiedNum = [...this.state.number];
    if (value>max) {
      value = max;
      Alert.alert('Thông báo', 'Vượt quá số lượng tồn');
    }
    copiedNum[index] = value;
    this.setState({
      number: copiedNum
    },()=>{
      this.changeVATPercent(this.state.vatPercent);
    });
    
  };
  _addMaskMoney(money,index){  
    const copied = [...this.state.price];
    const copiedVAT = [...this.state.priceVAT];
    money = money.replace(/\./g,'');
    const price =  money.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    copied[index] = price;
    copiedVAT[index] = price;
    this.setState({ price: copied, priceVAT: copiedVAT },()=>{
      this.changeVATPercent(this.state.vatPercent);
    });
  };

  onChangeBrand(value,index) {
    const copied = [...this.state.selectedBrand];
    copied[index] = value;

    this.setState({
      selectedBrand: copied
    }, () => {
      this.getMax(value,this.state.selectedSize[index],this.state.selectedPattern[index],index);
    });
  };
  onChangeSize(value,index) {
    const copied = [...this.state.selectedSize];
    copied[index] = value;

    this.setState({
      selectedSize: copied
    }, () => {
      this.getMax(this.state.selectedBrand[index],value,this.state.selectedPattern[index],index);
    });
  };
  onChangePattern(value,index) {
    const copied = [...this.state.selectedPattern];
    copied[index] = value;

    this.setState({
      selectedPattern: copied
    }, () => {
      this.getMax(this.state.selectedBrand[index],this.state.selectedSize[index],value,index);
    });
  };

  async searchCustomer(query) {
    const url = `https://viet-trade.org/api/getcustomer/?keyword=${query}&user=${this.state.user}&role=${this.state.role}`;
    this.setState({ isLoading: true, customer_name: query });
    const response = await fetch(url);
    const jsonResponse = await response.json();
    this.setState({
      isLoading: false,
      dataSource: ds.cloneWithRows(jsonResponse.data),
      customer_name: query
    });
  }

  renderRow(prediction) {
    return (
      <TouchableOpacity
        onPress={() => this.onListItemClicked(prediction)}
        style={styles.listItem}
      >
        <Text>{prediction.customer_name}</Text>
      </TouchableOpacity>
    );
  }

  renderSeparator() {
    return <View style={styles.listItemSeparator} />;
  }

  onInputCleared() {
    this.setState({
      customer_name: '',
      isLoading: false,
      dataSource: ds.cloneWithRows([]),
    });
  }

  async onListItemClicked(prediction) {
    this.setState({
      customer_name: prediction.customer_name,
      dataSource: ds.cloneWithRows([]),
      isLoading: true,
    });
    const url = `https://viet-trade.org/api/getcustomerinfo/?customer=${prediction.customer_id}&company&mst&phone&email&type&staff&customer_name&address&contact`;
    const response = await fetch(url);
    const jsonResponse = await response.json();
    
    if (jsonResponse.data.type==1) {
      this.state.customerType[1].selected = true;
      this.state.customerType[0].selected = false;
    }
    else{
      this.state.customerType[0].selected = true;
      this.state.customerType[1].selected = false;
    }

    this.setState({ 
      isLoading: false ,
      company: jsonResponse.data.company,
      mst: jsonResponse.data.mst,
      phone: jsonResponse.data.phone,
      email: jsonResponse.data.email,
      type: jsonResponse.data.type,
      staff: jsonResponse.data.staff,
      customer_name: jsonResponse.data.customer_name,
      customer: jsonResponse.data.customer,
      address: jsonResponse.data.address,
      contact: jsonResponse.data.contact,
      selectedStaff: jsonResponse.data.staff,
      selectedCustomerType: jsonResponse.data.type,
      customerType: this.state.customerType
    });

  };

  checkVAT(){
    const copied = [...this.state.priceVAT];
    const checkPriceVat = this.state.checkPriceVat;
    const val = parseFloat(this.state.vatPercent) || 0;
    let gia = 0;
    let vat = 0;
    if (checkPriceVat==false) {
      this.setState({ checkPriceVat: true });
      this.state.price.map((item, index) => {
        item = item.toString();
        item = item.replace(/\./g,'');
        item = item.replace(/\,/g,'.');
        var p = parseFloat(item) || 0;
        var g = p*val*0.1/1.1;
        var v = Math.round(g*0.1);
        var n = p-v;

        var sl = this.state.number[index].toString();
        sl = sl.replace(/\./g,'');
        sl = sl.replace(/\,/g,'.');
        var this_sl = parseInt(sl) || 0;
        gia = gia + Math.round((this_sl*n));

        vat += v*this_sl;
        vat = Math.round(vat);

        copied[index] = Math.floor(n);
      });
    }
    else{
      this.setState({ checkPriceVat: false });
      this.state.price.map((item, index) => {
        item = item.toString();
        item = item.replace(/\./g,'');
        item = item.replace(/\,/g,'.');
        var p = parseFloat(item) || 0;
        var sl = this.state.number[index].toString();
        sl = sl.replace(/\./g,'');
        sl = sl.replace(/\,/g,'.');
        var this_sl = parseInt(sl) || 0;
        gia = gia + Math.round((this_sl*p));

        copied[index] = p;
      });
      vat = Math.round((gia*val/100));
    }
    vat = vat.toString();
    vat = vat.replace(/\./g,',');
    vat =  vat.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    this.setState({ vat: vat, priceVAT: copied, total: gia },()=>{
      this.setState({sum:this.sumOrder()});
    });
  };
  changeVATPercent(money){
    const copied = [...this.state.priceVAT];
    const checkPriceVat = this.state.checkPriceVat;
    const val = parseFloat(money) || 0;
    let gia = 0;
    let vat = 0;
    if (checkPriceVat==true) {
      this.state.price.map((item, index) => {
        item = item.toString();
        item = item.replace(/\./g,'');
        item = item.replace(/\,/g,'.');
        var p = parseFloat(item) || 0;
        var g = p*val*0.1/1.1;
        var v = Math.round(g*0.1);
        var n = p-v;

        var sl = this.state.number[index].toString();
        sl = sl.replace(/\./g,'');
        sl = sl.replace(/\,/g,'.');
        var this_sl = parseInt(sl) || 0;
        gia = gia + Math.round((this_sl*n));

        vat += v*this_sl;
        vat = Math.round(vat);

        copied[index] = Math.floor(n);
      });
    }
    else{
      this.state.price.map((item, index) => {
        item = item.toString();
        item = item.replace(/\./g,'');
        item = item.replace(/\,/g,'.');
        var p = parseFloat(item) || 0;
        var sl = this.state.number[index].toString();
        sl = sl.replace(/\./g,'');
        sl = sl.replace(/\,/g,'.');
        var this_sl = parseInt(sl) || 0;
        gia = gia + Math.round((this_sl*p));

        copied[index] = p;
      });
      vat = Math.round((gia*val/100));
    }
    vat = vat.toString();
    vat = vat.replace(/\./g,',');
    vat =  vat.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    this.setState({ vatPercent: money, vat: vat, priceVAT: copied, total: gia },()=>{
      this.setState({sum:this.sumOrder()});
    });
    
  };
  changeVAT(vat){
    vat = vat.replace(/\./g,'');
    vat = vat.replace(/\,/g,'.');
    vat = parseFloat(vat) || 0;
    var gia = 0;

    this.state.priceVAT.map((item, index) => {
      item = item.toString();
      item = item.replace(/\./g,'');
      item = item.replace(/\,/g,'.');
      var p = parseFloat(item) || 0;
      var sl = this.state.number[index].toString();
      sl = sl.replace(/\./g,'');
      sl = sl.replace(/\,/g,'.');
      var this_sl = parseInt(sl) || 0;
      gia = gia + Math.round((this_sl*p));
    });

    var percent = Math.round((vat*100/gia)*100)/100;

    vat = vat.toString();
    vat = vat.replace(/\./g,',');
    vat =  vat.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    this.setState({ vat: vat, vatPercent: percent.toString() },()=>{
      this.setState({sum:this.sumOrder()});
    });
  };
  changeDiscount(money){
    money = money.replace(/\./g,'');
    money =  money.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    this.setState({ discount: money },()=>{
      this.setState({sum:this.sumOrder()});
    });
  };
  changeWarrantyPercent(value){
    var gia = 0;
    value = parseFloat(value) || 0;
    this.state.price.map((item, index) => {
      item = item.toString();
      item = item.replace(/\./g,'');
      item = item.replace(/\,/g,'.');
      var p = parseFloat(item) || 0;
      var sl = this.state.number[index].toString();
      sl = sl.replace(/\./g,'');
      sl = sl.replace(/\,/g,'.');
      var this_sl = parseInt(sl) || 0;
      gia = gia + Math.round((this_sl*p));
    });

    let warranty = Math.round((gia*value/100));
    warranty = warranty.toString();
    warranty = warranty.replace(/\./g,',');
    warranty =  warranty.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    this.setState({ warrantyPercent: value.toString(), warranty: warranty },()=>{
      this.setState({sum:this.sumOrder()});
    });
  };
  changeWarranty(money){
    var warranty = money.replace(/\./g,'');
    warranty = warranty.replace(/\,/g,'.');
    warranty = parseFloat(warranty) || 0;
    var gia = 0;

    this.state.price.map((item, index) => {
      item = item.toString();
      item = item.replace(/\./g,'');
      item = item.replace(/\,/g,'.');
      var p = parseFloat(item) || 0;
      var sl = this.state.number[index].toString();
      sl = sl.replace(/\./g,'');
      sl = sl.replace(/\,/g,'.');
      var this_sl = parseInt(sl) || 0;
      gia = gia + Math.round((this_sl*p));
    });

    var percent = Math.round((warranty*100/gia)*100)/100;

    warranty = warranty.toString();
    warranty = warranty.replace(/\./g,',');
    warranty =  warranty.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    this.setState({ warranty: warranty, warrantyPercent: percent.toString() },()=>{
      this.setState({sum:this.sumOrder()});
    });
  };

  sumOrder(){
    let tt = this.state.total;
    let v = this.state.vat.toString();
        v = v.toString();
        v = v.replace(/\./g,'');
        v = v.replace(/\,/g,'.');
    let d = this.state.discount.toString();
        d = d.replace(/\./g,'');
        d = d.replace(/\,/g,'.');
    let w = this.state.warranty.toString();
        w = w.replace(/\./g,'');
        w = w.replace(/\,/g,'.');
    let sum = parseFloat(tt || 0)+parseFloat(v || 0)-parseFloat(d || 0)-parseFloat(w || 0);
        sum = sum.toString();
        sum = sum.replace(/\./g,',');
        sum =  sum.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return sum;
  };

  addOrder(){
    this.setState({ loading: true });
    const {type,customer,customer_name,company,mst,address,phone,email,contact,selectedStaff,selectedBrand,selectedSize,selectedPattern,number,maxNumber,price,priceVAT,checkPriceVat,vatPercent,vat,discount,warrantyPercent,warranty,deliveryDate,dueDate,comment,sum} = this.state;
    if (customer_name=='') {
      Alert.alert('Thông báo', 'Vui lòng nhập vào tên khách hàng!');
      this.setState({ loading: false });
      return;
    }
    else if(address==''){
      Alert.alert('Thông báo', 'Vui lòng nhập vào địa chỉ!');
      this.setState({ loading: false });
      return;
    }
    else if(phone=='' || phone=='0' || phone=='0000000000' || phone.length < 10){
      Alert.alert('Thông báo', 'Vui lòng nhập vào số điện thoại!');
      this.setState({ loading: false });
      return;
    }
    else if(contact==''){
      Alert.alert('Thông báo', 'Vui lòng nhập vào tên người liên hệ!');
      this.setState({ loading: false });
      return;
    }
    else if(number.length==0){
      Alert.alert('Thông báo', 'Vui lòng nhập vào sản phẩm!');
      this.setState({ loading: false });
      return;
    }
    else{
      fetch('https://viet-trade.org/api/addorder',{
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
          brand:selectedBrand,
          size:selectedSize,
          pattern:selectedPattern,
          number:number,
          maxNumber:maxNumber,
          price:price,
          priceVAT:priceVAT,
          checkPriceVat:checkPriceVat,
          vatPercent:vatPercent,
          vat:vat,
          discount:discount,
          warrantyPercent:warrantyPercent,
          warranty:warranty,
          deliveryDate:deliveryDate,
          dueDate:dueDate,
          comment:comment,
          total:sum,
          user: this.state.user
        })

      })
      .then((response) => response.json())
       .then((res)=>{
         if(res.err == 1){
            this.setState({ loading: false });
            Alert.alert(
              'Thông báo',
              res.msg,
              [
                {text: 'Tiếp tục đặt hàng', onPress: () => this.refreshScreen(), style: 'cancel'},
                {text: 'Thoát', onPress: () => {this.refreshScreen();this.props.navigation.navigate('PurchaseOrderScreen');}},
              ],
              { cancelable: false }
            );
         }else{
           Alert.alert('Thông báo', res.msg);
           this.setState({ loading: false });
         }
       })
    }
    
  }

  render() {
    const animationValue = this.animatedValue.interpolate(
    {
        inputRange: [ 0, 1 ],
        outputRange: [ -59, 0 ]
    });

    let newArray = this.state.valueArray.map(( item, key ) =>
    {
        if(( key ) == this.index)
        {
            return(
                <Animated.View key = { key } style = {[ styles.viewHolder, { opacity: this.animatedValue, transform: [{ translateY: animationValue }] }]}>
                    <View style={styles.col}>
                      <Text style={styles.borderRound}>{item.index+1}</Text>
                      <View>
                        <View style={styles.col}>
                          <Picker
                            mode="dropdown"
                            style={{ width: undefined,borderWidth: 0.5,borderColor: '#999999' }}
                            placeholder="Thương hiệu  v"
                            placeholderStyle={{ color: "#999999" }}
                            placeholderIconColor="#007aff"
                            selectedValue={this.state.selectedBrand[item.index]}
                            onValueChange={(value)=>{this.onChangeBrand(value,item.index)}}
                          >
                          {this.state.brands.map((item, key) => {return <Picker.Item value={item.tire_brand_id} label={item.tire_brand_name} key={item.tire_brand_id}  /> })}
                          </Picker>
                          <Picker
                            mode="dropdown"
                            style={{ width: undefined,borderWidth: 0.5,borderColor: '#999999' }}
                            placeholder="Kích cỡ  v"
                            placeholderStyle={{ color: "#999999" }}
                            placeholderIconColor="#007aff"
                            selectedValue={this.state.selectedSize[item.index]}
                            onValueChange={(value)=>{this.onChangeSize(value,item.index)}}
                          >
                          {this.state.sizes.map((item, key) => {return <Picker.Item value={item.tire_size_id} label={item.tire_size_number} key={item.tire_size_id}  /> })}
                          </Picker>
                          <Picker
                            mode="dropdown"
                            style={{ width: undefined,borderWidth: 0.5,borderColor: '#999999' }}
                            placeholder="Mã gai  v"
                            placeholderStyle={{ color: "#999999" }}
                            placeholderIconColor="#007aff"
                            selectedValue={this.state.selectedPattern[item.index]}
                            onValueChange={(value)=>{this.onChangePattern(value,item.index)}}
                          >
                          {this.state.patterns.map((item, key) => {return <Picker.Item value={item.tire_pattern_id} label={item.tire_pattern_name} key={item.tire_pattern_id}  /> })}
                          </Picker>
                        </View>
                        <View style={styles.col}>
                          <View style={{width: '30%'}}>
                              <Item>
                                <Icon active name='logo-buffer' />
                                <Input placeholder='Số lượng' keyboardType="numeric" returnKeyType='done' value={`${this.state.number[item.index]}`} onChangeText={(value) => this.checkMax(value,item.index)} />
                              </Item>
                          </View>
                          <View style={{width: '40%'}}>
                              <Item>
                                <Icon active name='logo-usd' />
                                <Input placeholder='Đơn giá' keyboardType="numeric" returnKeyType='done' value={`${this.state.price[item.index]}`} onChangeText={(value) => this._addMaskMoney(value,item.index)} />
                              </Item>
                          </View>
                          <View style={{width: '30%'}}>
                              <Item>
                                <Icon active name='ios-warning' style={{color: '#e3116c'}} />
                                <Input placeholder='Tồn kho' keyboardType="numeric" style={{color: '#e3116c'}} value={`${this.state.maxNumber[item.index]}`} disabled  />
                              </Item>
                          </View>
                        </View>
                      </View>
                    </View>
                </Animated.View>
            );
        }
        else
        {
            return(
                <View key = { key } style = { styles.viewHolder }>
                    <View style={styles.col}>
                      <Text style={styles.borderRound}>{item.index+1}</Text>
                      <View>
                        <View style={styles.col}>
                          <Picker
                            mode="dropdown"
                            style={{ width: undefined,borderWidth: 0.5,borderColor: '#999999' }}
                            placeholder="Thương hiệu  v"
                            placeholderStyle={{ color: "#999999" }}
                            placeholderIconColor="#007aff"
                            selectedValue={this.state.selectedBrand[item.index]}
                            onValueChange={(value)=>{this.onChangeBrand(value,item.index)}}
                          >
                          {this.state.brands.map((item, key) => {return <Picker.Item value={item.tire_brand_id} label={item.tire_brand_name} key={item.tire_brand_id}  /> })}
                          </Picker>
                          <Picker
                            mode="dropdown"
                            style={{ width: undefined,borderWidth: 0.5,borderColor: '#999999' }}
                            placeholder="Kích cỡ  v"
                            placeholderStyle={{ color: "#999999" }}
                            placeholderIconColor="#007aff"
                            selectedValue={this.state.selectedSize[item.index]}
                            onValueChange={(value)=>{this.onChangeSize(value,item.index)}}
                          >
                          {this.state.sizes.map((item, key) => {return <Picker.Item value={item.tire_size_id} label={item.tire_size_number} key={item.tire_size_id}  /> })}
                          </Picker>
                          <Picker
                            mode="dropdown"
                            style={{ width: undefined,borderWidth: 0.5,borderColor: '#999999' }}
                            placeholder="Mã gai  v"
                            placeholderStyle={{ color: "#999999" }}
                            placeholderIconColor="#007aff"
                            selectedValue={this.state.selectedPattern[item.index]}
                            onValueChange={(value)=>{this.onChangePattern(value,item.index)}}
                          >
                          {this.state.patterns.map((item, key) => {return <Picker.Item value={item.tire_pattern_id} label={item.tire_pattern_name} key={item.tire_pattern_id}  /> })}
                          </Picker>
                        </View>
                        <View style={styles.col}>
                          <View style={{width: '30%'}}>
                              <Item>
                                <Icon active name='logo-buffer' />
                                <Input placeholder='Số lượng' keyboardType="numeric" returnKeyType='done' value={`${this.state.number[item.index]}`} onChangeText={(value) => this.checkMax(value,item.index)} />
                              </Item>
                          </View>
                          <View style={{width: '40%'}}>
                              <Item>
                                <Icon active name='logo-usd' />
                                <Input placeholder='Đơn giá' keyboardType="numeric" returnKeyType='done' value={`${this.state.price[item.index]}`} onChangeText={(value) => this._addMaskMoney(value,item.index)} />
                              </Item>
                          </View>
                          <View style={{width: '30%'}}>
                              <Item>
                                <Icon active name='ios-warning' style={{color: '#e3116c'}} />
                                <Input placeholder='Tồn kho' keyboardType="numeric" style={{color: '#e3116c'}} value={`${this.state.maxNumber[item.index]}`} disabled  />
                              </Item>
                          </View>
                        </View>
                      </View>
                    </View>
                </View>
            );
        }
    });

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <View style={styles.stepIndicator}>
            <StepIndicator onPress={(page) => {this.setState({currentPage:page},()=>{this.viewPager.setPage(page)})}} renderStepIndicator={this.renderStepIndicator} customStyles={secondIndicatorStyles} currentPosition={this.state.currentPage} labels={["KHÁCH HÀNG","SẢN PHẨM","CHI TIẾT","KHÁC","XÁC NHẬN"]} />
          </View>
          
          <ViewPager
          style={{flexGrow:1}}
          ref={(viewPager) => {this.viewPager = viewPager}}
          onPageSelected={(page) => {this.setState({currentPage:page.position})}}
          >
          <View>
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
                    isLoading={this.state.isLoading}
                    onChangeText={this.searchCustomer}
                    onInputCleared={this.onInputCleared}
                  />
                  <View style={styles.listViewContainer}>
                    <ListView
                      enableEmptySections
                      style={styles.listView}
                      dataSource={this.state.dataSource}
                      renderRow={this.renderRow}
                      renderSeparator={this.renderSeparator}
                    />
                  </View>
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
                </View>
            </KeyboardAwareScrollView>
          </View>
            <View>
              <KeyboardAwareScrollView>
                  <View style = {{ flex: 1, padding: 10 }}>
                  {
                      newArray
                  }
                  </View>
              </KeyboardAwareScrollView>

              <TouchableOpacity activeOpacity = { 0.8 } style = { styles.btn } disabled = { this.state.disabled } onPress = { this.addMore }>
                  <Icon name='ios-add' />
              </TouchableOpacity>
            </View>
            <View style={styles.progressiveInput}>
              <KeyboardAwareScrollView>
                <Text>Hóa đơn:</Text>
                <Item>
                  <Input keyboardType="numeric" returnKeyType='done' placeholder="%" value={this.state.vatPercent} onChangeText={(value) => this.changeVATPercent(value)} />
                  <Input keyboardType="numeric" returnKeyType='done' placeholder="VAT" value={this.state.vat} onChangeText={(value) => this.changeVAT(value)} />
                  <CheckBox style={styles.checkbox} checked={this.state.checkPriceVat} color="green" onPress={this.checkVAT.bind(this)} />
                </Item>
                <Item>
                  <Text>Chiết khấu:</Text>
                  <Input keyboardType="numeric" returnKeyType='done' value={this.state.discount} onChangeText={(value) => this.changeDiscount(value)} />
                </Item>
                <Item>
                  <Text>Bảo hành:</Text>
                  <Input keyboardType="numeric" returnKeyType='done' placeholder="%" value={this.state.warrantyPercent} onChangeText={(value) => this.changeWarrantyPercent(value)} />
                  <Input keyboardType="numeric" returnKeyType='done' placeholder="Giảm bảo hành" value={this.state.warranty} onChangeText={(value) => this.changeWarranty(value)} />
                </Item>
                <Item>
                  <Text>Ngày giao hàng:</Text>
                  <DatePicker
                    style={{width: 200}}
                    date={this.state.deliveryDate}
                    mode="date"
                    placeholder="Ngày giao hàng"
                    format="DD/MM/YYYY"
                    confirmBtnText="Chọn"
                    cancelBtnText="Hủy"
                    customStyles={{
                      dateIcon: {
                        position: 'absolute',
                        left: 0,
                        top: 4,
                        marginLeft: 0
                      },
                      dateInput: {
                        marginLeft: 15
                      }
                      // ... You can check the source to find the other keys.
                    }}
                    onDateChange={(date) => {this.setState({deliveryDate:date})}}
                  />
                </Item>
                <Item>
                  <Text>Hạn thanh toán:</Text>
                  <DatePicker
                    style={{width: 200}}
                    date={this.state.dueDate}
                    mode="date"
                    placeholder="Hạn thanh toán"
                    format="DD/MM/YYYY"
                    confirmBtnText="Chọn"
                    cancelBtnText="Hủy"
                    customStyles={{
                      dateIcon: {
                        position: 'absolute',
                        left: 0,
                        top: 4,
                        marginLeft: 0
                      },
                      dateInput: {
                        marginLeft: 15
                      }
                      // ... You can check the source to find the other keys.
                    }}
                    onDateChange={(date) => {this.setState({dueDate:date})}}
                  />
                </Item>
              </KeyboardAwareScrollView>
            </View>
            <View style={styles.progressiveInput}>
              <Text>Ghi chú</Text>
              <Textarea rowSpan={5} bordered value={this.state.comment} onChangeText={(value) => this.setState({comment:value})} />
            </View>
            <View style={styles.progressiveInput}>
              <ScrollView>
                <Separator bordered>
                  <Text style={styles.colLeft}>THÔNG TIN CÔNG TY</Text>
                </Separator>
                <ListItem>
                  <Text>{this.state.customer_name}</Text>
                </ListItem>
                <ListItem>
                  <Text>{this.state.company}</Text>
                </ListItem>
                <ListItem>
                  <Text>{this.state.mst}</Text>
                </ListItem>
                <ListItem>
                  <Text>{this.state.address}</Text>
                </ListItem>
                <ListItem last>
                  <Text>{this.state.phone}</Text>
                </ListItem>
                <Separator bordered>
                  <Text style={styles.colLeft}>THÔNG TIN ĐƠN HÀNG</Text>
                </Separator>
                
                  {
                    this.state.number.map((prop, i) => {
                      if (this.state.selectedBrand[i]>0 && this.state.selectedSize[i]>0 && this.state.selectedPattern[i]>0 && this.state.number[i]>0) {
                        let p = this.state.priceVAT[i].toString();
                        p = p.replace(/\./g,'');
                        p = p.replace(/\,/g,'.');
                        let n = this.state.number[i].toString();
                        n = n.replace(/\./g,'');
                        n = n.replace(/\,/g,'.');

                        let tt = parseFloat(p)*parseFloat(n);

                        tt = tt.toString();
                        tt = tt.replace(/\./g,',');
                        tt =  tt.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

                        p = p.toString();
                        p = p.replace(/\./g,',');
                        p =  p.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                        return(
                        <ListItem key={i}>
                          <View style={styles.col}>
                            <Text style={styles.borderRound}>{i+1}</Text>
                            <View>
                              <View style={styles.col}>
                                <Picker
                                  mode="dropdown"
                                  style={{ width: undefined,borderWidth: 0.5,borderColor: '#999999' }}
                                  placeholder="Thương hiệu  v"
                                  placeholderStyle={{ color: "#999999" }}
                                  placeholderIconColor="#007aff"
                                  selectedValue={this.state.selectedBrand[i]}
                                  enabled={false}
                                >
                                {this.state.brands.map((item, key) => {return <Picker.Item value={item.tire_brand_id} label={item.tire_brand_name} key={item.tire_brand_id}  /> })}
                                </Picker>
                                <Picker
                                  mode="dropdown"
                                  style={{ width: undefined,borderWidth: 0.5,borderColor: '#999999' }}
                                  placeholder="Kích cỡ  v"
                                  placeholderStyle={{ color: "#999999" }}
                                  placeholderIconColor="#007aff"
                                  selectedValue={this.state.selectedSize[i]}
                                  enabled={false}
                                >
                                {this.state.sizes.map((item, key) => {return <Picker.Item value={item.tire_size_id} label={item.tire_size_number} key={item.tire_size_id}  /> })}
                                </Picker>
                                <Picker
                                  mode="dropdown"
                                  style={{ width: undefined,borderWidth: 0.5,borderColor: '#999999' }}
                                  placeholder="Mã gai  v"
                                  placeholderStyle={{ color: "#999999" }}
                                  placeholderIconColor="#007aff"
                                  selectedValue={this.state.selectedPattern[i]}
                                  enabled={false}
                                >
                                {this.state.patterns.map((item, key) => {return <Picker.Item value={item.tire_pattern_id} label={item.tire_pattern_name} key={item.tire_pattern_id}  /> })}
                                </Picker>
                              </View>
                              <View style={styles.col}>
                                <View style={{width: '20%'}}>
                                    <Item>
                                      <Text>SL:</Text>
                                      <Input placeholder='Số lượng' keyboardType="numeric" value={`${this.state.number[i]}`} disabled  />
                                    </Item>
                                </View>
                                <View style={{width: '35%'}}>
                                    <Item>
                                      <Text>ĐG:</Text>
                                      <Input placeholder='Đơn giá' keyboardType="numeric" value={`${p}`} disabled  />
                                    </Item>
                                </View>
                                <View style={{width: '45%'}}>
                                    <Item>
                                      <Text>TT:</Text>
                                      <Input placeholder='Thành tiền' keyboardType="numeric" value={`${tt}`} disabled  />
                                    </Item>
                                </View>
                              </View>
                            </View>
                          </View>
                        </ListItem>
                        )
                      }
                    })
                  }
                <ListItem style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                  <Text style={styles.textRight}>{`VAT (${this.state.vatPercent}%): ${this.state.vat}`}</Text>
                </ListItem>
                <ListItem style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                  <Text style={styles.textRight}>Chiết khấu: {this.state.discount}</Text>
                </ListItem>
                <ListItem style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                  <Text style={styles.textRight}>Bảo hành: {this.state.warranty}</Text>
                </ListItem>
                <ListItem last style={{flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <Text style={styles.colLeft}>TỔNG THANH TOÁN: </Text>
                  <Text style={[styles.textRight,styles.colLeft]}>{this.state.sum}</Text>
                </ListItem>
                
                {this.state.loading ? (
                  <ActivityIndicator animating size="large" />
                ) : (
                  <Button full danger iconLeft onPress={()=>this.addOrder()} >
                    <Icon name='ios-cart' />
                    <Text style={{color: 'white' }}> ĐẶT HÀNG</Text>
                  </Button>
                )}

                <Button full transparent success onPress={()=>this.refreshScreen()} >
                  <Feather size={25} color='green' name='refresh-ccw' />
                </Button>
              </ScrollView>
            </View>
            
          </ViewPager>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepIndicator: {
    paddingTop:20,
    backgroundColor: '#fff'
  },
  page: {
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  map: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  progressiveInput: {
    margin: 0,
    padding: 10,
  },
  listViewContainer: {
    flex: 0,
    zIndex: 1000,
  },
  listView: {
    backgroundColor: 'white',
    position: 'absolute',
    height: 150,
    borderColor: 'black',
    borderBottomWidth: 0.5,
  },
  listItem: {
    padding: 10,
  },
  listItemSeparator: {
    borderWidth: 0.5,
    borderColor: 'lightgrey',
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