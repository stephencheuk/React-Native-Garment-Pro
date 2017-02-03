import React, { Component } from 'react';
import {
  Text,
  View,
  Navigator,
  TouchableHighlight,
  TextInput,
  Dimensions,
  Button,
  Platform,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import md5 from "react-native-md5";
//import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';
//
//import PushController from "./PushController";
//import firebaseClient from  "./FirebaseClient";

var DeviceInfo = require('react-native-device-info');

export default class LoginPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      token: '',
      login: {}
    };
  };

  componentDidMount() {
  }

  componentWillUnmount() {
  }

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

 _Login = () => {
    host = this.state.host;
    if(host.indexOf('http://') != 0 && host.indexOf('https://') != 0 ){
      host = 'http://' + host
    }
    postVal = {
      command: 'quickRegister',
      device: DeviceInfo.getSystemName(), // Android
      clientId: DeviceInfo.getModel() + '/' + DeviceInfo.getUniqueID(), // g3/357513060923035
      regId: this.state.login.token,
      email: this.state.login.username,
      password: this.state.login.password,
      notify: 1,
      tempid: new Date().getTime(),
    };
    console.log(postVal);
    fetch(host + '/system/cgi-bin/index.cgi?Action=Mobile_API.run', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postVal)
    });
  }

  render(){
    var width = Dimensions.get('window').width;
    return (
        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            <View style={{flex: 1, backgroundColor: 'blue', alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{color: 'lightblue' }}>BANNER</Text>
            </View>
          </View>
          <View style={{flex: 2, backgroundColor: 'lightblue', alignItems: 'center'}}>
            <View style={{flex:1}}>

              <Text style={{color: 'black'}}> </Text>

              <TextInput placeholder='System URL' onBlur={(event) => this.updateText('host', event.nativeEvent.text)} style={{width:width*0.8, height:50}}></TextInput>
              <TextInput placeholder='Username' onBlur={(event) => this.updateText('username', event.nativeEvent.text)} style={{width:width*0.8, height:50}}></TextInput>
              <TextInput placeholder='Password' onBlur={(event) => this.updateText('password', event.nativeEvent.text)} style={{width:width*0.8, height:50}}></TextInput>

              <Text style={{color: 'black'}}> </Text>

              <Button
                onPress={this._CheckLogin}
                title="Login"
                color="#841584"
                accessibilityLabel="Login"
              />
            </View>
          </View>
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
    color: '#333333',
    marginBottom: 5,
  },
  button: {
    backgroundColor: "teal",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 15,
    borderRadius: 10
  },
  buttonText: {
    color: "white",
    backgroundColor: "transparent"
  },
});


