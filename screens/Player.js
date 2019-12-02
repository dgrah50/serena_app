import React, {useState, useEffect} from 'react';
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
import {Block, Badge, Card, Text, Controls} from '../components';
import {styles as blockStyles} from '../components/Block';
import {styles as cardStyles} from '../components/Card';
import {theme, mocks, time, emotions} from '../constants';
import TrackPlayer, {
  useProgress,
  State,
  usePlaybackState,
} from 'react-native-track-player';
import Slider from 'react-native-slider';

const {width, height} = Dimensions.get('window');

export default function Player(props) {
  const {navigation, screenProps} = props;
  const {currentSongData} = screenProps;
  const [favorited, setFavorited] = useState(false);
  const playbackState = usePlaybackState();
  const iconPlay = playbackState != 'playing' ? 'play-circle' : 'pause-circle';

  return (
    <Block
      style={{
        width: '100%',
        flex: 1,
        backgroundColor: theme.colors.black,
      }}>
      {_renderHeader()}
      {_renderAlbumArt(currentSongData.albumArtURL)}
      {_renderProgressBar()}
      {_renderPlayBackControls()}
    </Block>
  );

  //****** SUB COMPONENTS SECTION
  function _renderPlayBackControls() {
    return (
      <Block
        flex={false}
        middle
        center
        style={{
          width: '40%',
          height: '10%',
          flexDirection: 'row',
          marginHorizontal: '10%',
          justifyContent: 'space-between',
          alignContent: 'center',
          alignSelf: 'center',
        }}>
        <TouchableOpacity>
          <Icon color={theme.colors.white} name="step-backward" size={30} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            togglePlay();
          }}>
          <Icon color={theme.colors.white} name={iconPlay} size={60} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon color={theme.colors.white} name="step-forward" size={30} />
        </TouchableOpacity>
      </Block>
    );
  }

  function _renderAlbumArt(url) {
    url = url.replace('{size}', 500).replace('{size}', 500);
    return (
      <Block
        flex={false}
        style={{
          width: '100%',
          height: '50%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Block
          flex={false}
          style={{
            alignItems: 'center',
          }}>
          <Image
            style={{
              width: width * 0.9,
              height: width * 0.9,
            }}
            source={{uri: url}}
          />

          <Text left white h2 style={{paddingTop: 20}}>
            {currentSongData.title}
          </Text>
          <Text white title>
            {currentSongData.artist}
          </Text>
        </Block>
      </Block>
    );
  }

  function _renderProgressBar() {
    const progress = useProgress();
    const playbackState = usePlaybackState();

    function convertToMinutes(time) {
      time = parseInt(time);

      var hrs = ~~(time / 3600);
      var mins = ~~((time % 3600) / 60);
      var secs = ~~time % 60;

      var ret = '';

      if (hrs > 0) {
        ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
      }

      ret += '' + mins + ':' + (secs < 10 ? '0' : '');
      ret += '' + secs;
      return ret;
    }

    return (
      <Block flex={false} style={{paddingHorizontal: '5%'}}>
        <Slider
          // style={styles.slider}
          trackStyle={styles.progress}
          thumbStyle={styles.progressThumb}
          maximumValue={progress.duration}
          minimumValue={0}
          value={progress.position}
          minimumTrackTintColor={theme.colors.gray4}
          maximumTrackTintColor={theme.colors.gray}
          thumbTintColor={theme.colors.white}
          onSlidingComplete={(value: number) => TrackPlayer.seekTo(value)}
        />

        <Block row space={'between'} flex={false}>
          {playbackState != 'buffering' && playbackState != 'loading' && (
            <React.Fragment>
              <Text caption white>
                {convertToMinutes(progress.position)}
              </Text>
              <Text caption white>
                {convertToMinutes(progress.duration)}
              </Text>
            </React.Fragment>
          )}
        </Block>
      </Block>
    );
  }

  function _renderHeader() {
    return (
      <Block
        flex={false}
        middle
        center
        style={{
          height: '10%',
          top: '5%',
          paddingHorizontal: '5%',
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack(null)}
          style={{
            left: 20,
            position: 'absolute',
          }}>
          <Icon color={theme.colors.white} name="chevron-down" size={20} />
        </TouchableOpacity>
        <Text white h3>
          {currentSongData.album}
        </Text>
      </Block>
    );
  }

  //****** HELPER FUNCTONS SECTION
  function togglePlay() {
    if (playbackState == 'playing') {
      TrackPlayer.pause();
    } else {
      TrackPlayer.play();
    }
  }
}

const styles = StyleSheet.create({
  welcome: {
    paddingTop: 2 * theme.sizes.padding,
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
  progressTrack: {
    height: 2,
    borderRadius: 1,
  },
  progressThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  slider: {
    marginTop: -12,
  },
  slider: {
    width: '90%',
    marginTop: 10,
    flexDirection: 'row',
  },
});
