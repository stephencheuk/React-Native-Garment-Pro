import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

//import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
                                                                                                                                                                                                    
const Header = () => (
  <View style={styles.top}>
    <Text style={styles.logo}>Todo</Text>
    <View style={styles.icons}>
      <FontAwesome name='filter' size={30} color="white" style={{paddingRight: 15, paddingLeft: 15}}/>
      <FontAwesome name='gear' size={30} color="white" style={{paddingRight: 15, paddingLeft: 15}}/>
    </View>
  </View>
  );

export default Header;

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    backgroundColor: '#075e54',
    borderColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  logo: {
    fontSize: 23,
    color: '#fff',
    margin: 10,
    fontWeight: '500',
  },
  icons: {
    flexDirection: 'row',
  },
});