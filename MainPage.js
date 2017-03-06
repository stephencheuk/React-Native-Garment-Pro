import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Navigator,
  ToolbarAndroid,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  ListView,
  Image,
  StatusBar,
  RefreshControl,
  Alert,
  Dimensions
} from 'react-native';

import Header from './Header';

var DeviceInfo = require('react-native-device-info');
import RN_Storage from './storage';
import todoMessage from './TodoMessage';
import Toast from 'react-native-simple-toast';
import PushController from "./PushController";
import Auth from './Auth';

export default class MainPage extends Component {

  fetchData = () => {

    this.state.refreshing = true;

    RN_Storage.getAllDataForKey('loginState').then(users => {
        if(users.length > 0){
          todoMessage.get(users[0]).then(res => {
            res.json().then((jsdata) => {
              if(jsdata.result){
                this.setState({
                  ds: jsdata.data,
                  dataSource: this.state.dataSource.cloneWithRows(jsdata.data)
                })
              }
              this.setState({refreshing: false});
            }).catch((e) => {
              this.setState({refreshing: false});
            });
          });
        }else{
          this.setState({refreshing: false});
        }
    });
  }

  constructor(props){
    super(props);
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2
    });
    this.state = {
      refreshing: false,
      ds:[{'subject':''}],
      dataSource:null,
    }
    this.state.dataSource = ds.cloneWithRows(this.state.ds);
    this.fetchData();
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.fetchData();
    this.setState({refreshing: false});
  }

  _onActionSelected () {
    this._navigateToSettings()
  }

  _onTokenChange = (param) => {
    RN_Storage.getAllDataForKey('loginState').then(users => {
        if(users.length == 0){
          setTimeout(() => {
            navigator.push({
              id: 'LoginPage',
              name: 'Login'
            });
          }, 0);
        }else{

          users[0].regid = param.token;

          RN_Storage.save({
            key: 'loginState',
            id: '1001',
            rawData: users[0],
            expires: null
          });

          Auth.login(users[0]).then(
            (res) => {
              res.json().then(function(data) {
                if(data.result){
                  if(data.message) Toast.show(data.message);
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
          });
        }
    });
  }

  render() {

   var height = Dimensions.get('window').height;

    return (
      <View style={styles.top}>
        <PushController onChangeToken={token => this._onTokenChange(token)}/>
        <Header/>
        <ListView
          style={styles.TodoContainer, {'height': height - 95}}
          dataSource={this.state.dataSource}
          renderRow={(rowData) => createTodoListRow(rowData)}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.TodoSeparator} /> }
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        />
      </View>
    )

  }
}

var createTodoListRow = (data) => {
  let prod_1 = "";
  let prod_2 = "";
  if(data.prodcode){
    prod_1 = data.prodcode + ' / ' + data.qty + data.unit;
    prod_2 = data.prodname;
  }

  return(
    <TouchableOpacity key={data.messageid}>
      <View style={styles.TodoRow}>
        <Text style={styles.TodoTitle}>
          {data.subject}
        </Text>
        <Text style={styles.TodoDate}>
          {data.time}
        </Text>
        <Text style={styles.TodoData, styles.TodoData_Sender}>
          {data.sender}
        </Text>
        <Text style={styles.TodoData}>
          {data.transtype} {data.nos}
        </Text>
        <Text style={styles.TodoData}>
          {prod_1}
        </Text>
        <Text style={styles.TodoData}>
          {prod_2}
        </Text>
      </View>
    </TouchableOpacity>
    );
}

var styles = StyleSheet.create({
  toolbar: {
    height: 56,
    backgroundColor: '#4883da',
  },
  scrollView: {
    backgroundColor: '#6A85B1',
  },
  horizontalScrollView: {
    height: 120,
  },
  containerPage: {
    height: 50,
    width: 50,
    backgroundColor: '#527FE4',
    padding: 5,
  },
  text: {
    fontSize: 20,
    color: '#888888',
    left: 80,
    top: 20,
    height: 40,
  },
  button: {
    margin: 7,
    padding: 5,
    alignItems: 'center',
    backgroundColor: '#eaeaea',
    borderRadius: 3,
  },
  buttonContents: {
    flexDirection: 'row',
    width: 64,
    height: 64,
  },
  img: {
    width: 256,
    height: 256,
  },
  TodoContainer: {
  },
  TodoRow: {
    flexDirection: 'column',
    justifyContent: 'center',
    height: 88,
    padding: 10,
    backgroundColor: '#F6F6F6',
    position: 'relative',
  },
  TodoSeparator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  TodoTitle: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
  },
  TodoDate: {
    fontSize: 8,
    color: 'gray',
    position: 'absolute',
    right: 10,
    top: 3,
  },
  TodoData: {
    fontSize: 10,
    color: 'black',
  },
  TodoData_Sender: {
    fontSize: 14,
    color: 'black',
  },
  TodoData_NoData: {
    height: 0,
    opacity: 0
  },
});