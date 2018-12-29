import React from 'react';
import {TouchableHighlight,Image } from "react-native";
import { createBottomTabNavigator, createStackNavigator, createSwitchNavigator } from 'react-navigation';
import PurchaseOrderScreen from '../Screens/PurchaseOrderScreen';
import OrderScreen from '../Screens/OrderScreen';
import LoginScreen from '../Screens/LoginScreen';
import StockScreen from '../Screens/StockScreen';
import PriceScreen from '../Screens/PriceScreen';
import DetailOrderScreen from '../Screens/DetailOrderScreen';
import EditOrderScreen from '../Screens/EditOrderScreen';
import PrintOrderScreen from '../Screens/PrintOrderScreen';
import PrintQuotationScreen from '../Screens/PrintQuotationScreen';
import QRScanScreen from '../Screens/QRScanScreen';
import ViewOrderScreen from '../Screens/ViewOrderScreen';
import CustomerScreen from '../Screens/CustomerScreen';
import SaleReportScreen from '../Screens/SaleReportScreen';
import DebitScreen from '../Screens/DebitScreen';
import OrderCostScreen from '../Screens/OrderCostScreen';
import EditOrderCostScreen from '../Screens/EditOrderCostScreen';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Logo from '../../assets/images/logo-button.png';


const StackScreen1 = createStackNavigator({
  PriceScreen: {
    screen: PriceScreen,
    navigationOptions: ({navigation}) => ({
      title: 'Here is screen 1 !',
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: 'red'
      },
      headerLeft: <Feather name='chevron-left' size={30} onPress={ () => { navigation.goBack() }} />,
    })
  },
  OrderScreen: {
    screen: OrderScreen,
  },
  PrintQuotationScreen: {
    screen: PrintQuotationScreen,
    navigationOptions: ({navigation}) => ({
      title: 'In bảng báo giá',
    })
  }
},
{
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
});

const StackScreen2 = createStackNavigator({
  StockScreen: {
    screen: StockScreen,
    navigationOptions: () => ({
      title: 'Tồn kho',
    })
  },
  OrderScreen: {
    screen: OrderScreen,
  }
},
{
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
});
const StackScreen3 = createStackNavigator({
  OrderScreen: {
    screen: OrderScreen,
  }
},
{
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
});

const StackScreen4 = createStackNavigator({
  PurchaseOrderScreen: {
    screen: PurchaseOrderScreen,
    navigationOptions: () => ({
      headerVisible: false,
      header: () => null
    })
  },
  DetailOrderScreen: {
    screen: DetailOrderScreen,
    navigationOptions: ({navigation}) => ({
      title: 'Chi tiết đơn hàng',
      headerRight: <Feather color='white' name='plus' size={30} onPress={ () => { navigation.navigate('EditOrderScreen',{order: navigation.state.params.order}) }} />,
    })
  },
  EditOrderScreen: {
    screen: EditOrderScreen,
    navigationOptions: ({navigation}) => ({
      title: 'Cập nhật đơn hàng',
    })
  },
  PrintOrderScreen: {
    screen: PrintOrderScreen,
    navigationOptions: ({navigation}) => ({
      title: 'In đơn hàng',
    })
  },
  QRScanScreen: {
    screen: QRScanScreen,
    navigationOptions: ({navigation}) => ({
      title: 'Thông tin đơn hàng',
    })
  },
  ViewOrderScreen: {
    screen: ViewOrderScreen,
    navigationOptions: ({navigation}) => ({
      title: 'Thông tin đơn hàng',
    })
  },
  SaleReportScreen: {
    screen: SaleReportScreen,
    navigationOptions: ({navigation}) => ({
      title: 'Báo cáo bán hàng',
    })
  },
  CustomerScreen: {
    screen: CustomerScreen,
    navigationOptions: ({navigation}) => ({
      title: 'Thông tin khách hàng',
      headerRight: <FontAwesome style={{marginRight: 10}} color='white' name='history' size={25} onPress={ () => { navigation.navigate('DebitScreen',{customer: navigation.state.params.customer}) }} />,
    })
  },
  DebitScreen: {
    screen: DebitScreen,
    navigationOptions: ({navigation}) => ({
      title: 'Công nợ',
    })
  },
  OrderCostScreen: {
    screen: OrderCostScreen,
    navigationOptions: ({navigation}) => ({
      title: 'Chi phí đơn hàng',
      headerRight: <Feather color='white' name='plus' size={30} onPress={ () => { navigation.navigate('EditOrderCostScreen',{order: navigation.state.params.order}) }} />,
    })
  },
  EditOrderCostScreen: {
    screen: EditOrderCostScreen,
    navigationOptions: ({navigation}) => ({
      title: 'Chi phí đơn hàng',
    })
  },
},
{
  initialRouteName: 'PurchaseOrderScreen',
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#0070c9',
    },
    headerTintColor: '#fff',
  }
  
});
const StackScreen5 = createStackNavigator({
  LoginScreen: {
    screen: LoginScreen,
    navigationOptions: () => ({
    })
  }
},
{
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
});


export default TabNav = createBottomTabNavigator({
  PriceScreen: {
    screen: StackScreen1,
    navigationOptions: () => ({
      title: 'Bảng giá',
      tabBarIcon: ({ tintColor }) => {
        return (
          <Feather 
            name='search'
            size={24}
            color={tintColor}
          />
        );
      }
    })
  },
  StockScreen: {
    screen: StackScreen2,
    navigationOptions: () => ({
      title: 'Tồn kho',
      tabBarIcon: ({ tintColor }) => {
        return (
          <Feather 
            name='box'
            size={24}
            color={tintColor}
          />
        );
      }
    })
  },
  OrderScreen: {
    screen: StackScreen3,
    navigationOptions: ({navigation}) => ({
      title: '',
      tabBarIcon: ({ tintColor }) => {
        return (
          <TouchableHighlight
            onPress={ () => { navigation.navigate('OrderScreen') }}
            underlayColor="#2882D8"
            style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: '#fff',
                marginTop: 5
            }}
          >
            <Image source={Logo} style={{width:70,height:70}} />  
          </TouchableHighlight>
        );
      }
    })
  },
  PurchaseOrderScreen: {
    screen: StackScreen4,
    navigationOptions: () => ({
      title: 'Đơn hàng',
      tabBarIcon: ({ tintColor }) => {
        return (
          <Feather 
            name='shopping-cart'
            size={24}
            color={tintColor}
          />
        );
      }
    })
  },
  Logout: {
    screen: StackScreen5,
    navigationOptions: () => ({
      tabBarVisible: false,
      tabBarIcon: ({ tintColor }) => {
        return (
          <Feather 
            name='power'
            size={24}
            color={tintColor}
          />
        );
      }
    })
  }
}, {
  tabBarOptions: {
    showIcon: true,
    style: {
      backgroundColor: 'white'
    },
    inactiveTintColor: 'black',
    activeTintColor: '#0070c9'
  }
});


export const createRootNavigator = (signedIn = false) => {
  return createSwitchNavigator(
    {
      SignedIn: {
        screen: TabNav
      },
      SignedOut: {
        screen: StackScreen5
      }
    },
    {
      initialRouteName: signedIn ? "SignedIn" : "SignedOut"
    }
  );
};
