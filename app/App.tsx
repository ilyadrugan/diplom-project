import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainPage from './src/pages/MainPage';
import StartPage from './src/pages/StartPage';
import Connector from './src/pages/Connector';
import PreSendPage from './src/pages/PreSendPage';
import { MainNavigation } from './src/main-navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
//import { LogBox } from 'react-native';
//LogBox.ignoreAllLogs();


const App = () => {
  // AsyncStorage.clear();
//   useEffect(() => {
//     // handles deep link when app is already open
//     Linking.addEventListener('url', evt => {
//       console.log('evt.url', evt.url);
//     });

//     // handles deep link when app is not already open
//     Linking.getInitialURL()
//       .then(url => console.log('Initial URL:', url))
//       .catch(console.warn);

//   return () => {
//     // clears listener when component unmounts
//     Linking.removeAllListeners('url');
//   };
// }, []);
  return (<>
    {/* <GestureHandlerRootView style={{ flex: 1 }}> */}
    <StatusBar/>
    <NavigationContainer>
       <SafeAreaProvider>
         
          <MainNavigation/>
      </SafeAreaProvider>
    </NavigationContainer>
    {/* </GestureHandlerRootView> */}
  </>);
};

export default App;
