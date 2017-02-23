import React from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';

const Footer = () => (
  <View style={styles.top}> </View>
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
  }
});