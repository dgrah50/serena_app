import React from 'react';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import {FluidNavigator} from 'react-navigation-fluid-transitions';
import {theme} from '../constants';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomTabBar from '../components/CustomTabBar';

import HomeFeed from '../screens/HomeFeed';
import Detail from '../screens/Detail';
import Results from '../screens/Results';
import Profile from '../screens/Profile';
import Fetch from '../screens/Fetch';
import Favourites from '../screens/Favourites';

export default createBottomTabNavigator(
  {
    Pray: {
      screen: createStackNavigator(
        {
          Pray: {
            screen: createStackNavigator(
              {
                Pray: {
                  screen: Fetch,
                },
                Profile: {
                  screen: Profile,
                },
              },
              {
                initialRouteName: 'Pray',
                // headerMode: 'none',
                header: null,
              },
            ),
          },
          Results: {
            screen: FluidNavigator(
              {
                Results: {
                  screen: Results,
                },
                Detail: {
                  screen: Detail,
                },
              },
              {
                initialRouteName: 'Results',
              },
            ),
          },
          Favourites: {
            screen: FluidNavigator(
              {
                Favourites: {
                  screen: Favourites,
                },
                Detail: {
                  screen: Detail,
                },
              },
              {
                initialRouteName: 'Favourites',
              },
            ),
          },
        },
        {
          initialRouteName: 'Pray',
          headerMode: 'none',
        },
      ),
      navigationOptions: {
        tabBarLabel: 'Pray',
        // headerMode: 'none',
        tabBarIcon: ({tintColor}) => (
          <Icon name="home" size={25} color={tintColor} />
        ),
      },
    },
    Discover: {
      screen: FluidNavigator(
        {
          HomeFeed: {
            screen: HomeFeed,
          },
          Detail: {
            screen: Detail,
          },
          Favourites: {
            screen: FluidNavigator(
              {
                Favourites: {
                  screen: Favourites,
                },
                Detail: {
                  screen: Detail,
                },
              },
              {
                initialRouteName: 'Favourites',
              },
            ),
          },
        },
        {
          initialRouteName: 'HomeFeed',
        },
      ),
      navigationOptions: {
        tabBarLabel: 'Discover',
        tabBarIcon: ({tintColor}) => (
          <Icon name="search" size={25} color={tintColor} />
        ),
      },
    },
  },
  {
    initialRouteName: 'Pray',
    headerMode: 'float',
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
