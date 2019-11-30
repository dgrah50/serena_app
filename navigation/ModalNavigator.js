import Screens from './Screens';
import {createStackNavigator} from 'react-navigation-stack';
import ModalRoutes from './ModalRoutes';
import Player from '../screens/Player';


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
    },
  },
  {
    headerMode: 'none',
    initialRouteName: 'bottomTabs',
    mode: 'modal',
    transparentCard: true,
  },
);
