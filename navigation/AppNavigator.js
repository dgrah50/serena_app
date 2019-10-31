import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Screens from './Screens';
import Loading from '../screens/Loading';
import Auth from './Auth';

// Loading screen



export default createAppContainer(
  createSwitchNavigator(
    {
      Auth,
      Loading,
      Main: Screens,
    },
    {
      initialRouteName: 'Loading',
    }
  ),
);