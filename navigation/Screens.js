import React from 'react';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import {FluidNavigator} from 'react-navigation-fluid-transitions';
import {theme} from '../constants';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import CustomTabBar from '../components/CustomTabBar';
import HomeFeed from '../screens/HomeFeed';
import Detail from '../screens/Detail';
import Results from '../screens/Results';
import Profile from '../screens/Profile';
import Fetch from '../screens/Fetch';
import Favourites from '../screens/Favourites';
import Podcasts from '../screens/Podcasts';
import SubscribedPodcasts from '../screens/SubscribedPodcasts';
import SinglePodcast from '../screens/SinglePodcast';

const homeStack = createStackNavigator(
  {
    Home: {
      screen: createStackNavigator(
        {
          Home: {
            screen: Fetch,
          },
          Profile: {
            screen: Profile,
          },
        },
        {
          initialRouteName: 'Home',
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
        },
        {
          initialRouteName: 'Favourites',
        },
      ),
    },
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
  },
);
const podcastStack = createStackNavigator(
  {
    Podcasts: {
      screen: Podcasts,
    },
    SinglePodcast: {
      screen: SinglePodcast,
    },
    SubscribedPodcasts: {
      screen: SubscribedPodcasts,
    },
  },
  {
    initialRouteName: 'Podcasts',
  },
);

const discoverStack = FluidNavigator(
  {
    HomeFeed: {
      screen: HomeFeed,
    },
    Favourites: {
      screen: FluidNavigator(
        {
          Favourites: {
            screen: Favourites,
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
);

homeStack.navigationOptions = ({navigation}) => {
  let tabBarVisible;
  const deepestRoute = getDeepestRoute(navigation.state);
  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map(route => {
      if (deepestRoute == 'Detail') {
        tabBarVisible = false;
      } else {
        tabBarVisible = true;
      }
    });
  }
  return {
    tabBarVisible,
    tabBarLabel: 'Home',
    tabBarIcon: ({tintColor}) => (
      <Icon name="home" size={25} color={tintColor} />
    ),
  };
};
discoverStack.navigationOptions = ({navigation}) => {
  let tabBarVisible;
  const deepestRoute = getDeepestRoute(navigation.state);
  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map(route => {
      if (deepestRoute == 'Detail') {
        tabBarVisible = false;
      } else {
        tabBarVisible = true;
      }
    });
  }
  return {
    tabBarVisible,
    tabBarLabel: 'Discover',
    tabBarIcon: ({tintColor}) => (
      <Icon name="magnifier" size={25} color={tintColor} />
    ),
  };
};
podcastStack.navigationOptions = ({navigation}) => {
  let tabBarVisible;
  const deepestRoute = getDeepestRoute(navigation.state);
  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map(route => {
      if (deepestRoute == 'Detail') {
        tabBarVisible = false;
      } else {
        tabBarVisible = true;
      }
    });
  }
  return {
    tabBarVisible,
    tabBarLabel: 'Podcasts',
    tabBarIcon: ({tintColor}) => (
      <Icon name="feed" size={25} color={tintColor} />
    ),
  };
};

function getDeepestRoute(route) {
  if (!route.routes) return route.routeName;
  return getDeepestRoute(route.routes[route.index]);
}

const defaultStack = createBottomTabNavigator(
  {
    Home: {
      screen: homeStack,
    },
    Discover: {
      screen: discoverStack,
    },
    Podcasts: {
      screen: podcastStack,
    },
  },
  {
    initialRouteName: 'Discover',
    headerMode: 'float',
    tabBarComponent: props => <CustomTabBar {...props} />,
    tabBarOptions: {
      activeTintColor: theme.colors.white,
      style: {
        borderTopWidth: 0,
        bottom: 0,
      },
    },
  },
);

export default defaultStack;
