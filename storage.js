
import {AsyncStorage} from 'react-native';
import Storage from 'react-native-storage';

var storage = 1;

var storage2 = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: null,
  enableCache: true,
  sync : {}
});

module.exports = storage2;