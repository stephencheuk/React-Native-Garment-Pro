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

export default class MainPage extends Component {

  fetchData(){
    Alert.alert(
      'Alert Title',
      DeviceInfo.getUniqueID(),
      [
        {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]
    )
  }

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
    this.fetchData = this.fetchData.bind(this);
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.fetchData();
    this.setState({refreshing: false});
  }

  _navigateToSettings () {
    this.props.navigator.push({
      id: 'SettingPage',
      name: 'Setting',
      SceneConfigs: Navigator.SceneConfigs.FloatFromRight
    });
  }

  _onActionSelected () {
    this._navigateToSettings()
  }

  render() {

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var dataSource = ds.cloneWithRows(['row 1', 'row 2','row 3','row 4','row 5','row 6','row 7','row 8','row 8','row 8','row 8','row 8']);

    return (
      <View style={styles.top}>
        <Header/>
        <ListView
          style={styles.TodoContainer}
          dataSource={dataSource}
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

class Todo extends Component{
  render(){
    return (
      <View style={styles.TodoRow}>
        <Text style={styles.TodoTitle}>{this.props.data.title}</Text>
        <Text style={styles.TodoDate}>{this.props.data.datetime}</Text>
      </View>
      );
  }
}

var TODOS = [
  {title: 'New Enquiry 1', datetime: '1/2/2017 20:16' },
  {title: 'New Enquiry 2', datetime: '2/2/2017 20:16' },
  {title: 'New Enquiry 3', datetime: '3/2/2017 20:16' },
]

var createTodoRow = (rec, i) => <Todo key={i} data={rec} />;
var createTodoListRow = (data) => {
  return(
    <TouchableOpacity>
      <View style={styles.TodoRow}>
        <Text style={styles.TodoTitle}>
          {data + '我是测试行号哦~'}
        </Text>
        <Text style={styles.TodoDate}>
          {data + '我是测试行号哦~'}
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
    height: 64,
    padding: 10,
    backgroundColor: '#F6F6F6',
  },
  TodoSeparator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  TodoTitle: {
    fontSize: 16,
    color: 'blue',
    flex:1,
  },
  TodoDate: {
    fontSize: 8,
    color: 'gray',
    textAlign: 'right',
  },
});