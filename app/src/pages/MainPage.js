import React from 'react';
import {
  Text,
  View,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/styles';
import {RNCamera} from 'react-native-camera';
import Geolocation from '@react-native-community/geolocation';
import clear from 'react-native-clear-app-cache'

export default class MainPage extends React.Component {
  state = {
    lastPosition: {latitude: undefined, longitude: undefined},
    currentTime: undefined,
    flashMode: false,
    checkSettings: false,
  };
  _watchId = null;
  photosArr = [];
  showAlert = text => Alert.alert(text);
  getPos = async () => {
    Geolocation.getCurrentPosition(
      position => {
        const latitude = JSON.stringify(position.coords.latitude);
        const longitude = JSON.stringify(position.coords.longitude);

        const currentTime =
          new Date(
            parseInt(JSON.stringify(position.timestamp)),
          ).toLocaleDateString() +
          ' ' +
          new Date(
            parseInt(JSON.stringify(position.timestamp)),
          ).toLocaleTimeString();
        this.setState({
          lastPosition: {latitude, longitude},
          currentTime,
        });
      },
      err => {
        if (err.code === 2) {
          this.setState({
            checkSettings: true,
          });
        }
        this.setState({
          lastPosition: {
            latitude: undefined,
            longitude: undefined,
          },
        });
        this.getPos();
      },
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 5000},
    );
  };
  getAllPhotosFromStorage = async () => {
    const a = AsyncStorage.getItem('photos')
      .then(el =>
        el !== null ? (this.photosArr = JSON.parse(el)) : (this.photosArr = []),
      )
      .catch(e => {
        this.photosArr = [];
      });
    await a;
  };
  makeWatcher() {
    this._watchId = Geolocation.watchPosition(
      position => {
        const latitude = JSON.stringify(position.coords.latitude);
        const longitude = JSON.stringify(position.coords.longitude);

        const currentTime =
          new Date(
            parseInt(JSON.stringify(position.timestamp)),
          ).toLocaleDateString() +
          ' ' +
          new Date(
            parseInt(JSON.stringify(position.timestamp)),
          ).toLocaleTimeString();
        // console.log(
        //   position,
        //   currentTime,
        //   'REALTIME:',
        //   new Date().toLocaleTimeString(),
        // );
        this.setState({
          lastPosition: {latitude, longitude},
          currentTime,
        });
      },
      err => {
        console.log(err, 'WATCHER');
        if (err.code === 2) {
          this.setState({
            checkSettings: true,
          });
        }
        this.setState({
          lastPosition: {
            latitude: {latitude: undefined, longitude: undefined},
          },
        });
        // this.showAlert('Проверьте включена ли геолокация.');
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 0,
        interval: 5000,
        fastestInterval: 2000,
      },
    );
  }
  async componentDidMount() {
    try {
     
      await this.getAllPhotosFromStorage();
      await this.getPos();

      //setInterval(()=>this.getPos(),10000)
      if (this.state.lastPosition.longitude !== undefined) {
        this.makeWatcher();
      }
    } catch (e) {
      console.log(e);
    }
    return () => {
      console.log("This will be logged on unmount");
    }
  }
  componentWillUnmount() {
    Geolocation.clearWatch(this._watchId);
  }

  render() {
    //AsyncStorage.clear()
    const {navigation} = this.props;

    const storeData = async (key, value) => {
      try {
        this.photosArr.push(value);
        const jsonValue = JSON.stringify(this.photosArr);
        await AsyncStorage.setItem(key, jsonValue);
      } catch (e) {
        // saving error
      }
    };

    const flashHandler = () => {
      this.setState({flashMode: !this.state.flashMode});
    };

    const takePicture = async () => {
      try {
        await this.getPos();

        if (this.camera) {
          await this.getAllPhotosFromStorage();

          if (this.state.lastPosition.latitude !== undefined) {
            const options = {quality: 0.5, base64: true};
            const data = await this.camera.takePictureAsync(options);
            const obj = {
              uri: data.uri,
              latitude: this.state.lastPosition.latitude,
              longitude: this.state.lastPosition.longitude,
            };
            await storeData('photos', obj);
            navigation.navigate('Connector', {
              uri: data.uri,
              latitude: this.state.lastPosition.latitude,
              longitude: this.state.lastPosition.longitude,
              photosArr: this.photosArr,
              navigation: navigation,
            });
          }
        }
      } catch (e) {
        console.log(e);
      }
    };
    const onExit = async () =>{
      await AsyncStorage.clear();
      clear.clearAppCache(() => {
        console.log("Кэш очищен")
      })
      navigation.replace('StartPage')
    }
    return (
      <View style={styles.containerCamera}>
        <RNCamera
          style={styles.preview}
          ref={ref => {
            this.camera = ref;
          }}
          captureAudio={false}
          type={RNCamera.Constants.Type.back}
          flashMode={
            this.state.flashMode
              ? RNCamera.Constants.FlashMode.torch
              : RNCamera.Constants.FlashMode.off
          }
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}></RNCamera>
          <View style={{
            position: 'absolute',
            left: 0,
            alignSelf: 'center',
          }}>
            <TouchableOpacity onPress={onExit} style={styles.exit}>
            <Image
                style={{width: 40, height: 40}}
                source={require('../assets/exit.png')}/>
            </TouchableOpacity>
          </View>
        <View
          style={{
            position: 'absolute',
            top: 10,
            alignSelf: 'center',
          }}>
          {this.state.lastPosition.latitude === undefined ? (
            <View>
              {this.state.checkSettings ? (
                <Text style={styles.textCoordsFields}>
                  Проверьте настройки геолокации
                </Text>
              ) : (
                <Text style={styles.textCoordsFields}>
                  Определяем местоположение
                </Text>
              )}

              <ActivityIndicator size="large" />
            </View>
          ) : (
            <View>
              <Text
                style={
                  styles.textCoordsFields
                }>{`Широта: ${this.state.lastPosition.latitude}`}</Text>
              <Text
                style={
                  styles.textCoordsFields
                }>{`Долгота: ${this.state.lastPosition.longitude}`}</Text>
            </View>
          )}
        </View>

        <View style={styles.bottomButtons}>
          {this.state.lastPosition.latitude !== undefined ? (
            <TouchableOpacity
              onPress={() => flashHandler()}
              style={styles.flash}>
              <Image
                style={{width: 40, height: 40}}
                source={
                  !this.state.flashMode
                    ? require('../assets/flash-off.png')
                    : require('../assets/flash-on.png')
                }></Image>
            </TouchableOpacity>
          ) : null}
          {this.state.lastPosition.latitude !== undefined ? (
            <TouchableOpacity
              onPress={() => takePicture(this.camera)}
              style={styles.capture}>
              <Text style={{fontSize: 14}}> PHOTO </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}
