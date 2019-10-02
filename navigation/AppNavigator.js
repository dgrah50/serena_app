import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Screens from './Screens';
import Loading from '../screens/Loading';
import Auth from './Auth';

// Loading screen



export default createAppContainer(
  createSwitchNavigator(
    {
      // You could add another route here for authentication.
      // Read more at https://reactnavigation.org/docs/en/auth-flow.html
      Auth,
      Loading,
      Main: Screens,
    },
    {
      initialRouteName: 'Loading',
    }
  ),
);