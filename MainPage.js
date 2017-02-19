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
  Alert
} from 'react-native';

import Header from './Header';

var DeviceInfo = require('react-native-device-info');
import RN_Storage from './storage';
import todoMessage from './TodoMessage';

export default class MainPage extends Component {

  fetchData = () => {

    this.state.refreshing = true;

    RN_Storage.getAllDataForKey('loginState').then(users => {
        if(users.length > 0){
          todoMessage.get(users[0]).then(res => {
            res.json().then((jsdata) => {
              console.log(jsdata)
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

  render() {

    return (
      <View style={styles.top}>
        <Header/>
        <ListView
          style={styles.TodoContainer}
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

var toolbarActions = [
  {
    title: 'Settings',
    icon: require('./images/settings.png'),
    show: 'always'
  },
];

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