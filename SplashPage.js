import React, { Component } from 'react';
import {
  Text,
  View,
  Navigator
} from 'react-native';

var DeviceInfo = require('react-native-device-info');

export default class SplashPage extends Component {
  componentWillMount() {
    var navigator = this.props.navigator;
    var LoggedIn = false;
    if(LoggedIn){
      setTimeout(() => {
        navigator.push({
          id: 'MainPage',
          name: 'Main'
        });
      }, __DEV__ ? 0 : 1000);
    }else{
      setTimeout(() => {
        navigator.push({
          id: 'LoginPage',
          name: 'Login'
        });
      }, __DEV__ ? 0 : 1000);
    }
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{color: 'black', fontSize: 32,}}>Loading ... / ICON HERE</Text>
      </View>
    );
  }
}
