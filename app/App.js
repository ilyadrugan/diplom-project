import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainPage from './src/pages/MainPage';
import StartPage from './src/pages/StartPage';
import Connector from './src/pages/Connector';
import PreSendPage from './src/pages/PreSendPage';
//import { LogBox } from 'react-native';
//LogBox.ignoreAllLogs();
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar />
      <Stack.Navigator
        initialRouteName="StartPage"
        screenOptions={{
          headerStyle: {backgroundColor: '#FFF1E0'},
          headerShown: false,
          title: '',
          cardStyle: {backgroundColor: 'transparent'},
          cardOverlayEnabled: true,
          cardStyleInterpolator: ({current: {progress}}) => ({
            cardStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 0.5, 0.9, 1],
                outputRange: [0, 0.25, 0.7, 1],
              }),
            },
            overlayStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5],
                extrapolate: 'clamp',
              }),
            },
          }),
        }}
        presentation="modal">
          <Stack.Screen
          name="StartPage"
          component={StartPage}
        />
        <Stack.Screen name="MainPage" component={MainPage} />
        
        <Stack.Screen name="Connector" component={Connector} />
        <Stack.Screen name="PreSendPage" component={PreSendPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
