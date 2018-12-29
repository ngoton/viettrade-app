import React, { PureComponent } from 'react';
import {AsyncStorage, Alert, StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Modal, TouchableHighlight } from "react-native";
import {Thumbnail, List, ListItem, Container, Header, Tab, TabHeading, Tabs, ScrollableTab, Left, Right, Body, Item, Input, Icon, Button, SwipeRow, Form, Picker } from "native-base";
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';
import {Currency} from '../Components/Currency';
import {getDataStorage} from "../Components/Auth";
import DatePicker from 'react-native-datepicker';


export default class PurchaseScreen extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      fullData: [],
      page: 1,
      seed: 1,
      query: "",
      error: null,
      refreshing: false,
      role: 0,
      user: null,
      startDate: moment().startOf('month').format('DD/MM/YYYY'),
      endDate: moment().endOf('month').format('DD/MM/YYYY'),
      modalVisible: false,
      modalVisible2: false,
      modalVisible3: false,
      selectedStaff: "Nguyễn Văn Nghị",
      staffs: [],
      exportOrder: null,
      exstockDate: moment(new Date()).format('DD/MM/YYYY'),
      receiveDate: moment(new Date()).format('DD/MM/YYYY'),
      orderNum: "",
      lastID: "",
      discount: "",
      reduce: "",
      warranty: "",
      editItem: 0,
      indexItem: null
    };
  }

  componentDidMount() {
    this.makeRemoteRequest();
    getDataStorage('role_logined')
      .then(res => this.setState({ role: res }))
      .catch(err => console.log(err));
    getDataStorage('userid_logined')
      .then(res => this.setState({ user: res }))
      .catch(err => console.log(err));
  }

  makeRemoteRequest = () => {
    const { page, seed, startDate, endDate } = this.state;
    const url = `https://viet-trade.org/api/orders/?seed=${seed}&page=${page}&results=20&start=${startDate}&end=${endDate}`;
    this.setState({ loading: true });

    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: page === 1 ? res.data : [...this.state.data, ...res.data],
          fullData: page === 1 ? res.data : [...this.state.data, ...res.data],
          lastID: res.lastID,
          error: res.error || null,
          loading: false,
          refreshing: false
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        seed: this.state.seed + 1,
        refreshing: true,
        startDate: moment().startOf('month').format('DD/MM/YYYY'),
        endDate: moment().endOf('month').format('DD/MM/YYYY')
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };
  refreshItem = () => {
    this.setState((prevState) => {
      return {
        editItem: prevState.editItem+1
      }
    });
  };

  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  handleSearch = text => {
    const newData = this.state.fullData.filter(item => {
      const itemData = `${item.order_number!=null?item.order_number.toUpperCase():null} ${item.customer_name.toUpperCase()} ${item.username.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      data : newData,
      query: text
    });
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#CED0CE"
        }}
      />
    );
  };

  renderHeader = () => {
    return(
      <Header searchBar rounded>
        <Item>
          <Icon name="ios-search" />
          <Input placeholder="Tìm kiếm" 
          onChangeText={(text) => this.handleSearch(text)}
          value={this.state.query}
          />
        </Item>
      </Header>
    );
  };

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  getAllStaff = () => {
    
    const url = `https://viet-trade.org/api/staffs`;

    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          staffs: res.data,
        });
      })
      .catch(error => {
        
      });
  };

  changeDate(start, end){
    this.setState(
      {
        page: 1,
        seed: 1,
        refreshing: true,
        startDate: start,
        endDate: end
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
    this.getAllStaff();
  };
  setModalVisible2(visible) {
    this.setState({modalVisible2: visible});
  };
  setModalVisible3(visible) {
    this.setState({modalVisible3: visible});
  };

  addOrderNumber(){
    if(this.state.exportOrder > 0){
      this.setModalVisible2(false);
      let { data,indexItem,orderNum } = this.state;
      data[indexItem].order_number = orderNum;
      this.refreshItem();

      fetch('https://viet-trade.org/api/addordernumber',{
        method:'POST',
        header:{
          'Accept': 'application/json',
          'Content-type': 'application/json'
        },
        body:JSON.stringify({
          id: this.state.exportOrder,
          value: this.state.orderNum,
          user: this.state.user
        })

      })
      .then((response) => response.json())
       .then((res)=>{
         if(res.err == 1){
            
         }else{
           Alert.alert('Thông báo', res.msg);
           this.makeRemoteRequest();
         }
       })
    }
  };
  editDiscount(order_tire_id,discount,reduce,warranty,index){
    this.setState({
      exportOrder:order_tire_id, 
      discount:discount!=null?discount.replace(/\B(?=(\d{3})+(?!\d))/g, "."):"", 
      reduce:reduce!=null?reduce.replace(/\B(?=(\d{3})+(?!\d))/g, "."):"", 
      warranty:warranty!=null?warranty.replace(/\B(?=(\d{3})+(?!\d))/g, "."):"",
      indexItem:index
    },() => {this.setModalVisible3(true)}
    );
  }
  addDiscount(){
    this.setModalVisible3(false);
    let { data,indexItem,discount,reduce,warranty } = this.state;
    discount = discount.toString();
    discount = discount.replace(/\./g,'');
    discount = discount.replace(/\,/g,'.');
    discount = parseFloat(discount) || 0;
    reduce = reduce.toString();
    reduce = reduce.replace(/\./g,'');
    reduce = reduce.replace(/\,/g,'.');
    reduce = parseFloat(reduce) || 0;
    warranty = warranty.toString();
    warranty = warranty.replace(/\./g,'');
    warranty = warranty.replace(/\,/g,'.');
    warranty = parseFloat(warranty) || 0;
    data[indexItem].discount = discount.toString();
    data[indexItem].reduce = reduce.toString();
    data[indexItem].warranty = warranty.toString();
    data[indexItem].total = res.data;
    this.refreshItem();

      fetch('https://viet-trade.org/api/adddiscount',{
        method:'POST',
        header:{
          'Accept': 'application/json',
          'Content-type': 'application/json'
        },
        body:JSON.stringify({
          id: this.state.exportOrder,
          discount: this.state.discount,
          reduce: this.state.reduce,
          warranty: this.state.warranty,
          user: this.state.user
        })

      })
      .then((response) => response.json())
       .then((res)=>{
         if(res.err == 1){
            
         }else{
           Alert.alert('Thông báo', res.msg);
           this.makeRemoteRequest();
         }
       })
    
  };
  changeDiscount(money){
    money = money.replace(/\./g,'');
    money =  money.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    this.setState({ discount: money});
  };
  changeReduce(money){
    money = money.replace(/\./g,'');
    money =  money.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    this.setState({ reduce: money});
  };
  changeWarranty(money){
    money = money.replace(/\./g,'');
    money =  money.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    this.setState({ warranty: money});
  };
  exportStock(){
    if(this.state.exportOrder > 0){
      this.setModalVisible(false);
      let { data,indexItem,exstockDate,receiveDate } = this.state;
      data[indexItem].delivery_date = moment(moment(exstockDate, 'DD/MM/YYYY')).unix();
      data[indexItem].arrival_date = moment(moment(receiveDate, 'DD/MM/YYYY')).unix();
      data[indexItem].order_tire_status = 1;
      this.refreshItem();

      fetch('https://viet-trade.org/api/exstock',{
        method:'POST',
        header:{
          'Accept': 'application/json',
          'Content-type': 'application/json'
        },
        body:JSON.stringify({
          id: this.state.exportOrder,
          delivery: this.state.exstockDate,
          arrival: this.state.receiveDate,
          staff: this.state.selectedStaff,
          user: this.state.user
        })

      })
      .then((response) => response.json())
       .then((res)=>{
         if(res.err == 1){
            
         }else{
           Alert.alert('Thông báo', res.msg);
           this.makeRemoteRequest();
         }
       })
    }
    
  }

  approve(id, value, index){
    
    if(this.state.role == 1){
      const msg = value>0 ? 'Đơn hàng đã được duyệt, bạn có chắc chắn muốn hủy?' : 'Bạn có chắc chắn muốn thực hiện điều này không?';
      Alert.alert(
        'DUYỆT ĐƠN HÀNG',
        msg,
        [
          {text: 'Đồng ý', onPress: () => {
            let { data } = this.state;
            data[index].approve = value>0?null:this.state.user;
            data[index].sale_lock = value>0?null:1;
            this.refreshItem();

            fetch('https://viet-trade.org/api/approve',{
              method:'POST',
              header:{
                'Accept': 'application/json',
                'Content-type': 'application/json'
              },
              body:JSON.stringify({
                id: id,
                value: value,
                user: this.state.user
              })

            })
            .then((response) => response.json())
             .then((res)=>{
               if(res.err == 1){
                  //this.makeRemoteRequest();
                  
               }else{
                 Alert.alert('Thông báo', res.msg);
                 this.makeRemoteRequest();
               }
             })
          }},
          {text: 'Hủy', style: 'cancel' },
        ],
        { cancelable: false }
      )
    }
    
  };

  unlock(id, value, index){
    
    if(this.state.role == 1){
      const msg = value>0 ? 'Bạn có chắc chắn muốn mở khóa không?' : 'Bạn có chắc chắn muốn khóa không?';
      Alert.alert(
        'KHÓA ĐƠN HÀNG',
        msg,
        [
          {text: 'Đồng ý', onPress: () => {
            let { data } = this.state;
            data[index].sale_lock = value>0?null:1;
            this.refreshItem();

            fetch('https://viet-trade.org/api/unlock',{
              method:'POST',
              header:{
                'Accept': 'application/json',
                'Content-type': 'application/json'
              },
              body:JSON.stringify({
                id: id,
                value: value,
                user: this.state.user
              })

            })
            .then((response) => response.json())
             .then((res)=>{
               if(res.err == 1){
                  //this.makeRemoteRequest();
                  
               }else{
                 Alert.alert('Thông báo', res.msg);
                 this.makeRemoteRequest();
               }
             })
          }},
          {text: 'Hủy', style: 'cancel' },
        ],
        { cancelable: false }
      )
    }
    
  };

  revert(id,index){
    
      const msg = 'Bạn có chắc chắn muốn thực hiện điều này không?';
      Alert.alert(
        'HỦY ĐƠN HÀNG',
        msg,
        [
          {text: 'Đồng ý', onPress: () => {
            let { data } = this.state;
            data[index].delivery_date = null;
            data[index].arrival_date = null;
            data[index].order_tire_status = null;
            this.refreshItem();

            fetch('https://viet-trade.org/api/revert',{
              method:'POST',
              header:{
                'Accept': 'application/json',
                'Content-type': 'application/json'
              },
              body:JSON.stringify({
                id: id,
                user: this.state.user
              })

            })
            .then((response) => response.json())
             .then((res)=>{
               if(res.err == 1){
                  //this.makeRemoteRequest();
                  
               }else{
                 Alert.alert('Thông báo', res.msg);
                 this.makeRemoteRequest();
               }
             })
          }},
          {text: 'Hủy', style: 'cancel' },
        ],
        { cancelable: false }
      )
    
  }

  del(id){
    
      const msg = 'Bạn có chắc chắn muốn thực hiện điều này không?';
      Alert.alert(
        'HỦY ĐƠN HÀNG',
        msg,
        [
          {text: 'Đồng ý', onPress: () => {
            fetch('https://viet-trade.org/api/delete',{
              method:'POST',
              header:{
                'Accept': 'application/json',
                'Content-type': 'application/json'
              },
              body:JSON.stringify({
                id: id,
                user: this.state.user
              })

            })
            .then((response) => response.json())
             .then((res)=>{
               if(res.err == 1){
                  this.makeRemoteRequest();
               }else{
                 Alert.alert('Thông báo', res.msg);
               }
             })
          }},
          {text: 'Hủy', style: 'cancel' },
        ],
        { cancelable: false }
      )
    
  };

  print(id){
    const msg = 'Bạn có chắc chắn muốn thực hiện điều này không?';
    Alert.alert(
      'IN ĐƠN HÀNG',
      msg,
      [
        {text: 'In đơn hàng', onPress: () => {this.props.navigation.navigate('PrintOrderScreen', { order: id , type:1})}},
        {text: 'In (0 giá)', onPress: () => {this.props.navigation.navigate('PrintOrderScreen', { order: id , type:2})}},
        {text: 'Hủy', style: 'cancel' },
      ],
      { cancelable: false }
    )
  }
 

  render() {
    return (
      <View style={styles.container}>
        <Header searchBar rounded style={styles.header}>
          <Button style={{marginLeft: -5}} transparent onPress={() => {this.props.navigation.navigate('QRScanScreen')}}>
            <Feather size={25} name="maximize" style={styles.icon} />
          </Button>
          <Item style={styles.input}>
            <Icon name="ios-search" style={styles.text} />
            <Input style={styles.text}
            placeholderTextColor="#fff" 
            placeholder="Tìm kiếm" 
            onChangeText={(text) => this.handleSearch(text)}
            value={this.state.query}
            />
          </Item>
          <Button transparent onPress={() => {this.props.navigation.navigate('SaleReportScreen')}}>
            <Feather size={25} name="trending-up" style={styles.icon} />
          </Button>
          <Button transparent onPress={ () => { this.props.navigation.navigate('DebitScreen',{customer: 0}) }}>
            <Feather size={25} name="users" style={styles.icon} />
          </Button>
        </Header>
        <KeyboardAvoidingView behavior="padding" >
          <View style={styles.dateGroup}>
            <DatePicker
              style={{width: '49%'}}
              date={this.state.startDate}
              maxDate={this.state.endDate}
              mode="date"
              placeholder="Bắt đầu"
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
              onDateChange={(date) => {this.changeDate(date, this.state.endDate)}}
            />
            <DatePicker
              style={{width: '49%'}}
              date={this.state.endDate}
              minDate={this.state.startDate}
              mode="date"
              placeholder="Kết thúc"
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
              onDateChange={(date) => {this.changeDate(this.state.startDate, date)}}
            />
          </View>
        </KeyboardAvoidingView>
        {this.state.loading==true ? 
            
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <ActivityIndicator animating size="large" />
            </View>
          
        
        :
        <Container style={{backgroundColor: '#CED0CE'}}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.modalVisible}
            supportedOrientations={['portrait', 'landscape']}
            >
            <View style={styles.modal}>
              <View style={styles.modalContent}>
                <View style={styles.modalHead}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setModalVisible(!this.state.modalVisible);
                    }}>
                    <Feather size={25} name="x-circle" />
                  </TouchableOpacity>
                </View>
                <Text>Ngày giao hàng:</Text>
                <DatePicker
                  style={{width: 200}}
                  date={this.state.exstockDate}
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
                  onDateChange={(date) => {this.setState({exstockDate:date})}}
                />
                <Text>Ngày nhận hàng:</Text>
                <DatePicker
                  style={{width: 200}}
                  date={this.state.receiveDate}
                  mode="date"
                  placeholder="Ngày nhận hàng"
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
                  onDateChange={(date) => {this.setState({receiveDate:date})}}
                />
                <Text>NV bốc xếp:</Text>
                <Form>
                  <Item picker>
                    <Picker
                      mode="dropdown"
                      iosIcon={<Icon name="ios-arrow-down-outline" />}
                      style={{ width: undefined }}
                      placeholder="Chọn"
                      placeholderStyle={{ color: "#bfc6ea" }}
                      placeholderIconColor="#007aff"
                      selectedValue={this.state.selectedStaff}
                      onValueChange={(value) => {this.setState({selectedStaff:value})}}
                    >
                    {this.state.staffs.map((item, key) => {return <Picker.Item value={item.staff_name} label={item.staff_name} key={key}  /> })}
                    </Picker>
                  </Item>
                </Form>
                <TouchableOpacity
                  style={styles.btnLogin}
                  onPress={()=>this.exportStock()}
                  >
                  <Text style={styles.textLogin}>XUẤT KHO</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.modalVisible2}
            supportedOrientations={['portrait', 'landscape']}
            >
            <View style={styles.modal}>
              <View style={styles.modalContent}>
                <View style={styles.modalHead}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setModalVisible2(!this.state.modalVisible2);
                    }}>
                    <Feather size={25} name="x-circle" />
                  </TouchableOpacity>
                </View>
                <Item>
                  <Text>Số đơn hàng:</Text>
                  <Input value={`${this.state.orderNum}`} onChangeText={(value) => this.setState({orderNum:value})} />
                </Item>
                
                <TouchableOpacity
                  style={styles.btnLogin}
                  onPress={()=>this.addOrderNumber()}
                >
                  <Text style={styles.textLogin}>LƯU</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.modalVisible3}
            supportedOrientations={['portrait', 'landscape']}
            >
            <View style={styles.modal}>
              <View style={styles.modalContent}>
                <View style={styles.modalHead}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setModalVisible3(!this.state.modalVisible3);
                    }}>
                    <Feather size={25} name="x-circle" />
                  </TouchableOpacity>
                </View>
                <Item>
                  <Text>Chiết khấu:</Text>
                  <Input keyboardType="numeric" returnKeyType='done' value={`${this.state.discount}`} onChangeText={(value) => this.changeDiscount(value)} />
                </Item>
                <Item>
                  <Text>Giảm giá khác:</Text>
                  <Input keyboardType="numeric" returnKeyType='done' value={`${this.state.reduce}`} onChangeText={(value) => this.changeReduce(value)} />
                </Item>
                <Item>
                  <Text>Bảo hành:</Text>
                  <Input keyboardType="numeric" returnKeyType='done' value={`${this.state.warranty}`} onChangeText={(value) => this.changeWarranty(value)} />
                </Item>
                <TouchableOpacity
                  style={styles.btnLogin}
                  onPress={()=>this.addDiscount()}
                >
                  <Text style={styles.textLogin}>LƯU</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <List>
            <FlatList
              data={this.state.data}
              extraData={this.state}
              renderItem={({ item, index }) => <View style={styles.SwipeRow}><SwipeRow
                leftOpenValue={75}
                rightOpenValue={-100}
                left={
                  ((item.sale==this.state.user || item.sale_cskh==this.state.user) || this.state.role==1 || this.state.role==2 || this.state.role==3 || this.state.role==8 || this.state.role==9) ?
                    <Button success onPress={() => {this.props.navigation.navigate('DetailOrderScreen', { order: item.order_tire_id })}}>
                      <Feather size={20} style={styles.icon} active name="info" />
                    </Button>
                    : null
                }
                body={
                  <View>
                    <View style={styles.col}>
                      <View style={styles.colLeft}>
                        
                        <View style={styles.title}>
                          <TouchableOpacity onPress={()=>{this.setState({exportOrder:item.order_tire_id, orderNum:(item.order_number==null?this.state.lastID:item.order_number), indexItem:index},() => {this.setModalVisible2(true)})}} >
                            <Text style={styles.boldColor} numberOfLines={1}>{(item.order_number!=null && item.order_number!="") ? item.order_number : <Feather size={18} name="more-horizontal" />}</Text>
                          </TouchableOpacity>
                          <Text numberOfLines={1}>{item.username}</Text>
                          <View style={styles.col}>
                            <TouchableOpacity onPress={()=>this.approve(item.order_tire_id,item.approve,index)} >
                              <Text >{item.approve!=null ? <Feather size={19} style={styles.valid} name="check-circle" /> : <Feather size={19} style={styles.invalid} name="circle" />}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>this.unlock(item.order_tire_id,item.sale_lock,index)} >
                              <Text style={{marginLeft: 10}} >{item.sale_lock==1 ? <Feather size={19} name="lock" /> : <Feather size={19} name="unlock" />}</Text>
                            </TouchableOpacity>
                          </View>
                          <TouchableOpacity onPress={()=>{this.props.navigation.navigate('ViewOrderScreen', { order: item.order_tire_id })}} >
                          {
                            ((item.sale==this.state.user || item.sale_cskh==this.state.user) || this.state.role==1 || this.state.role==2 || this.state.role==3 || this.state.role==8 || this.state.role==9) ? <Feather size={19} name="eye" /> : null
                          }
                          </TouchableOpacity>
                        </View>
                        
                      </View>
                      <View style={styles.colCenter}>
                        <TouchableOpacity onPress={()=>{(item.sale==this.state.user || this.state.role==1 || this.state.role==2 || this.state.role==8 || this.state.role==9) ? this.props.navigation.navigate('CustomerScreen', { customer: item.customer }) : null}} >
                          <Text style={styles.boldColor}><Feather name="user" /> {item.customer_name}</Text>
                        </TouchableOpacity>
                        <Text note numberOfLines={1}><Feather name="box" /> {item.order_tire_number}</Text>
                        <Text note numberOfLines={1}><Feather name="check" /> <Currency currency="vnd" value={item.vat} /></Text>
                        <TouchableOpacity onPress={() => {((item.sale_lock!=1 && (item.sale==this.state.user || item.sale_cskh==this.state.user)) || this.state.role==1)?this.editDiscount(item.order_tire_id,item.discount,item.reduce,item.warranty,index):null}}>
                          <Text note numberOfLines={1}><Feather name="tag" /> <Currency currency="vnd" value={parseFloat(item.discount || 0)+parseFloat(item.reduce || 0)+parseFloat(item.warranty || 0)} /></Text>
                        </TouchableOpacity>
                        <Text style={styles.price}>$ <Currency currency="vnd" value={item.total} /></Text>
                      </View>
                      <View style={styles.colRight}>
                        <View style={styles.exportButton}>
                          <Button small transparent onPress={() => { this.setState({exportOrder: item.order_tire_id, exstockDate: moment.unix(item.delivery_date>0?item.delivery_date:new Date().getTime()/1000).format("DD/MM/YYYY"), receiveDate: moment.unix(item.arrival_date>0?item.arrival_date:new Date().getTime()/1000).format("DD/MM/YYYY"),indexItem:index},() => {this.setModalVisible(true)}) } }>
                            <Text style={item.order_tire_status==1 ? styles.valid : styles.invalid} >{item.order_tire_status==1 ? moment.unix(item.delivery_date).format("DD/MM/YYYY") : 'Chưa xuất'}</Text>
                          </Button>
                        </View>
                        {item.approve!=null?
                        <Button small transparent onPress={() => {this.print(item.order_tire_id)}}>
                          <Feather size={20} name="printer" />
                        </Button>
                        :null}
                      </View>
                    </View>
                    <View style={styles.bottomBar}>
                      <View style={styles.textBottomBar}><Text style={styles.textBar}><Feather color="red" name="percent" />{item.percent} </Text></View>
                      <View style={styles.textBottomBar}>
                        <TouchableOpacity onPress={() => {this.props.navigation.navigate('OrderCostScreen', { order: item.order_tire_id })}}>
                          <Text style={styles.textBar}><Feather color="orange" name="hash" /><Currency currency="vnd" value={item.order_cost} /> </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.textBottomBar}><Text style={styles.textBar}><Feather color="purple" name="award" /><Currency currency="vnd" value={item.salary} /></Text></View>
                    </View>
                  </View>
                }
                right={
                  ((item.sale_lock!=1 && (item.sale==this.state.user || item.sale_cskh==this.state.user)) || this.state.role==1) ? <View style={styles.rightButton}><Button style={styles.btn} warning onPress={()=>this.revert(item.order_tire_id,index)} ><Feather size={15} style={styles.icon} name="x-circle" /></Button><Button style={styles.btn} danger onPress={()=>this.del(item.order_tire_id)} ><Feather size={15} style={styles.icon} name="trash" /></Button></View> : null
                }
              /></View>}
              keyExtractor={item => item.order_tire_id}
              //ItemSeparatorComponent={this.renderSeparator}
              //ListHeaderComponent={this.renderHeader}
              ListFooterComponent={this.renderFooter}
              onRefresh={this.handleRefresh}
              refreshing={this.state.refreshing}
              //onEndReached={this.handleLoadMore}
              //onEndReachedThreshold={50}
              //stickyHeaderIndices={[0]}
              
            />
          </List>
        </Container>
      }
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  price: {
    fontWeight: 'bold'
  },
  title: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  col: {
    flex: 1,
    flexDirection: 'row',
  },
  colLeft: {
    width: '20%',
  },
  colCenter: {
    paddingLeft: 10,
    width: '57%',
    borderLeftColor: 'black',
    borderLeftWidth: 1,
  },
  colRight: {
    width: '23%',
  },
  rightButton: {
    flex: 1,
    flexDirection: 'row',
    height: "100%"
  },
  btn: {
    height: '100%',
    justifyContent: 'center'
  },
  icon: {
    color: 'white'
  },
  valid: {
    color: 'green'
  },
  invalid: {
    color: 'red'
  },
  dateGroup: {
    flexDirection: 'row',
  },
  modal: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 45, 50, 0.4)'
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 15,
    padding: 5
  },
  modalHead: {
    alignItems: 'flex-end'
  },
  btnLogin: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e78f08',
    height: 40,
    borderRadius: 20,
    zIndex: 100,
    marginTop: 20
  },
  textLogin: {
    color: 'white',
    backgroundColor: 'transparent',
  },
  header: {
    backgroundColor: '#0070c9'
  },
  input: {
    marginLeft: 10,
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  text: {
    color: '#fff'
  },
  SwipeRow: {
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
  },
  boldColor: {
    color: '#0070c9'
  },
  bottomBar: {
    flexDirection: 'row',
    borderTopColor: '#e5e5e5',
    borderTopWidth: 1,
    marginBottom: -12,
    paddingTop: 3,
    paddingBottom: 3
  },
  textBottomBar: {
    width: '33%',
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftColor: '#e5e5e5',
    borderLeftWidth: 1,
  },
  textBar: {
    color: 'grey'
  },
  exportButton: {
    paddingLeft: 4,
    paddingRight: 4,
    borderColor: 'orange',
    borderWidth: 0.5,
    borderRadius: 20
  }
});
