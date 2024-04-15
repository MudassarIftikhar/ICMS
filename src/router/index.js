import React from 'react';
import {StatusBar} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import WelcomeScreen from '../screens/welcomeScreen';
import Login from '../screens/login';
import Signup from '../screens/signup';
import Dashboard from '../screens/dashboard';
import MyTabs from './bottomTab';
import UserBottomTab from './userBottomTab';
import ViewComplaint from '../screens/viewComplaint';

const Stack = createStackNavigator();
const Router = () => {
  return (
    <NavigationContainer independent={true}>
      <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="WelcomeScreen">
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="BottomTab" component={MyTabs} />
        <Stack.Screen name="UserBottomTab" component={UserBottomTab} />
        <Stack.Screen name="ViewComplaint" component={ViewComplaint} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
