import React from 'react';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import {theme, mocks, time} from '../constants';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomTabBar from '../components/CustomTabBar';
import Overview from '../screens/Overview';
import OneVerse from '../screens/OneVerse';
import Groups from '../screens/Groups';
import GroupFeed from '../screens/GroupFeed';
import Notifications from '../screens/Notifications';
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
    Pray: {
      screen: createStackNavigator(
        {
          Pray: {
            screen: Fetch,
          },
          OneVerse: {
            screen: OneVerse,
          },
        },
        {
          headerMode: 'none',
          initialRouteName: 'Pray',
        },
      ),
      navigationOptions: {
        tabBarLabel: 'Pray',
        tabBarIcon: ({tintColor}) => (
          <Icon name="microphone" size={25} color={tintColor} />
        ),
      },
    },
    Groups: {
      screen: createStackNavigator(
        {
          Groups: {
            screen: Groups,
          },
          GroupFeed: {
            screen: GroupFeed,
          },
        },
        {
          headerMode: 'none',
          initialRouteName: 'Groups',
        },
      ),
      navigationOptions: {
        tabBarLabel: 'Groups',
        tabBarIcon: ({tintColor}) => (
          <Icon name="comments" size={25} color={tintColor} />
        ),
      },
    },
    // Notifications: {
    //   screen: Notifications,
    //   navigationOptions: {
    //     tabBarLabel: 'Notifications',
    //     tabBarIcon: ({tintColor}) => (
    //       <Icon name="bell" size={25} color={tintColor} />
    //     ),
    //   },
    // },
  },
  {
    initialRouteName: 'Pray',
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
