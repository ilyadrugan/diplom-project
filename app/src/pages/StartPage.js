import React, {useState, useEffect} from 'react';
import {
  Alert,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';
import PinCode from '../components/PinCode';
import styles from '../styles/styles';
import urls from '../modules/urls';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StartPage({navigation}) {
  const [users, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const showErrorAlert = err =>
    Alert.alert(err, '', [
      {},
      {},
      {
        text: 'OK',
      },
    ]);
  const getUsers = () => {
    fetch(urls.users(), {
      method: 'GET',
      headers: {'X-Api-Key': 'key'},
    })
      .then(resp => resp.json())
      .then(data => {
        console.log(data);
        const logins = data.data.map(el => el.login);
        console.log(logins);
        setUsers(data.data);
        setLoading(false);
      })
      .catch(error => {
        console.log('Error is : ', error);
        showErrorAlert('Произошла ошибка сети, проверьте подключение к интернету', error)
        setLoading(false);
      });
  };
  const getPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        getPermission();
        console.log('Camera permission denied');
      }
    } catch (err) {
      getPermission();
      // Alert.alert(err);
      console.log(err);
    }
  };
  const getUserID = async () => {
    try {
      const value = await AsyncStorage.getItem('USER_ID');
      if (value !== null) {
        console.log('Hello, Mr. ', value);
        navigation.replace('MainPage');
      }
      
      getPermission();
      getUsers();
      return null;
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    getUserID();
  });

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.containerCenter}>
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <PinCode
            navigation={navigation}
            usersLogin={users.map(el => el.login)}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
