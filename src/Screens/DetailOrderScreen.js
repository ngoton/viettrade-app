import React, { Component } from 'react';
import {AsyncStorage, Alert, StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Modal, TouchableHighlight, ScrollView } from "react-native";
import {Thumbnail, List, ListItem, Container, Header, Tab, TabHeading, Tabs, ScrollableTab, Left, Right, Body, Item, Input, Icon, Button, SwipeRow, Form, Picker } from "native-base";
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';
import {Currency} from '../Components/Currency';
import {getDataStorage} from "../Components/Auth";

export default class DetailOrderScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      page: 1,
      seed: 1,
      query: "",
      error: null,
      refreshing: false,
      order: this.props.navigation.state.params.order,
      role: 0,
      user: null,
      editOrder: null,
    };
  }

  componentWillMount() {
    this.makeRemoteRequest();
    getDataStorage('role_logined')
      .then(res => this.setState({ role: res }))
      .catch(err => console.log(err));
    getDataStorage('userid_logined')
      .then(res => this.setState({ user: res }))
      .catch(err => console.log(err));
  }

  makeRemoteRequest = () => {
    const { page, seed, order } = this.state;
    const url = `https://viet-trade.org/api/detailorder/?seed=${seed}&page=${page}&results=20&order=${order}`;
    this.setState({ loading: true });

    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: page === 1 ? res.data : [...this.state.data, ...res.data],
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
        refreshing: true
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


  del(id){
    
      const msg = 'Bạn có chắc chắn muốn thực hiện điều này không?';
      Alert.alert(
        'XÓA ĐƠN HÀNG',
        msg,
        [
          {text: 'Đồng ý', onPress: () => {
            fetch('https://viet-trade.org/api/deletedetail',{
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
        <Container>
          <View style={styles.title}>
            <Text>{this.state.data[0].order_number}</Text>
          </View>
          <Header>
            <View style={styles.col}>
              <Text style={[styles.colCenter,styles.colWidth,styles.price]}>Thương hiệu</Text>
              <Text style={[styles.colCenter,styles.colWidth,styles.price]}>Kích cỡ</Text>
              <Text style={[styles.colCenter,styles.colWidth,styles.price]}>Mã gai</Text>
              <Text style={[styles.colCenter,styles.price]}>SL</Text>
              <Text style={[styles.colCenter,styles.colWidth,styles.price]}>Đơn giá</Text>
              <Text style={[styles.colCenter,styles.price]}>VAT</Text>
            </View>
          </Header>
          <List>
            <ScrollView>
              <FlatList
                data={this.state.data}
                renderItem={({ item }) => <SwipeRow
                  rightOpenValue={-100}
                  body={
                    <View style={styles.col}>
                      <Text style={[styles.colCenter,styles.colWidth]}>{item.tire_brand_name}</Text>
                      <Text style={[styles.colCenter,styles.colWidth]}>{item.tire_size_number}</Text>
                      <Text style={[styles.colCenter,styles.colWidth]}>{item.tire_pattern_name}</Text>
                      <Text style={[styles.colCenter,styles.price]}>{item.tire_number}</Text>
                      <Text style={[styles.colCenter,styles.colWidth]}>{((item.sale==this.state.user || item.sale_cskh==this.state.user) || this.state.role==1 || this.state.role==2 || this.state.role==8 || this.state.role==9) ? <Currency currency="vnd" value={item.tire_price_vat} /> : null}</Text>
                      <Text style={styles.colCenter}>{item.vat_percent>0?item.vat_percent+'%':null}</Text>
                      <Text style={styles.colCenter}>{item.check_price_vat==1?<Feather name="check-square" />:null}</Text>
                    </View>
                  }
                  right={
                    ((item.sale_lock!=1 && (item.sale==this.state.user || item.sale_cskh==this.state.user)) || this.state.role==1) ? <View style={styles.rightButton}><Button style={styles.btn} warning onPress={() => { this.props.navigation.navigate('EditOrderScreen', {order:item.order_tire,orderlist: item.order_tire_list_id }) } } ><Feather size={15} style={styles.icon} name="edit" /></Button><Button style={styles.btn} danger onPress={()=>this.del(item.order_tire_list_id)} ><Feather size={15} style={styles.icon} name="trash" /></Button></View> : null
                  }
                />}
                keyExtractor={item => item.order_tire_list_id}
                //ItemSeparatorComponent={this.renderSeparator}
                //ListHeaderComponent={this.renderHeader}
                //ListFooterComponent={this.renderFooter}
                onRefresh={this.handleRefresh}
                refreshing={this.state.refreshing}
                //onEndReached={this.handleLoadMore}
                //onEndReachedThreshold={50}
                //stickyHeaderIndices={[0]}
              />
            </ScrollView>
          </List>
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
  colWidth: {
    width: '20.5%',
  },
  colCenter: {
    paddingLeft: 5,
    borderLeftColor: 'black',
    borderLeftWidth: 1,
  },
  colRight: {
    width: '20%',
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
    borderColor: '#e78f08',
    borderWidth: 2,
    borderRadius: 5,
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
});
