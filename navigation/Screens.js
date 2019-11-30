import React from 'react';
import {createBottomTabNavigator} from 'react-navigation-tabs';


import {theme, mocks, time} from '../constants';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomTabBar from '../components/CustomTabBar';
import Overview from '../screens/Overview';
import OneVerse from '../screens/OneVerse';
import Streak from '../screens/Streak';
import Fetch from '../screens/Fetch';


export default createBottomTabNavigator(
  {
    Overview: {
      screen: Overview,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({tintColor}) => (
          <Icon name="home" size={25} color={tintColor} />
        ),
      },
    },
    Streak: {
      screen: Streak,
      navigationOptions: {
        tabBarLabel: 'Streak',
        tabBarIcon: ({tintColor}) => (
          <Icon name="bolt" size={25} color={tintColor} />
        ),
      },
    },
    Pray: {
      screen: Fetch,
      navigationOptions: {
        tabBarLabel: 'Pray',
        tabBarIcon: ({tintColor}) => (
          <Icon name="microphone" size={25} color={tintColor} />
        ),
      },
    },
    // OneVerse,
    // Streak,
    // Fetch,
    // Player,
  },
  {
    initialRouteName: 'Overview',
    tabBarComponent: props => <CustomTabBar {...props} />,
    tabBarOptions: {
      activeTintColor: theme.colors.white,
      inactiveTintColor: theme.colors.gray1,
      style: {
        backgroundColor: theme.colors.black,
        borderTopWidth: 0,
        bottom: 0,
      },
    },
  },
);

