import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  Navigator,
  TouchableHighlight,
  TextInput,
  Dimensions,
  Button,
  Platform,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';

import RN_Storage from './storage';

import md5 from "react-native-md5";
import t from "tcomb-form-native";

import Toast from 'react-native-simple-toast';

import PushController from "./PushController";

import styles from "./LoginPageStyle";

import DeviceInfo from 'react-native-device-info';
var LoginForm = t.form.Form;

var LoginInfo = t.struct({
  host: t.String, // a required string
  username: t.String, // a required string
  password: t.String, // an optional string
});

export default class LoginPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      token: '',
    };
    this.FormValue = {
      host: '',
      username: '',
      password: '',
    };
    RN_Storage.getAllDataForKey('loginState').then(users => {
      if(users.length > 0){
        this.FormValue.host = users[0].host;
        this.FormValue.username = users[0].username;
        //this.FormValue.password = users[0].password;
      }
    });
  };

  componentDidMount() {
  }

  componentWillmount() {
  }

  componentWillUnmount() {
  }

  onPress = () => {
    // call getValue() to get the values of the form
    var value = this.refs.form.getValue();
    if (value) { // if validation fails, value will be null
      console.log(value); // value here is an instance of LoginInfo
    }
  };

  _ChangeForm = (value) => {
    this.FormValue = value;
  };

  _CheckLogin = () => {
    Toast.show('Awaiting Login');
    this._Login();
  };

  _LoginValue = () => {
    // init value for preset value for development
    if(!__DEV__) return {};
    return FormValue;
  }

  _LoginOption = () => {
    return {
      stylesheet: require('./FormStyle'),
      fields: {
        host: {
          label: 'System URL',
          placeholder: '',
          returnKeyType: 'next',
          blurOnSubmit: false,
          keyboardType: 'url',
          onSubmitEditing: () => {this.refs.form.getComponent('username').refs.input.focus()},
//          onEndEditing: () => {this.refs.form.getComponent('username').refs.input.focus()},
        },
        username: {
          returnKeyType: 'next',
          blurOnSubmit: false,
          onSubmitEditing: () => {this.refs.form.getComponent('password').refs.input.focus()},
//          onEndEditing: () => {this.refs.form.getComponent('password').refs.input.focus()},
        },
        password: {
          returnKeyType: 'send',
          blurOnSubmit: false,
          secureTextEntry: true,
          onSubmitEditing: () => {this._CheckLogin()},
          //onEndEditing: () => {this.refs.form.getComponent('password').refs.input.blur()},
//          onEndEditing: () => {alert(123)},
        },
      }
    };

  };

  _Login = () => {
    var navigator = this.props.navigator;
    // Toast.show('DONE');
    //var value = this.refs.form.getValue();
    var value = this.FormValue || {};
    if(value.host == '' || value.login == '' || value.password == '') return;
    let host = value.host;
    let ssl = false; // default http://
    if(host.indexOf('http://') == 0){
      host = host.replace('http://', '');
      ssl = false;
    }
    if(host.indexOf('https://') == 0){
      host = host.replace('https://', '');
      ssl = true;
    }
    let e = host.indexOf('/');
    if(e != -1){
      host = host.substring(0, e);
    }
    let ClientID = DeviceInfo.getModel() + '/' + DeviceInfo.getUniqueID();
    let token = this.state.token;
    let postVal = {
      command: 'quickRegister',
      device: DeviceInfo.getSystemName(), // Android
      clientId: ClientID, // g3/357513060923035
      regId: token,
      email: value.username,
      password: md5.hex_md5(value.password),
      notify: 1,
      tempid: (new Date()).getTime(),
      ret: 'json',
      servertype: 'fcm',
    };
    //Toast.show(JSON.stringify(postVal), Toast.LONG);
    let url = 'http' + (ssl ? 's':'') + '://'+ host + '/cgi-bin/index.cgi?Action=Mobile_API.run';
    console.log(url);
    console.log(postVal);
    fetch( url, {
      method: 'POST',
      headers: {
        'Accept': 'text/plain, */*; q=0.01',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: Object.keys(postVal).map((t)=>t+"="+postVal[t]).join('&')
    }).then((res) => {
//      console.log('post result');
//      console.log(res.text());
      if(res.status === 200 || res.status === 0){
        return Promise.resolve(res)
      }else{
        return Promise.reject(new Error(res.statusText))
      }
    }).then((res) => {

      res.json().then(function(data) {
        if(data.result){

          if(data.message) Toast.show(data.message);

          let loginState = {
            host: host,
            username: value.username,
            password: md5.hex_md5(value.password),
            clientid: ClientID,
            regid: token
          };

          //alert(JSON.stringify(Object.getOwnPropertyNames(RN_Storage)));
          //alert(JSON.stringify(RN_Storage.save));

          RN_Storage.save({
            key: 'loginState',  // Note: Do not use underscore("_") in key!
            id: '1001',   // Note: Do not use underscore("_") in id!    
            rawData: loginState,
            expires: null
          });

          RN_Storage.getAllDataForKey('loginState').then(users => {
              console.log('getAllDataForKey then => ', users);
          });

          setTimeout(() => {
            navigator.push({
              id: 'MainPage',
              name: 'Main'
            });
          }, 0);

        }else{
          if(data.error) Toast.show(data.error);
        }
      });

    }).catch((e) => {
      console.log(e.message);
    });
  }

  render(){
    var width = Dimensions.get('window').width;
    var height = Dimensions.get('window').height;

    console.log(this.FormValue);

    return (
        <ScrollView style={{backgroundColor: 'lightblue'}} keyboardShouldPersistTaps='handled'>
          <View style={{backgroundColor: 'blue', alignItems: 'center', justifyContent: 'center'}}>

            <Text style={{color: 'lightblue', padding: 60 }}>BANNER</Text>
            <PushController
              onChangeToken={token => this.setState({token: token || ""})}
            />

          </View>

          <View>
            <Text style={{color: 'black', padding: 10 }}></Text>
          </View>

          <View style={{paddingLeft: 40, paddingRight: 40}}>

            <View>
              <LoginForm
                ref="form"
                type={LoginInfo}
                options={this._LoginOption}
                value={this.FormValue}
                onChange={this._ChangeForm}
              />
            </View>

            <View>
              <TouchableHighlight style={styles.button} onPress={this._CheckLogin} underlayColor='#99d9f4'>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableHighlight>
            </View>

          </View>
        </ScrollView>
      );
  }
}
