import React, { FC, useEffect } from 'react';
import StartPage from './pages/StartPage';
import MainPage from './pages/MainPage';
import Connector from './pages/Connector';
import PreSendPage from './pages/PreSendPage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export const MainNavigation = () => {

  return (<>

    <Stack.Navigator  initialRouteName={'StartPage'}>
    {/* userStore.userInfo?.email_verified_at ? 'Main'
      : 'SubscribeEmailConfirm' */}

      <Stack.Screen
               name="StartPage"
               component={StartPage}
               options={{
                headerShown: false
               }}
             />
             <Stack.Screen name="MainPage" component={MainPage} options={{
                headerShown: false
               }}/>
             
             <Stack.Screen name="Connector" component={Connector} options={{
                headerShown: false
               }} />
             <Stack.Screen name="PreSendPage" component={PreSendPage} options={{
                headerShown: false
               }} />

  </Stack.Navigator>
  </>);
};
