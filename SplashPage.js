import React, { Component } from 'react';
import {
  Text,
  View,
  Navigator
} from 'react-native';

var DeviceInfo = require('react-native-device-info');
import RN_Storage from './storage';
import Auth from './Auth';
//import Auth from './FirebaseClient';
import Toast from 'react-native-simple-toast';

export default class SplashPage extends Component {
  componentWillMount() {
    this._autoLogin();
  }

  _autoLogin = () => {
    var navigator = this.props.navigator;

    RN_Storage.getAllDataForKey('loginState').then(users => {
        if(users.length == 0){
          setTimeout(() => {
            navigator.push({
              id: 'LoginPage',
              name: 'Login'
            });
          }, 0);
        }else{
          console.log('user exists');
          console.log(users);
          Auth.login(users[0]).then(
            (res) => {
              res.json().then(function(data) {
                if(data.result){
                  if(data.message) Toast.show(data.message);
                  setTimeout(() => {
                    navigator.push({
                      id: 'MainPage',
                      name: 'Main'
                    });
                  }, 0);
                }else{
                  if(data.error) Toast.show(data.error);
                  setTimeout(() => {
                    navigator.push({
                      id: 'LoginPage',
                      name: 'Login'
                    });
                  }, 0);
                }
              });
            }
          ).catch((e) => {
            alert(e.message);
            setTimeout(()=>this._autoLogin);
          });
        }
    });
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{color: 'black', fontSize: 32,}}>Loading ... / ICON HERE</Text>
      </View>
    );
  }
}
