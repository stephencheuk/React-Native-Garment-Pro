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

import md5 from "react-native-md5";
import t from "tcomb-form-native";

import Toast from 'react-native-simple-toast';

import PushController from "./PushController";

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
  };

  componentDidMount() {
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

  _CheckLogin = () => {
    this.setState({refreshing: true});
    this._Login();
    this.setState({refreshing: false});
  };

  _updateText = (text, value) => {
    this.setState((state) => {
      newState = state;
      if(text == 'token'){ newState.login.token = value }
      if(text == 'host'){ newState.login.host = value }
      if(text == 'username'){ newState.login.username = value }
      if(text == 'password'){ newState.login.password = md5.hex_md5(value) }
      return newState;
    });
  };

  _LoginValue = () => {
    // init value for preset value for development
    if(!__DEV__) return {};
    return {
      host: '',
      username: '',
      password: '',
    }
  }

  _LoginOption = () => {
    return {
      stylesheet: require('./FormStyle'),
      fields: {
        host: {
          label: 'System URL',
          placeholder: '',
          returnKeyType: 'next',
          onSubmitEditing: () => {this.refs.form.getComponent('username').refs.input.focus()},
        },
        username: {
          returnKeyType: 'next',
          onSubmitEditing: () => {this.refs.form.getComponent('password').refs.input.focus()},
        },
        password: {
          secureTextEntry: true,
        },
      }
    };

  };

  _Login = () => {
    var navigator = this.props.navigator;
    // Toast.show('DONE');
    var value = this.refs.form.getValue();
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
    let postVal = {
      command: 'quickRegister',
      device: DeviceInfo.getSystemName(), // Android
      clientId: DeviceInfo.getModel() + '/' + DeviceInfo.getUniqueID(), // g3/357513060923035
      regId: this.state.token,
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

          setTimeout(() => {
            navigator.push({
              id: 'MainPage',
              name: 'Main'
            });
          }, __DEV__ ? 0 : 1000);

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
    return (
        <View style={{flex: 1}}>
        <ScrollView>
          <View style={{flex: 1, height: height*0.33}}>
            <View style={{flex: 1, backgroundColor: 'blue', alignItems: 'center', justifyContent: 'center'}}>

              <Text style={{color: 'lightblue' }}>BANNER</Text>
              <PushController
                onChangeToken={token => this.setState({token: token || ""})}
              />
              <Text style={styles.instructions}>Token: {this.state.token}</Text>

            </View>

          </View>
          <View style={{flex: 2, backgroundColor: 'lightblue', alignItems: 'center', height: height*0.67}}>
            <View style={{flex:1, width:width*0.8}}>

              <Text style={{color: 'black'}}> </Text>

              <LoginForm
                ref="form"
                type={LoginInfo}
                options={this._LoginOption}
                value={this._LoginValue()}
              />

              <TouchableHighlight style={styles.button} onPress={this._CheckLogin} underlayColor='#99d9f4'>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableHighlight>

            </View>
          </View>
        </ScrollView>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: 'white',
    marginBottom: 5,
  },
  button: {
    backgroundColor: "teal",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: "white",
    backgroundColor: "transparent",
  },
  textInput: {
    height: 50,
    flex: 1,
  }
});
