import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

// import Overview from '../screens/Overview';
import HomeFeed from '../screens/HomeFeed';
import Detail from '../screens/Detail';
// import Groups from '../screens/Groups';
import Fetch from '../screens/Fetch'
import Player from '../screens/Player'

export default createStackNavigator({
  // Overview,
  HomeFeed,
  Detail,
  // Groups,
  Fetch,
  Player,
});