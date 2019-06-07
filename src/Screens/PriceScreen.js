import React, { Component } from 'react';
import {StyleSheet, View, Text, FlatList, ActivityIndicator, Modal, TouchableOpacity, Animated} from "react-native";
import {Thumbnail, List, ListItem, Container, Header, Tab, TabHeading, Tabs, ScrollableTab, Left, Right, Body, Item, Input, Icon, Button, CheckBox } from "native-base";
import {Currency} from '../Components/Currency';
import Feather from 'react-native-vector-icons/Feather';

export default class PriceScreen extends Component {
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
      modalVisible: false,
      modalVisible2: false,
      modalVisible3: false,
      percent: "",
      number: "",
      email: "",
      editItem: 0,
      editMode: false,
      controlHeight: new Animated.Value(0),
      controlOpacity: new Animated.Value(0),
      controlWidth: new Animated.Value(0)
    };
  }

  componentDidMount() {
    this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
    const { page, seed } = this.state;
    const url = `https://viet-trade.org/api/prices/?seed=${seed}&page=${page}&results=20`;
    this.setState({ loading: true });

    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: page === 1 ? res.data : [...this.state.data, ...res.data],
          fullData: page === 1 ? res.data : [...this.state.data, ...res.data],
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
        percent: "",
        number: ""
      },
      () => {
        this.makeRemoteRequest();
      }
    );
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
      const itemData = `${item.tire_brand_name.toUpperCase()} ${item.tire_size_number.toUpperCase()} ${item.tire_pattern_name.toUpperCase()}`;
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
  refreshItem = () => {
    this.setState((prevState) => {
      return {
        editItem: prevState.editItem+1
      }
    });
  };
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  };
  setModalVisible2(visible) {
    this.setState({modalVisible2: visible});
  };
  setModalVisible3(visible) {
    this.setState({modalVisible3: visible});
  };
  percentDiscount(){
    this.setModalVisible(false);
    let { data,percent } = this.state;
    percent = parseFloat(percent) || 0;
    data.forEach((item) => {
      var gia = item.tire_price;
      gia = gia.toString();
      gia = gia.replace(/\./g,'');
      gia = gia.replace(/\,/g,'.');
      gia = parseFloat(gia) || 0;
      gia = Math.round((gia*(100-percent)/100)/1000)*1000;
      item.tire_price_opt = gia.toString();
    });
    this.refreshItem();
  };
  numberDiscount(){
    this.setModalVisible2(false);
    let { data,number } = this.state;
    number = parseFloat(number) || 0;
    data.forEach((item) => {
      if (number==0) {
        var gia = item.tire_price;
      }
      else if (number<20) {
        var gia = item.tire_retail;
      }
      else if(number<40){
        var gia = item.tire_20;
      }
      else if(number<60){
        var gia = item.tire_40;
      }
      else if(number<80){
        var gia = item.tire_60;
      }
      else if(number<100){
        var gia = item.tire_80;
      }
      else if(number<120){
        var gia = item.tire_100;
      }
      else if(number<150){
        var gia = item.tire_120;
      }
      else if(number<180){
        var gia = item.tire_150;
      }
      else if(number<220){
        var gia = item.tire_180;
      }
      else {
        var gia = item.tire_cont;
      }

      item.tire_price_opt = gia.toString();
    });
    this.refreshItem();
  };



  toggleEditMode() {
      if (!this.state.editMode) {
          Animated.sequence([
              Animated.parallel([
                  Animated.timing(this.state.controlOpacity, { toValue: 1, duration: 300 }),
                  Animated.timing(this.state.controlHeight, { toValue: 60, duration: 300}),
                  Animated.timing(this.state.controlWidth, { toValue: 60, duration: 300})
              ])
          ]).start();
      } else {
          Animated.sequence([
              Animated.parallel([
                  Animated.timing(this.state.controlOpacity, { toValue: 0, duration: 300 }),
                  Animated.timing(this.state.controlHeight, { toValue: 0, duration: 300}),
                  Animated.timing(this.state.controlWidth, { toValue: 0, duration: 300})
              ])
          ]).start();
      }

      this.setState({
          editMode: !this.state.editMode
      });
  }

  toggleCheckForTask(index) {
      // the ischecked value will be set for that task in the tasks array
      var newTasks = this.state.fullData;
      newTasks[index].isChecked = !newTasks[index].isChecked;
      
      this.setState({
          data: newTasks
      });

  }
  checkedAll() {
      // the ischecked value will be set for that task in the tasks array
      var newTasks = this.state.fullData;
      
      newTasks.map((item, index) => {
        newTasks[index].isChecked = !newTasks[index].isChecked;
      });
      
      this.setState({
          data: newTasks
      });

  }

  orderClick(){
    let tireArr = [];
    this.state.data.map((item, index) => {
      if (item.isChecked==true) {
        tireArr.push({
            'tire_brand': item.tire_brand, 
            'tire_size': item.tire_size,
            'tire_pattern': item.tire_pattern,
            'tire_price': !item.tire_price_opt?item.tire_price:item.tire_price_opt,
        });
      }
    });
    this.props.navigation.navigate('OrderScreen', { tireArr: tireArr });
  }
  printClick(){
    let tireArr = [];
    this.state.data.map((item, index) => {
      if (item.isChecked==true) {
        tireArr.push({
            'tire_brand': item.tire_brand, 
            'tire_size': item.tire_size,
            'tire_pattern': item.tire_pattern,
            'tire_price': !item.tire_price_opt?item.tire_price:item.tire_price_opt,
        });
      }
    });
    fetch('https://viet-trade.org/api/createquotation',{
      method:'POST',
      header:{
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body:JSON.stringify({
        value: tireArr,
        user: this.state.user
      })

    })
    .then((response) => response.json())
     .then((res)=>{
       if(res.err == 1){
          this.props.navigation.navigate('PrintQuotationScreen');
       }else{
         Alert.alert('Thông báo', res.msg);
       }
     })

    
  }
  sendMail(){
    let tireArr = [];
    this.state.data.map((item, index) => {
      if (item.isChecked==true) {
        tireArr.push({
            'tire_brand': item.tire_brand, 
            'tire_size': item.tire_size,
            'tire_pattern': item.tire_pattern,
            'tire_price': !item.tire_price_opt?item.tire_price:item.tire_price_opt,
        });
      }
    });

    this.setModalVisible3(false);

    fetch('https://viet-trade.org/api/sendquotation',{
      method:'POST',
      header:{
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body:JSON.stringify({
        email: this.state.email,
        value: tireArr,
        user: this.state.user
      })

    })
    .then((response) => response.json())
     .then((res)=>{
       if(res.err == 1){
          Alert.alert('Thông báo', res.msg);
       }else{
         Alert.alert('Thông báo', res.msg);
       }
     })
  }

  render() {
    return (
      <View style={styles.container}>
        <Container>
          <Header searchBar rounded style={styles.header}>
            <Button style={{marginLeft: -5,marginRight: 5}} onPress={() => this.toggleEditMode()} transparent>
              <Feather size={25} name="menu" style={{color: 'white'}} />
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
            <Button transparent onPress={() => {this.setModalVisible(true)}}>
              <Feather size={25} name="percent" style={{color: 'white'}} />
            </Button>
            <Button transparent onPress={() => {this.setModalVisible2(true)}}>
              <Feather size={25} name="layers" style={{color: 'white'}} />
            </Button>
          </Header>
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
                <Item>
                  <Text>Chiết khấu (%):</Text>
                  <Input keyboardType="numeric" returnKeyType='done' value={`${this.state.percent}`} onChangeText={(value) => this.setState({percent:value,number:""})} />
                </Item>
                
                <TouchableOpacity
                  style={styles.btnLogin}
                  onPress={()=>this.percentDiscount()}
                >
                  <Text style={styles.textLogin}>LẤY GIÁ</Text>
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
                  <Text>Số lượng:</Text>
                  <Input keyboardType="numeric" returnKeyType='done' value={`${this.state.number}`} onChangeText={(value) => this.setState({number:value,percent:""})} />
                </Item>
                
                <TouchableOpacity
                  style={styles.btnLogin}
                  onPress={()=>this.numberDiscount()}
                >
                  <Text style={styles.textLogin}>LẤY GIÁ</Text>
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
                  <Text>Email người nhận:</Text>
                  <Input keyboardType="email-address" returnKeyType='done' value={`${this.state.email}`} onChangeText={(value) => this.setState({email:value})} />
                </Item>
                
                <TouchableOpacity
                  style={styles.btnLogin}
                  onPress={()=>this.sendMail()}
                >
                  <Text style={styles.textLogin}>GỬI</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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
            <Tabs locked={true} renderTabBar={()=> <ScrollableTab />}>
              <Tab heading={ <TabHeading>
                <Text>BẢNG GIÁ 
                  <Text style={styles.price}> {this.state.percent!=""?`${this.state.percent}`+"%":null} {this.state.number!=""?`${this.state.number}`+" bộ":null}</Text>
                </Text>
              </TabHeading>}>
                <Animated.View style={{...styles.controlStyles, opacity: this.state.controlOpacity, 
                height: this.state.controlHeight,position: 'absolute',right: 15,bottom: 150,borderRadius: 40,
                width: this.state.controlWidth,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#0070c9',
                padding: 17,
                zIndex: 1000,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.5,
                shadowRadius: 2,}}>
                    <Button transparent onPress={() => this.orderClick()} >
                      <Feather size={25} name="shopping-cart" style={{color: 'white'}} />
                    </Button>
                </Animated.View>
                <Animated.View style={{...styles.controlStyles, opacity: this.state.controlOpacity, 
                height: this.state.controlHeight,position: 'absolute',right: 15,bottom: 80,borderRadius: 40,
                width: this.state.controlWidth,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#0070c9',
                padding: 17,
                zIndex: 1000,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.5,
                shadowRadius: 2,}}>
                    <Button transparent onPress={() => this.printClick()} >
                      <Feather size={25} name="printer" style={{color: 'white'}} />
                    </Button>
                </Animated.View>
                <Animated.View style={{...styles.controlStyles, opacity: this.state.controlOpacity, 
                height: this.state.controlHeight,position: 'absolute',right: 15,bottom: 15,borderRadius: 40,
                width: this.state.controlWidth,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#0070c9',
                padding: 17,
                zIndex: 1000,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.5,
                shadowRadius: 2,}}>
                    <Button transparent onPress={() => this.setModalVisible3(true)} >
                      <Feather size={25} name="mail" style={{color: 'white'}} />
                    </Button>
                </Animated.View>
                <Animated.View style={{...styles.controlStyles, opacity: this.state.controlOpacity, 
                height: 20,
                width: this.state.controlWidth-40,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff',
                paddingLeft: 10,
                zIndex: 1000,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.5,
                shadowRadius: 2,}}>
                    <Button transparent onPress={() => this.checkedAll()} >
                      <Feather size={15} name="check-circle" style={{color: '#0070c9'}} /><Text>Tất cả</Text>
                    </Button>
                </Animated.View>
                <List>
                  <FlatList
                    data={this.state.data}
                    extraData={this.state}
                    renderItem={({ item,index }) => (
                      <ListItem thumbnail>
                        <Animated.View style={{opacity: this.state.controlOpacity, 
                            width: this.state.controlWidth}}>
                            <CheckBox checked={item.isChecked} onPress={() => this.toggleCheckForTask(index)} />
                        </Animated.View>
                        <Left>
                          <Thumbnail square source={{ uri: 'https://viet-trade.org/public/images/upload/'+item.tire_pattern_name+'.jpg' }} />
                        </Left>
                        <Body>
                          <Text>{item.tire_brand_name}</Text>
                          <Text note numberOfLines={1}>{item.tire_size_number} {item.tire_pattern_name}</Text>
                        </Body>
                        <Right>
                          <Button transparent>
                            <Text style={styles.price}><Currency currency="vnd" value={!item.tire_price_opt?item.tire_price:item.tire_price_opt} /></Text>
                          </Button>
                        </Right>
                      </ListItem>
                    )}
                    keyExtractor={item => item.tire_price_discount_id}
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
              </Tab>
              
            </Tabs>
          
          }
        </Container>
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
  header: {
    backgroundColor: '#0070c9'
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  text: {
    color: '#fff'
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
  }
});
