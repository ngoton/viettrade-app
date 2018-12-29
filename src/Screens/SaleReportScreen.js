import React, { Component } from 'react';
import {StyleSheet, View, Text,  TouchableOpacity, KeyboardAvoidingView, TouchableHighlight, ScrollView, FlatList, ActivityIndicator } from "react-native";
import {List, ListItem, Container, Header, Left, Right, Body, Item, Icon, Button, Picker, Badge } from "native-base";
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';
import {Currency} from '../Components/Currency';
import DatePicker from 'react-native-datepicker';

export default class SaleReportScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      role: 0,
      data: [],
      loading: false,
      startDate: moment().startOf('month').format('DD/MM/YYYY'),
      endDate: moment().endOf('month').format('DD/MM/YYYY'),
    };
   
  }

  componentDidMount() {
      this.makeRemoteRequest();
      
  };


  makeRemoteRequest = () => {
    const { startDate, endDate } = this.state;
    const url = `https://viet-trade.org/api/report/?start=${startDate}&end=${endDate}`;
    this.setState({ loading: true });

    fetch(url)
      .then(res => res.json())
      .then(res => {

        this.setState({
          data: res.data,
          loading: false
        });
        
        
      })
      .catch(error => {
        
      });
  };
  changeDate(start, end){
    this.setState(
      {
        startDate: start,
        endDate: end
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
      <ScrollView>
        <View style={styles.container}>
          <KeyboardAvoidingView behavior="padding" >
            <View style={styles.col}>
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
          <View style={styles.col}>
            <View style={styles.box}>
              <ListItem thumbnail>
                <Left>
                  <Feather style={styles.aqua} size={40} name="shopping-cart" />
                </Left>
                <Body>
                  <Text>Đơn hàng</Text>
                  <Text style={styles.aqua}><Currency currency="vnd" value={this.state.data.donhang} /></Text>
                </Body>
              </ListItem>
            </View>
            <View style={styles.box}>
              <ListItem thumbnail>
                <Left>
                  <Feather style={styles.green} size={40} name="bar-chart" />
                </Left>
                <Body>
                  <Text>Sản lượng</Text>
                  <Text style={styles.green}><Currency currency="vnd" value={this.state.data.sanluong} /></Text>
                </Body>
              </ListItem>
            </View>
          </View>
          <View style={styles.col}>
            <View style={styles.box}>
              <ListItem thumbnail>
                <Left>
                  <Feather style={styles.red} size={40} name="user-plus" />
                </Left>
                <Body>
                  <Text>Khách hàng</Text>
                  <Text style={styles.red}><Currency currency="vnd" value={this.state.data.khachhang} /></Text>
                </Body>
              </ListItem>
            </View>
            <View style={styles.box}>
              <ListItem thumbnail>
                <Left>
                  <Feather style={styles.purple} size={40} name="pie-chart" />
                </Left>
                <Body>
                  <Text>Doanh thu</Text>
                  <Text style={styles.purple}><Currency currency="vnd" value={this.state.data.doanhthu} /></Text>
                </Body>
              </ListItem>
            </View>
          </View>
          <View>
            <List>
              <FlatList
                data={this.state.data.staff}
                renderItem={({ item }) => (
                  
                  <View style={styles.boxList}>
                    <Text style={styles.name}>{item.staff_name}</Text>
                    <View>
                      <View style={styles.col}>
                        <Text style={styles.aqua}><Feather name="shopping-cart"/> {item.donhang}  </Text>
                        <Text style={styles.green}><Feather name="bar-chart"/> <Currency currency="vnd" value={item.sanluong} />  </Text>
                        <Text style={styles.purple}><Feather name="pie-chart"/> <Currency currency="vnd" value={item.doanhthu} /></Text>
                      </View>
                    </View>
                    <View>
                      <View style={styles.col}>
                        <Text style={styles.orange}><Feather name="user"/> {item.khcu}  </Text>
                        <Text style={styles.red}><Feather name="user-plus"/> {item.khmoi}  </Text>
                        <Text style={styles.pink}><Feather name="pocket"/> {item.dl}</Text>
                      </View>
                    </View>
                  </View>
                    
                )}
                keyExtractor={item => item.staff_id}
              />
            </List>
          </View>
          <View style={styles.center}>
            <Text style={[styles.name,styles.green]}>TOP 5 SẢN PHẨM BÁN CHẠY</Text>
          </View>
          <View>
            <List>
              <FlatList
                data={this.state.data.sale}
                renderItem={({ item }) => (
                  <View style={styles.boxList}>
                    <ListItem>
                      <Body>
                        <Text style={styles.name}>{item.tire_brand_name} {item.tire_size_number} {item.tire_pattern_name}   </Text>
                      </Body>
                      <Right>
                        <Text style={styles.green}><Feather name="bar-chart"/> <Currency currency="vnd" value={item.tong} />  </Text>
                      </Right>
                    </ListItem>
                  </View>
                    
                )}
                keyExtractor={item => item.tire_sale_id}
              />
            </List>
          </View>
        </View>
      </ScrollView>
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
  }
});