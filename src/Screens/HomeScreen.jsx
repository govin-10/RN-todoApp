import {View, Text, Button} from 'react-native';
import React, {useEffect} from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TaskScreen from './TaskScreen';
import ProfileScreen from './ProfileScreen';
import {SafeAreaView} from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Tab.Screen name="TaskScreen" component={TaskScreen} />
        <Tab.Screen name="ProfileScreen" component={ProfileScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default HomeScreen;
