/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';

import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import auth from '@react-native-firebase/auth';

import Login from './src/Screens/Login';
import SignUp from './src/Screens/SignUp';
import HomeScreen from './src/Screens/HomeScreen';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  const [user, setUser] = useState();

  function onAuthStateChanged(user: any) {
    setUser(user);
  }
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{headerShown: false}}>
        {user ? (
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
