import React, { Component } from 'react';
import {StyleSheet, View, Text, FlatList, ActivityIndicator, Animated } from "react-native";
import {Thumbnail, List, ListItem, Container, Header, Tab, TabHeading, Tabs, ScrollableTab, Left, Right, Body, Item, Input, Icon, Button, CheckBox } from "native-base";
import Feather from 'react-native-vector-icons/Feather';
import {Currency} from '../Components/Currency';

export default class StockScreen extends Component {
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
    const url = `https://viet-trade.org/api/stock/?seed=${seed}&page=${page}&results=20`;
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
  orderClick(){
    let tireArr = [];
    this.state.data.map((item, index) => {
      if (item.isChecked==true) {
        tireArr.push({
            'tire_brand': item.tire_brand, 
            'tire_size': item.tire_size,
            'tire_pattern': item.tire_pattern,
            'tire_price': '',
        });
      }
    });
    this.props.navigation.navigate('OrderScreen', { tireArr: tireArr });
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
          </Header>
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
          <Tabs renderTabBar={()=> <ScrollableTab />}>
            <Tab heading={ <TabHeading><Feather name="layers" /> <Text> Tồn kho</Text></TabHeading>}>
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
                  <Button transparent onPress={() => this.orderClick()} >
                    <Feather size={25} name="shopping-cart" style={{color: 'white'}} />
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
                          <Text style={styles.price}>{item.tonkho}</Text>
                        </Button>
                      </Right>
                    </ListItem>
                  )}
                  keyExtractor={item => item.tire_id.toString()}
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
            <Tab heading={ <TabHeading><Feather name="clock" /> <Text> Đang về</Text></TabHeading>}>
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
                  <Button transparent onPress={() => this.orderClick()} >
                    <Feather size={25} name="shopping-cart" style={{color: 'white'}} />
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
                          <Text style={styles.price}>{item.dangve}</Text>
                        </Button>
                      </Right>
                    </ListItem>
                  )}
                  keyExtractor={item => item.tire_id}
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
            <Tab heading={ <TabHeading><Feather name="shopping-cart" /> <Text> Đặt hàng</Text></TabHeading>}>
              <List>
                <FlatList
                  data={this.state.data}
                  renderItem={({ item }) => (
                    <ListItem thumbnail>
                      <Left>
                        <Thumbnail square source={{ uri: 'https://viet-trade.org/public/images/upload/'+item.tire_pattern_name+'.jpg' }} />
                      </Left>
                      <Body>
                        <Text>{item.tire_brand_name}</Text>
                        <Text note numberOfLines={1}>{item.tire_size_number} {item.tire_pattern_name}</Text>
                      </Body>
                      <Right>
                        <Button transparent>
                          <Text style={styles.price}>{item.dathang}</Text>
                        </Button>
                      </Right>
                    </ListItem>
                  )}
                  keyExtractor={item => item.tire_id}
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
            <Tab heading={ <TabHeading><Feather name="box" /> <Text> Hàng order</Text></TabHeading>}>
              <List>
                <FlatList
                  data={this.state.data}
                  renderItem={({ item }) => (
                    <ListItem thumbnail>
                      <Left>
                        <Thumbnail square source={{ uri: 'https://viet-trade.org/public/images/upload/'+item.tire_pattern_name+'.jpg' }} />
                      </Left>
                      <Body>
                        <Text>{item.tire_brand_name}</Text>
                        <Text note numberOfLines={1}>{item.tire_size_number} {item.tire_pattern_name}</Text>
                      </Body>
                      <Right>
                        <Button transparent>
                          <Text style={styles.price}>{item.order}</Text>
                        </Button>
                      </Right>
                    </ListItem>
                  )}
                  keyExtractor={item => item.tire_id}
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
  }
});
