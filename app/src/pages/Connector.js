import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ViewShot, {captureRef} from 'react-native-view-shot';
import PhotoEditor from "@baronha/react-native-photo-editor";

import styles from '../styles/styles';

export default function ConnectorPage({route, navigation}) {
  const [currentPhoto, setCurrentPhoto] = useState(route.params.uri);
  const [photoData, setPhotoData] = useState(route.params.photosArr);
  const [currentCoords, setCurrentCoords] = useState({
    latitude: route.params.latitude,
    longitude: route.params.longitude,
  });
  const [userID, setUserID] = useState('id');
  const [loading, setLoading] = useState(true);
  const flatList = useRef(null);
  const viewShot = useRef(null);
  const updatePhotos = async (key, value) => {
    try {
      console.log('updating store');
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      // saving error
    }
  };

  const getData = async key => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      console.log('jsonValue', jsonValue);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      // error reading value
    }
  };

  useEffect(async () => {
   try{
      setUserID(await getData('USER_ID'));
      setTimeout(() => makeViewShot(route.params.uri), 1300);
   }
   catch(e){
    console.log('smth went wrong',e);
   }
    return () => {
      console.log("This will be logged on unmount");
    }
  }, []);
  const makeViewShot = async uri => {
    try{
      const data = await captureRef(viewShot, {
        quality: 0.9,
        format: 'jpg',
      });
      let filteredData = photoData;
      filteredData[filteredData.length - 1].uri = data;
      setCurrentPhoto(data);
      setPhotoData(filteredData);
      updatePhotos('photos', filteredData);
      setLoading(false);
    }
    catch (e){
      console.log('smth went wrong');
      setLoading(false);
    }
    
  };
  const stickerLongClick = async() => {
    console.log(currentPhoto)
    const options = {
      path : currentPhoto,
    }
    const result = await PhotoEditor.open(options);
    setLoading(true);
    const newData = photoData.map((item)=>{
      if(item.uri===currentPhoto){
        item.uri = result
        return item
      }
      return item
    });
    setCurrentPhoto(result);
    setPhotoData(newData);
    updatePhotos('photos', newData);
    setLoading(false);
  };
  const changePhoto = ({uri, latitude, longitude}) => {
    setCurrentPhoto(uri);
    setCurrentCoords({latitude: latitude, longitude: longitude});
  };
  const deleteItemById = uri => {
    const filteredData = photoData.filter(item => item.uri !== uri);
    if (filteredData.length === 0) {
      updatePhotos('photos', filteredData);
      navigation.goBack();
    } else {
      setPhotoData(filteredData);
      changePhoto(filteredData[filteredData.length - 1]);
      updatePhotos('photos', filteredData);
      console.log('deleted');
    }
  };
  const renderItem = ({item}) => {
    return (
      <View>
        {item.uri === currentPhoto ? (
          <TouchableOpacity
            onPress={() => deleteItemById(item.uri)}
            style={{position: 'absolute', zIndex: 2, right: 0}}>
            <Image source={require('../assets/krest.png')} />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          onPress={() => changePhoto(item)}
          style={{
            width: 60,
            height: 60,
            marginHorizontal: 10,
            marginTop: 8,
            borderRadius: 1,
            borderWidth: item.uri === currentPhoto ? 2 : 0,
            borderColor: 'orange',
          }}>
          <Image
            source={{uri: item.uri}}
            resizeMode="cover"
            style={styles.image}></Image>
        </TouchableOpacity>
      </View>
    );
  };
  const preparePhotos = async () => {
    console.log('photosData', photoData, photoData.length);
    //await AsyncStorage.removeItem('photos')
    // clear.clearAppCache(() => {
    //   console.log("Кэш очищен")
    // })
    navigation.navigate('PreSendPage', {photoData: photoData, userID: userID, navigation: navigation});
  };
  return (
    <View style={styles.container}>
     
      <View
        style={styles.connectorContainer}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <View
            style={{
              position: 'absolute',
              bottom: 10,
              zIndex: 2,
              alignSelf: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
            <View style={styles.smallImagesContainer}>
              <FlatList
                ref={flatList}
                onContentSizeChange={() => flatList.current.scrollToEnd()}
                renderItem={renderItem}
                data={photoData}
                keyExtractor={item => item.uri}
                extraData={photoData}
                horizontal={true}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                //onLongPress={()=>stickerLongClick()}
                onPress={()=>stickerLongClick()}
                style={styles.editor}>
                <Image
                  style={{width: 80, height: 80,}}
                  source={require('../assets/edit-image.png')}></Image>
                  {/* <Image
                  style={{width: 80, height: 80}}
                  source={
                    currentSticker
                      ? require('../assets/arrow.png')
                      : require('../assets/circle.png')
                  }></Image> */}
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <TouchableOpacity
                  onPress={() => preparePhotos()}
                  style={styles.connectorButton}>
                  <Text style={{fontSize: 14}}>Сохранить фото</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={styles.connectorButton}>
                  <Text style={{fontSize: 14}}> Добавить фото </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
      <ViewShot ref={viewShot} options={{format: 'jpg', quality: 0.9}}>
        <Image
          source={{
            uri: currentPhoto,
          }}
          resizeMode="cover"
          style={styles.containerViewShot}></Image>

        {loading && (
          <View
            style={{
              position: 'absolute',
              top: 10,
              alignSelf: 'center',
            }}>
            <Text
              style={
                styles.textCoordsFields
              }>{`Широта: ${currentCoords.latitude}`}</Text>
            <Text
              style={
                styles.textCoordsFields
              }>{`Долгота: ${currentCoords.longitude}`}</Text>
          </View>
        )}
      </ViewShot>
    </View>
  );
}
