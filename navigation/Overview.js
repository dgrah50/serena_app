import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import Overview from '../screens/Overview';
import OneVerse from '../screens/OneVerse';
import Groups from '../screens/Groups';
import Fetch from '../screens/Fetch'
import Player from '../screens/Player'

export default createStackNavigator({
  Overview,
  OneVerse,
  Groups,
  Fetch,
  Player,
});