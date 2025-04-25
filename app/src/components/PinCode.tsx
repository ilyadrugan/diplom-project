import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Text, View, PermissionsAndroid, StyleSheet} from 'react-native';
import { CodeField, useBlurOnFulfill, useClearByFocusCell, Cursor } from 'react-native-confirmation-code-field';
import ConfirmationCodeInput from './codeInput/components/ConfirmationCodeInput';

export default function PinCode({navigation, usersLogin}) {
  const [isWrongCode, setIsWrongCode] = useState(false);
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: 6});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
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
  const onFinishCheckingCode = async (code: string) => {
    console.log('onFinishCheckingCode', code);
    if (usersLogin.indexOf(parseInt(code)) !== -1) {
      try {
        console.log('storing ID');
        await AsyncStorage.setItem('USER_ID', code);
      } catch (e) {
        console.log('error: ', e);
      }
      await getPermission();
    } else {
      setIsWrongCode(true);
      setTimeout(() => setIsWrongCode(false), 3000);
    }
  };
  return (
    <View style={{marginTop: 120, alignItems:'center'}}>
      {isWrongCode ? (
        <Text style={{color: 'red', fontSize: 16}}>
          Такого идентификатора нет в базе
        </Text>
      ) : (
        <Text style={{fontSize: 16}}>Введите ваш идентификатор</Text>
      )}
      <ConfirmationCodeInput
        // keyboardType="num-pad"
        codeLength={5}
        className={'border-circle'}
        compareWithCode="12345"
        autoFocus={true}
        activeColor="#808080"
        inactiveColor="#808080"
        codeInputStyle={{color: 'black', borderWidth: 1.5}}
        onFulfill={onFinishCheckingCode}
      />
      {/* <CodeField
        ref={ref}
        {...props}
        // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
        value={value}
        onChangeText={(text)=>{
          console.log('text', text)
          setValue(text)}}
        cellCount={5}
        // rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        // textContentType="oneTimeCode"
        // autoComplete={Platform.select({ android: 'sms-otp', default: 'one-time-code' })}
        testID="my-code-input"
        renderCell={({index, symbol, isFocused}) => (
          <Text
            key={index}
            style={[styles.cell]}
            onLayout={getCellOnLayoutHandler(index)}>
            {symbol || (isFocused ? <Cursor/> : null)}
          </Text>
        )}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, padding: 20},
  title: {textAlign: 'center', fontSize: 30},
  // codeFieldRoot: {marginTop: 20},
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: '#00000030',
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#000',
  },
});
