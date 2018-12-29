import React, { Component } from 'react';
import {AsyncStorage, StyleSheet, View, Text,  TouchableOpacity, KeyboardAvoidingView, TouchableHighlight, ScrollView, FlatList, ActivityIndicator, ListView } from "react-native";
import {List, ListItem, Container, Header, Left, Right, Body, Item, Icon, Button, Picker, Badge } from "native-base";
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';
import {Currency} from '../Components/Currency';
import DatePicker from 'react-native-datepicker';
import SuggestionInput from '../Components/SuggestionInput';
import {getDataStorage} from "../Components/Auth";

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1.id !== r2.id,
});

export default class DebitScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      role: 0,
      data: [],
      total: 0,
      refreshing: false,
      loading: false,
      isLoading: false,
      dataSource: ds.cloneWithRows([]),
      customer_name: '',
      selectedCustomer: this.props.navigation.state.params.customer,
      staffs: [],
      selectedStaff: 0,
      endDate: moment(new Date()).format('DD/MM/YYYY'),
    };
    this.searchCustomer = this.searchCustomer.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderSeparator = this.renderSeparator.bind(this);
    this.onInputCleared = this.onInputCleared.bind(this);
  }

  componentDidMount() {
    this.getAllStaff();

    getDataStorage('role_logined')
      .then(res => this.setState({ role: res }))
      .catch(err => console.log(err));
    getDataStorage('userid_logined')
      .then(res => this.setState(
        { user: res, selectedStaff:this.state.selectedCustomer>0?0:res },
        ()=>{
          this.makeRemoteRequest();
        }
        )
      )
      .catch(err => console.log(err));
      
  };


  makeRemoteRequest = () => {
    const { endDate, selectedCustomer, selectedStaff } = this.state;
    const url = `https://viet-trade.org/api/debit/?end=${endDate}&customer=${selectedCustomer}&staff=${selectedStaff}`;
    this.setState({ loading: true });

    fetch(url)
      .then(res => res.json())
      .then(res => {

        this.setState({
          data: res.data,
          total: res.debit,
          loading: false,
          refreshing: false
        });
        
        
      })
      .catch(error => {
        
      });
  };
  handleRefresh = () => {
    this.setState(
      {
        dataSource: ds.cloneWithRows([]),
        customer_name: '',
        selectedCustomer: this.props.navigation.state.params.customer,
        selectedStaff: 0,
        endDate: moment(new Date()).format('DD/MM/YYYY'),
        refreshing: true
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };
  viewDebit(customer,name) {
    this.setState(
      {
        selectedCustomer: customer,
        customer_name: name
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };
  changeDate(end){
    this.setState(
      {
        endDate: end
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };
 
  async searchCustomer(query) {
    if (query != "") {
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
    if (this.state.selectedCustomer > 0) {
      this.setState({
        customer_name: '',
        selectedCustomer: 0,
        isLoading: false,
        dataSource: ds.cloneWithRows([]),
      },
      ()=>{
        this.makeRemoteRequest();
      });
    }
    
  }

  async onListItemClicked(prediction) {
    this.setState({
      customer_name: prediction.customer_name,
      selectedCustomer: prediction.customer_id,
      dataSource: ds.cloneWithRows([]),
    },
    () => {
      this.makeRemoteRequest();
    });
  };
  getAllStaff = () => {
    
    const url = `https://viet-trade.org/api/staffs`;

    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          staffs: res.data
        });
      })
      .catch(error => {
        
      });
  };
  onChangeStaff(value: string) {
    this.setState(
      {
        selectedStaff: value
      },
      () => {
        this.makeRemoteRequest();
      }
    );
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
          <View style={{zIndex: 2}}>
            <View style={styles.col}>
              <DatePicker
                style={{width: '30%'}}
                date={this.state.endDate}
                mode="date"
                placeholder="Ngày"
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
                onDateChange={(date) => {this.changeDate(date)}}
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
              <Picker.Item value="0" label="Tất cả" key="0"  />
              {this.state.staffs.map((item, key) => {return <Picker.Item value={item.account} label={item.staff_name} key={item.staff_id}  /> })}
              </Picker>
            </View>
            <View style={styles.progressiveInput}>
              <SuggestionInput
                value={this.state.customer_name}
                isLoading={this.state.isLoading}
                onChangeText={this.searchCustomer}
                onInputCleared={this.onInputCleared}
                placeholder="Tên khách hàng"
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
            </View>
          </View>
          <View style={{zIndex: 1,paddingBottom: 150}}>
            <View style={styles.center}>
              <Text style={[styles.name,styles.red]}>TỔNG CÔNG NỢ: <Currency currency="vnd" value={this.state.total} /></Text>
            </View>
            <View>
              <List>
                <FlatList
                  data={this.state.data}
                  renderItem={({ item }) => (
                    
                    <View style={styles.boxList}>
                    {
                      this.state.customer_name=="" ?
                      <ListItem thumbnail>
                        <Body>
                          <TouchableOpacity
                          onPress={()=>this.viewDebit(item.customer_id,item.customer_name)}
                          activeOpacity={1}>
                            <Text style={styles.name}>{item.customer_name}</Text>
                          </TouchableOpacity>
                        </Body>
                        <Right>
                          <Text style={[styles.name,styles.red]}><Feather name="pie-chart"/> <Currency currency="vnd" value={item.conlai} /></Text>
                        </Right>
                      </ListItem>
                      : null
                    }
                      <View>
                        <List>
                          <FlatList
                            data={item.detail}
                            renderItem={({ item }) => (
                              <View>
                                <View>
                                {
                                  item.order!=""?
                                  <TouchableOpacity
                                  onPress={() => {this.props.navigation.navigate('DetailOrderScreen', { order: item.order })}}
                                  activeOpacity={1}>
                                    <Text style={styles.name}>{item.code} - {moment.unix(item.date).format("DD/MM/YYYY")}</Text>
                                  </TouchableOpacity>
                                  : <Text style={styles.name}>{item.code} - {moment.unix(item.date).format("DD/MM/YYYY")}</Text>
                                }
                                </View>
                                <ListItem thumbnail>
                                  <Body>
                                    <Text style={styles.aqua}><Feather name="bar-chart"/> <Currency currency="vnd" value={item.money} />  </Text>
                                    <Text style={styles.green}><Feather name="check"/> <Currency currency="vnd" value={item.pay_money} />  </Text>
                                  </Body>
                                  <Right>
                                    <Text style={[styles.name,styles.red]}><Feather name="pie-chart"/> <Currency currency="vnd" value={item.conlai} /></Text>
                                  </Right>
                                </ListItem>
                              </View>
                            )}
                            keyExtractor={item => item.stt.toString()}
                          />
                        </List>
                      </View>
                    </View>
                      
                  )}
                  keyExtractor={item => item.customer_id}
                  onRefresh={this.handleRefresh}
                  refreshing={this.state.refreshing}
                />
              </List>
            </View>
          </View>
        </View>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  col: {
    flexDirection: 'row',
  },
  box: {
    margin: 5,
    backgroundColor: '#fff',
    width: '47%'
  },
  boxList: {
    marginTop: 5,
    backgroundColor: '#fff',
    padding: 10,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5
  },
  aqua: {
    color: '#00c0ef'
  },
  green: {
    color: '#00a65a'
  },
  red: {
    color: '#dd4b39'
  },
  purple: {
    color: '#605ca8'
  },
  orange: {
    color: '#f39c12'
  },
  pink: {
    color: '#d427af'
  },
  name: {
    fontWeight: 'bold',
  },
  center: {
    alignItems: 'center',
    alignContent: 'center',
    padding: 10
  },
  progressiveInput: {
    margin: 0,
    paddingLeft: 10,
    paddingRight: 10,
    width: '100%',
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
});