//import React, { Component } from 'react';
//import {
//  Text,
//  View,
//  Navigator,
//  TouchableHighlight,
//  TextInput,
//  Dimensions,
//  Button,
//  Platform,
//  StyleSheet,
//  TouchableOpacity
//} from 'react-native';
//
//import md5 from "react-native-md5";
////import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';
////
////import PushController from "./PushController";
////import firebaseClient from  "./FirebaseClient";
//
//var DeviceInfo = require('react-native-device-info');
//
//export default class LoginPage extends Component {
//
//  constructor(props) {
//    super(props);
//    this.state = {
//      refreshing: false,
//      token: '',
//      login: {}
//    };
//    this._Login = this._Login.bind(this);
//  };
//
//  componentDidMount() {
//  }
//
//  _ReRegNotify = () => {
//    this.setState({refreshing: true});
//    //this.refreshTokenListener();
//    this.setState({refreshing: false});
//  }
//
////  _RegNotify = () => {
////    console.log('start _RegNotify');
////    if(Platform.OS ==='ios'){
////      FCM.requestPermissions(); // for iOS
////    }
////    console.log('1');
////    FCM.getFCMToken().then(token => {
////      console.log('token => ', token);
////      this._updateText('token', token);
////      // store fcm token in your server
////    });
////    console.log('2');
////    this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
////      console.log('Notification Hit');
////      // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
////      if(notif.local_notification){
////        //this is a local notification
////      }
////      if(notif.opened_from_tray){
////        //app is open/resumed because user clicked banner
////      }
////      await someAsyncCall();
////
////      if(Platform.OS ==='ios'){
////        //optional
////        //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link. 
////        //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
////        //notif._notificationType is available for iOS platfrom
////        switch(notif._notificationType){
////          case NotificationType.Remote:
////            notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
////            break;
////          case NotificationType.NotificationResponse:
////            notif.finish();
////            break;
////          case NotificationType.WillPresent:
////            notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
////            break;
////        }
////      }
////    });
////    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
////      console.log('Refresh Token');
////      console.log(token)
////      // fcm token may not be available on first load, catch it here
////    });
////  };
//
//  componentWillUnmount() {
//    // stop listening for events
//    //this.notificationListener.remove();
//    //this.refreshTokenListener.remove();
//  }
//
////  otherMethods(){
////
////    FCM.subscribeToTopic('/topics/foo-bar');
////    FCM.unsubscribeFromTopic('/topics/foo-bar');
////    FCM.getInitialNotification().then(notif=>console.log(notif));
////    FCM.presentLocalNotification({
////      id: "UNIQ_ID_STRING",                               // (optional for instant notification)
////      title: "My Notification Title",                     // as FCM payload
////      body: "My Notification Message",                    // as FCM payload (required)
////      sound: "default",                                   // as FCM payload
////      priority: "high",                                   // as FCM payload
////      click_action: "ACTION",                             // as FCM payload
////      badge: 10,                                          // as FCM payload IOS only, set 0 to clear badges
////      number: 10,                                         // Android only
////      ticker: "My Notification Ticker",                   // Android only
////      auto_cancel: true,                                  // Android only (default true)
////      large_icon: "ic_launcher",                           // Android only
////      icon: "ic_launcher",                                // as FCM payload, you can relace this with custom icon you put in mipmap
////      big_text: "Show when notification is expanded",     // Android only
////      sub_text: "This is a subText",                      // Android only
////      color: "red",                                       // Android only
////      vibrate: 300,                                       // Android only default: 300, no vibration if you pass null
////      tag: 'some_tag',                                    // Android only
////      group: "group",                                     // Android only
////      my_custom_data:'my_custom_field_value',             // extra data you want to throw
////      lights: true,                                       // Android only, LED blinking (default false)
////      show_in_foreground                                  // notification when app is in foreground (local & remote)
////    });
////
////    FCM.scheduleLocalNotification({
////      fire_date: new Date().getTime(),      //RN's converter is used, accept epoch time and whatever that converter supports
////      id: "UNIQ_ID_STRING",    //REQUIRED! this is what you use to lookup and delete notification. In android notification with same ID will override each other
////      body: "from future past",
////      repeat_interval: "week" //day, hour
////    })
////
////    FCM.getScheduledLocalNotifications().then(notif=>console.log(notif));
////
////    //these clears notification from notification center/tray
////    FCM.removeAllDeliveredNotifications()
////    FCM.removeDeliveredNotification("UNIQ_ID_STRING")
////
////    //these removes future local notifications
////    FCM.cancelAllLocalNotifications()
////    FCM.cancelLocalNotification("UNIQ_ID_STRING")
////
////    FCM.setBadgeNumber(1);                                       // iOS only and there's no way to set it in Android, yet.
////    FCM.getBadgeNumber().then(number=>console.log(number));     // iOS only and there's no way to get it in Android, yet.
////    FCM.send('984XXXXXXXXX', {
////      my_custom_data_1: 'my_custom_field_value_1',
////      my_custom_data_2: 'my_custom_field_value_2'
////    });
////  }
//
//  _CheckLogin = () => {
//    this.setState({refreshing: true});
//    this._Login();
//    this.setState({refreshing: false});
//  };
//
////   var navigator = this.props.navigator;
////    navigator.push({
////      id: 'MainPage',
////      name: 'Main',
////      SceneConfigs: Navigator.SceneConfigs.FloatFromRight
////    });
//
//  _updateText = (text, value) => {
//    this.setState((state) => {
//      newState = state;
//      if(text == 'token'){ newState.login.token = value }
//      if(text == 'host'){ newState.login.host = value }
//      if(text == 'username'){ newState.login.username = value }
//      if(text == 'password'){ newState.login.password = md5.hex_md5(value) }
//      return newState;
//    });
//  };
//
// _Login(){
//    host = this.state.host;
//    if(host.indexOf('http://') != 0 && host.indexOf('https://') != 0 ){
//      host = 'http://' + host
//    }
//    postVal = {
//      command: 'quickRegister',
//      device: DeviceInfo.getSystemName(), // Android
//      clientId: DeviceInfo.getModel() + '/' + DeviceInfo.getUniqueID(), // g3/357513060923035
//      regId: this.state.login.token,
//      email: this.state.login.username,
//      password: this.state.login.password,
//      notify: 1,
//      tempid: new Date().getTime(),
//    };
//    console.log(postVal);
//    fetch(host + '/system/cgi-bin/index.cgi?Action=Mobile_API.run', {
//      method: 'POST',
//      headers: {
//        'Accept': 'application/json',
//        'Content-Type': 'application/json',
//      },
//      body: JSON.stringify(postVal)
//    });
//  }
//
////  componentWillMount() {
//////    if(__DEV__){
//////      setTimeout(() => {
//////        var navigator = this.props.navigator;
//////        navigator.push({
//////          id: 'MainPage',
//////          name: 'Main'
//////        });
//////      }, 1000);
//////    }
////  }
//
////  render() {
////    let { token } = this.state;
////    return (
////      <View style={styles.container}>
////        <PushController
////          onChangeToken={token => this.setState({token: token || ""})}
////        />
////        <Text style={styles.welcome}>
////          Welcome to Simple Fcm Client!
////        </Text>
////
////        <Text style={styles.instructions}>
////          Token: {this.state.token}
////        </Text>
////
////        <TouchableOpacity onPress={() => firebaseClient.sendNotification(token)} style={styles.button}>
////          <Text style={styles.buttonText}>Send Notification</Text>
////        </TouchableOpacity>
////
////        <TouchableOpacity onPress={() => firebaseClient.sendData(token)} style={styles.button}>
////          <Text style={styles.buttonText}>Send Data</Text>
////        </TouchableOpacity>
////
////        <TouchableOpacity onPress={() => firebaseClient.sendNotificationWithData(token)} style={styles.button}>
////          <Text style={styles.buttonText}>Send Notification With Data</Text>
////        </TouchableOpacity>
////      </View>
////    );
////  }
//
//  render() {
//    var width = Dimensions.get('window').width;
//    return (
//      <View style={{flex: 1}}>
//        <View style={{flex: 1}}>
//          <View style={{flex: 1, backgroundColor: 'blue', alignItems: 'center', justifyContent: 'center'}}>
//            <Text style={{color: 'lightblue' }}>BANNER</Text>
//          </View>
//        </View>
//        <View style={{flex: 2, backgroundColor: 'lightblue', alignItems: 'center'}}>
//          <View style={{flex:1}}>
//
//            <Text style={{color: 'black'}}> </Text>
//
//            <TextInput placeholder='Server Host' onBlur={(event) => this.updateText('host', event.nativeEvent.text)} style={{width:width*0.8, height:50}}></TextInput>
//            <TextInput placeholder='Username' onBlur={(event) => this.updateText('username', event.nativeEvent.text)} style={{width:width*0.8, height:50}}></TextInput>
//            <TextInput placeholder='Password' onBlur={(event) => this.updateText('password', event.nativeEvent.text)} style={{width:width*0.8, height:50}}></TextInput>
//
//            <Text style={{color: 'black'}}> </Text>
//
//            <Button
//              onPress={this._CheckLogin}
//              title="Login"
//              color="#841584"
//              accessibilityLabel="Login"
//            />
//          </View>
//        </View>
//      </View>
//
////            <Button
////              onPress={this._ReRegNotify}
////              title="Rereg Notify"
////              color="#841584"
////              accessibilityLabel="Rereg Notify"
////            />
//
////            <Button
////              onPress={this._RegNotify}
////              title="Reg Notify"
////              color="#841584"
////              accessibilityLabel="Reg Notify"
////            />
////      <View style={{flex: 1, backgroundColor: 'blue', alignItems: 'center', justifyContent: 'center'}}>
////        <TouchableHighlight style={{backgroundColor: 'yellow', padding: 10}}
////            onPress={this.gotoPersonPage.bind(this)}>
////          <Text style={{backgroundColor: 'yellow', color: 'green'}}>下一页</Text>
////        </TouchableHighlight>
////      </View>
////      <View style={{flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center'}}>
////        <Text style={{color: 'black', fontSize: 32,}}>Login</Text>
////      </View>
//    );
//  }
//}
//
//const styles = StyleSheet.create({
//  container: {
//    flex: 1,
//    justifyContent: 'center',
//    alignItems: 'center',
//    backgroundColor: '#F5FCFF',
//  },
//  welcome: {
//    fontSize: 20,
//    textAlign: 'center',
//    margin: 10,
//  },
//  instructions: {
//    textAlign: 'center',
//    color: '#333333',
//    marginBottom: 5,
//  },
//  button: {
//    backgroundColor: "teal",
//    paddingHorizontal: 20,
//    paddingVertical: 10,
//    marginVertical: 15,
//    borderRadius: 10
//  },
//  buttonText: {
//    color: "white",
//    backgroundColor: "transparent"
//  },
//});
//
////Device Unique ID d6c8e1b2b2c03de5
////Device Manufacturer LGE
////Device Brand lge
////Device Model LG-D855
////Device ID MSM8974
////System Name Android
////System Version 6.0
////Bundle ID com.garmentpro
////Build Number 1
////App Version 1.0
////App Version (Readable) 1.0.1
////Device Name Unknown
////User Agent Dalvik/2.1.0 (Linux; U; Android 6.0; LG-D855 Build/MRA58K)
////Device Locale zh-HK
////Device Country HK
////Timezone Asia/Hong_Kong
////App Instance ID dh3pdL3kWco
////App is running in emulator false
////App is running on a tablet false