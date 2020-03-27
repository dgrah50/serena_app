import React from 'react';
import {Animated} from 'react-native';
import PropTypes from 'prop-types';
import {BottomTabBar} from 'react-navigation-tabs';
import {theme} from '../constants';
// components
import BarMusicPlayer from './BarMusicPlayer';

const CustomTabBar = props => {
  const {
    navigation,
    screenProps: {currentSongData},
  } = props;

  function getDeepestRoute(route) {
    if (!route.routes) return route.routeName;
    return getDeepestRoute(route.routes[route.index]);
  }

  let deepestRoute = getDeepestRoute(navigation.state);
  // console.log(deepestRoute)
  // if (navigation.state.routes.length > 1) {
  //   navigation.state.routes.map(route => {
  //     console.log(props.navigation.state.index);
  //     if (deepestRoute == 'Home') {
  //       console.log(props)
  //       props.style.backgroundColor = '#2474A8';
  //       props.activeTintColor = '#FFF';
  //       props.inactiveTintColor = theme.colors.gray4;
  //     } else {
  //       props.style.backgroundColor = theme.colors.gray4
  //       props.activeTintColor = "#000";
  //       props.inactiveTintColor = theme.colors.primary;
  //     }
  //   });
  // }

  props.style.backgroundColor =
    deepestRoute == 'Home' ? '#2474A8' : theme.colors.gray4;

  return (
    <React.Fragment>
      <BarMusicPlayer navigation={navigation} song={currentSongData} />
      <BottomTabBar
        {...props}
        activeTintColor={theme.colors.black}
        inactiveTintColor={
          deepestRoute == 'Home'
            ? 'rgba(255, 255, 255, 0.3)'
            : 'rgba(0,0,0, 0.3)'
        }
      />
    </React.Fragment>
  );
};

CustomTabBar.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  screenProps: PropTypes.object.isRequired,
};

export default CustomTabBar;
