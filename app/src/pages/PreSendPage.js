import React, {useState, useEffect} from 'react';
import {
  TextInput,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import styles from '../styles/styles';
import {Picker} from '@react-native-picker/picker';
import urls from '../modules/urls';
import ModalPoup from '../components/ConfirmModal';
import RNFetchBlob from 'react-native-fetch-blob';
import AsyncStorage from '@react-native-async-storage/async-storage';
import clear from 'react-native-clear-app-cache'

export default function PreSendPage({route}) {
  const [visible, setVisible] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [selectedTypeName, setSelectedTypeName] = useState('');
  const [types, setTypes] = useState();
  const [userID, setUserID] = useState(route.params.userID);
  const [isLoading, setLoading] = useState(true);
  const [isLoading2, setLoading2] = useState(true);
  const [disable, setDisable] = useState(false)
  const [comment, setComment] = useState('');
  const [progressText, setProgressText] = useState('')
  const selectType = type_id => {
    console.log(types);
    setSelectedType(type_id);
    const name = types.reduce((acc, el) =>
      el.id == type_id ? (acc = el.type_name) : (acc = acc),
    );
    console.log(name, type_id);
    setSelectedTypeName(name);
  };

  const showAlert = text =>
    Alert.alert(text, '', [
      {},
      {},
      {
        text: 'OK',
        onPress: () => {
          route.params.navigation.goBack();
          route.params.navigation.goBack();
          route.params.navigation.replace('StartPage');
        },
      },
    ]);
    const showErrorAlert = err =>
    Alert.alert('Произошла ошибка',err, [
      {
        text: 'OK',
        // onPress: () => {
        //   route.params.navigation.goBack();
        //   route.params.navigation.goBack();
        //   route.params.navigation.replace('StartPage');
        // },
      },
    ]);

  const sendPhotos = (request_id, photo) => {
    return new Promise((resolve, reject) => {
      RNFetchBlob.fetch(
        'POST',
        urls.photos(),
        {
          'Content-Type': 'multipart/form-data',
          'X-Api-Key': 'key',
        },
        [
          {
            name: 'photo_url',
            filename: new Date().toString() + '_photo.jpg',
            type: 'image/jpg',
            data: RNFetchBlob.wrap(photo.uri),
          },
          {
            name: 'coord_long',
            data: photo.longitude,
          },
          {
            name: 'request_id',
            data: request_id.toString(),
          },
          {
            name: 'coord_lat',
            data: photo.latitude,
          },
        ],
      )
        .then(res => {
          console.log(res);
          resolve(res)
        })
        .catch(err => {
          console.log('Ошибка отправки фото', err);
        });
    }).catch(e => {
      showErrorAlert('Произошла ошибка сети, попробуйте ещё раз');
      setLoading2(false);
      setDisable(false)
      reject(e)
    });
  };

  const sendRequest = async () => {
    setProgressText('Отправляем запрос на сервер')
    setLoading2(true);
    setDisable(true)
    const formData = new FormData();
    formData.append('comment', comment);
    formData.append('type_id', selectedType);
    formData.append('user_login', userID);

    try {
      setVisible(false);
      const response = await fetch(urls.requests(), {
        method: 'POST',
        body: formData,
        headers: {'X-Api-Key': 'key', charset: 'utf-8', Connection: 'close'},
      });
      const result = await response.json();
      console.log('Успех:', result);
      //await AsyncStorage.removeItem('USER_ID');
      // route.params.navigation.goBack();
      //     route.params.navigation.goBack();
      //     route.params.navigation.replace('StartPage');
      setProgressText('Не закрывайте приложение до окончания отправки фото')
      Promise.all(
        route.params.photoData.map(photo => sendPhotos(result.id, photo)),
      )
        .then(async value => {
          console.log('Фото отправлены: ', value);
          showAlert('Фотографии успешно загружены');
          // setVisible(false);
          await AsyncStorage.removeItem('photos');
          //AsyncStorage.removeItem('USER_ID');
          clear.clearAppCache(() => {
            console.log("Кэш очищен")
          })
          setLoading2(false);
          setDisable(false)
        })
        .catch(err => {
         // setVisible(false);
          showErrorAlert('Произошла ошибка сети, попробуйте ещё раз');
          setLoading2(false);
          setDisable(false)
        });
    } catch (error) {
      console.error('Ошибка:', error);
      showErrorAlert('Попробуйте ещё раз или проверьте подключение к интернету');
      setLoading2(false);
      setDisable(false)
    }
    
  };
  const getTypes = () => {
    fetch(urls.types(), {
      method: 'GET',
      headers: {'X-Api-Key': 'key', charset: 'utf-8'},
    })
      .then(resp => resp.json())
      .then(data => {
        //console.log(data);
        setTypes(data.data);
        setSelectedTypeName(data.data[0].type_name);
        setSelectedType(data.data[0].id);
        setLoading(false);
        setLoading2(false);
      })
      .catch(error => console.log('Error is : ', error));
  };
  useEffect(() => {
    getTypes();
  }, [isLoading]);
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.containerSpaceAround}>
        {isLoading2 ? (
          <><ActivityIndicator size="large" />
          <Text style={{fontSize: 18, color:'black'}}>{progressText}</Text>
          </>
          
        ) : (
          <ModalPoup visible={visible}>
            <View>
              <View style={styles.header}>
                <Text style={styles.modalText}>
                  Сверьте данные перед отправкой
                </Text>
              </View>
              <View>
                <View style={styles.modalTextString}>
                  <Text style={styles.modalText}>Ваш ID:</Text>
                  <Text style={styles.modalText}>{userID}</Text>
                </View>
                <View style={styles.modalTextString}>
                  <Text style={styles.modalText}>Тип объявления:</Text>
                  <Text style={styles.modalText}>{selectedTypeName}</Text>
                </View>
                <View style={styles.modalTextString}>
                  <Text style={styles.modalText}>Комментарий:</Text>
                  <Text
                    style={[styles.modalText, styles.commentMaxWidth]}
                    ellipsizeMode="tail"
                    numberOfLines={1}>
                    {comment}
                  </Text>
                </View>
                <View style={styles.modalTextString}>
                  <Text style={styles.modalText}>Всего фото:</Text>
                  <Text style={styles.modalText}>
                    {route.params.photoData.length}
                  </Text>
                </View>
              </View>
              <View style={styles.modalBottomButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, {backgroundColor: 'red'}]}
                  onPress={() => setVisible(false)}>
                  <Text style={{color: 'white', fontSize: 18}}>Отмена</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, {backgroundColor: 'green'}]}
                  onPress={() => sendRequest()}>
                  <Text style={{color: 'white', fontSize: 18}}>Отправить</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ModalPoup>
        )}
        <View>
          <Text style={{fontSize: 18}}>Выберите тип</Text>
          <View style={styles.textInputStyle}>
            {isLoading ? (
              <ActivityIndicator size="large" />
            ) : (
              <Picker
                //   mode='dropdown'
                selectedValue={selectedType}
                onValueChange={(itemValue, itemIndex) => selectType(itemValue)}>
                {types.map((el, key) => (
                  <Picker.Item label={el.type_name} value={el.id} key={key} />
                ))}
              </Picker>
            )}
          </View>
        </View>
        <View>
          <Text style={{fontSize: 18}}>Комментарий</Text>
          <TextInput
            style={[
              styles.modalText,
              styles.textInputStyle,
              {textAlignVertical: 'top'},
            ]}
            multiline
            numberOfLines={7}
            onChangeText={text => setComment(text)}
          />
        </View>
        <TouchableOpacity
          onPress={() => setVisible(true)}
          disabled={disable}
          style={[
            styles.textInputStyle,
            {
              bottom: 10,
              width: 160,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}>
          <Text style={{fontSize: 18}}>Сохранить</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}
