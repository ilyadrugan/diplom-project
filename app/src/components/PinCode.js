import React, {useState} from 'react';
import CodeInput from 'react-native-confirmation-code-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Text, View, PermissionsAndroid} from 'react-native';

export default function PinCode({navigation, usersLogin}) {
  const [isWrongCode, setIsWrongCode] = useState(false);
  const getPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'App Location Permission',
          message: 'App needs access to your Location ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the app');
        navigation.replace('MainPage');
      } else {
        getPermission();
      }
    } catch (err) {
      getPermission();
    }
  };
  const onFinishCheckingCode = async code => {
    if (usersLogin.indexOf(parseInt(code)) !== -1) {
      try {
        console.log('storing ID');
        await AsyncStorage.setItem('USER_ID', code);
      } catch (e) {
        console.log('error: ', e);
      }
      getPermission();
    } else {
      setIsWrongCode(true);
      setTimeout(() => setIsWrongCode(false), 3000);
    }
  };
  return (
    <View style={{top: '30%', alignItems: 'center'}}>
      {isWrongCode ? (
        <Text style={{color: 'red', fontSize: 16}}>
          Такого идентификатора нет в базе
        </Text>
      ) : (
        <Text style={{fontSize: 16}}>Введите ваш идентификатор</Text>
      )}
      <CodeInput
        keyboardType="numeric"
        codeLength={5}
        className={'border-circle'}
        compareWithCode="12345"
        autoFocus={true}
        activeColor="rgba(0,0,0, 1)"
        inactiveColor="#808080"
        codeInputStyle={{color: 'black', borderWidth: 1.5}}
        onFulfill={(isValid, code) => onFinishCheckingCode(code)}
      />
    </View>
  );
}
