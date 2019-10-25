import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import Overview from '../screens/Overview';
import OneVerse from '../screens/OneVerse';
import Streak from '../screens/Streak';
import Fetch from '../screens/Fetch';
import Podcast from '../screens/Podcast';

export default createStackNavigator({
  Overview,
  OneVerse,
  Streak,
  Fetch,
  Podcast
});