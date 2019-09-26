import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import Login from '../screens/Login';
import Register from '../screens/Register';
import Forgot from '../screens/Forgot';

export default createStackNavigator({
  Register,
  Login,
  Forgot,
}, {
  defaultNavigationOptions: {
    header: null
  }
});
