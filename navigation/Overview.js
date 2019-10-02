import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import Overview from '../screens/Overview';
import OneVerse from '../screens/OneVerse';
import Streak from '../screens/Streak';
import Fetch from '../screens/Fetch';

export default createStackNavigator({
  Overview,
  OneVerse,
  Streak,
  Fetch
});