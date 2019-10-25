import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Easing,
} from 'react-native';
import rgba from 'hex-to-rgba';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import qs from 'qs';
import {Block, Badge, Card, Text} from '../components';
import {styles as blockStyles} from '../components/Block';
import {styles as cardStyles} from '../components/Card';
import {theme, mocks, time, emotions} from '../constants';
var Slider = require('react-native-slider');

const {width} = Dimensions.get('window');

export default class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typedText: '',
      showMicButton: true,
      listening: false,
      ringVisible: false,
      toggleText: false,
      results: [],
    };
  }
  static navigationOptions = {
    headerLeft: (
      <Block left style={{paddingLeft: 10}}>
        <Text gray style={theme.fonts.title}>
          {time.DateNow.weekday}
          {', '}
          <Text style={theme.fonts.title}>
            {time.DateNow.month} {time.DateNow.date}
          </Text>
        </Text>
      </Block>
    ),
    headerRight: (
      <TouchableOpacity>
        <Block flex={false}>
          <Image
            resizeMode="contain"
            source={require('../assets/images/Icon/Menu.png')}
            style={{width: 45, height: 18, paddingRight: 40}}
          />
        </Block>
      </TouchableOpacity>
    ),
  };

  renderAlbumArt(url) {
    return (
      <Card shadow center middle style={{width: width, height: width}}>
        <Image style={{width: width, height: width}} source={{uri: url}} />
      </Card>
    );
  }
  
  renderTrackDetails() {
    return <Block></Block>;
  }
  pad(n, width, z = 0) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
  minutesAndSeconds = position => [
    pad(Math.floor(position / 60), 2),
    pad(position % 60, 2),
  ];
  renderSeekBar() {
    const elapsed = this.minutesAndSeconds(currentPosition);
    const remaining = this.minutesAndSeconds(trackLength - currentPosition);
    return (
      <Block>
        <Block row>
          <Text>{elapsed[0] + ':' + elapsed[1]}</Text>

          <Text>
            {trackLength > 1 && '-' + remaining[0] + ':' + remaining[1]}
          </Text>
        </Block>
        <Slider
          maximumValue={Math.max(trackLength, 1, currentPosition + 1)}
          onSlidingStart={onSlidingStart}
          onSlidingComplete={onSeek}
          value={currentPosition}
          style={styles.slider}
          minimumTrackTintColor="#fff"
          maximumTrackTintColor="rgba(255, 255, 255, 0.14)"
          thumbStyle={styles.thumb}
          trackStyle={styles.track}
        />
      </Block>
    );
  }
  renderPlayBackControls() {
    return <Block></Block>;
  }

  render() {
    return (
      <React.Fragment>
        <Block>
          {this.renderAlbumArt()}
          {this.renderTrackDetails()}
          {this.renderSeekBar()}
          {this.renderPlayBackControls()}
        </Block>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    paddingVertical: theme.sizes.padding,
    paddingHorizontal: theme.sizes.padding,
    backgroundColor: theme.colors.gray4,
  },
  // horizontal line
  hLine: {
    marginVertical: theme.sizes.base * 2,
    marginHorizontal: theme.sizes.base * 2,
    height: 1,
  },
  // vertical line
  vLine: {
    marginVertical: theme.sizes.base / 2,
    width: 1,
  },
  track: {
    height: 2,
    borderRadius: 1,
  },
  thumb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  slider: {
    marginTop: -12,
  },
});
