import Screens from './Screens';
import {createStackNavigator} from 'react-navigation-stack';
import ModalRoutes from './ModalRoutes';
import Player from '../screens/Player';
import Detail from '../screens/Detail';


export default createStackNavigator(
  {
    // Main Tab Navigation
    // /////////////////////////////////////////////////////////////////////////
    bottomTabs: {
      screen: Screens,
    },

    // Modals
    // /////////////////////////////////////////////////////////////////////////
    Player: {
      screen: Player,
      navigationOptions: {
        /**
         * Distance from top to register swipe to dismiss modal gesture. Default (135)
         * https://reactnavigation.org/docs/en/stack-navigator.html#gestureresponsedistance
         */
        gestureResponseDistance: {vertical: 1000}, // default is 135 },
      },
    },
    Detail: {
      screen: Detail,
      navigationOptions: {
        gestureResponseDistance: {vertical: 1000},
      },
    },
  },
  {
    headerMode: 'none',
    initialRouteName: 'bottomTabs',
    mode: 'modal',
    transparentCard: true,
  },
);
