import {View, Text, Button, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';

import {useRoute} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TaskScreen from './TaskScreen';
import ProfileScreen from './ProfileScreen';
import {SafeAreaView} from 'react-native-safe-area-context';

import PencilIcon from 'react-native-vector-icons/FontAwesome5';

const Tab = createBottomTabNavigator();

const taskPageName = 'TaskScreen';
const profilePageName = 'ProfileScreen';

const HomeScreen = () => {
  const route = useRoute();

  return (
    <SafeAreaView style={{flex: 1, position: 'relative'}}>
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            height: 60,
            elevation: 0,
          },
          tabBarActiveBackgroundColor: '#146C94',
          tabBarIcon: (focused, color, size) => {
            focused = focused.focused;
            let iconName;
            size = 25;
            let routerName = route.name;
            color = focused ? '#EEF5FF' : 'gray';
            if (routerName === taskPageName) {
              iconName = focused ? 'clipboard-list' : 'clipboard-check';
            } else if (route.name === profilePageName) {
              iconName = focused ? 'user' : 'user';
            }

            return <PencilIcon name={iconName} size={size} color={color} />;
          },
        })}>
        <Tab.Screen name="TaskScreen" component={TaskScreen} />
        <Tab.Screen name="ProfileScreen" component={ProfileScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  tabOptions: {
    borderTopColor: 'black',
    // paddingVertical: 10,
    // marginBottom: 8,
    // shadowColor: 'black',
  },
});
