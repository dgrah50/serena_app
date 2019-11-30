import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import ModalNavigator from './ModalNavigator';
import Loading from '../screens/Loading';
import Auth from './Auth';

// Loading screen



export default createAppContainer(
  createSwitchNavigator(
    {
      Auth,
      Loading,
      Main: ModalNavigator,
    },
    {
      initialRouteName: 'Loading',
    },
  ),
);