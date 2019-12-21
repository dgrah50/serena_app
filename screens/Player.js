import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Block, Text, Card} from '../components';
import {theme} from '../constants';
import TrackPlayer, {
  useProgress,
  usePlaybackState,
} from 'react-native-track-player';
import Slider from 'react-native-slider';
import LottieView from 'lottie-react-native';

const {height, width} = Dimensions.get('window');

export default function Player(props) {
  const {navigation, screenProps} = props;
  const {currentSongData} = screenProps;
  const playbackState = usePlaybackState();
  const iconPlay = playbackState != 'playing' ? 'play-circle' : 'pause-circle';

  return (
    <Block
      style={{
        width: '100%',
        flex: 1,
        backgroundColor: theme.colors.gray3,
      }}>
      <LottieView
        style={{
          width: width * 2.3,
          height: width * 2.3,
          alignSelf: 'center',
          position: 'absolute',
        }}
        source={require('../assets/anims/wave.json')}
        autoPlay
        speed={0.4}
        loop
      />
      {_renderHeader()}
      {_renderAlbumArt(currentSongData.speakerimg)}
      {_renderControlCard()}
      {_renderFooter()}
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
    // url = url.replace('{size}', 500).replace('{size}', 500);
    return (
      <Card
        shadow
        flex={false}
        style={{
          backgroundColor: theme.colors.black,
          marginHorizontal: '5%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Block
          flex={false}
          style={{
            alignItems: 'flex-start',
          }}>
          <Image
            style={{
              width: width * 0.3,
              height: width * 0.3,
              shadowColor: 'black',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
            }}
            source={{uri: url}}
          />
        </Block>
      </Card>
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
      <TouchableOpacity onPress={() => navigation.goBack(null)}>
        <Card
          flex={false}
          center
          middle
          shadow
          style={{
            marginTop: height * 0.1,
            marginHorizontal: '5%',
            backgroundColor: theme.colors.black,
            flexDirection: 'row',
          }}>
          <Block style={{position: 'absolute', top: 10, left: 10}}>
            <Icon color={theme.colors.white} name="chevron-down" size={20} />
          </Block>

          <Text center bold middle h3 white>
            {currentSongData.title}
          </Text>
        </Card>
      </TouchableOpacity>
    );
  }
  function _renderFooter() {
    return (
      <TouchableOpacity onPress={() => navigation.goBack(null)}>
        <Card
          flex={false}
          center
          middle
          shadow
          style={{
            marginTop: height * 0.1,
            marginHorizontal: '5%',
            backgroundColor: theme.colors.black,
            flexDirection: 'row',
          }}>
          <Text center middle h3 white>
            Powered by Serena
          </Text>
        </Card>
      </TouchableOpacity>
    );
  }
  function _renderControlCard() {
    return (
      <Card
        style={{
          backgroundColor: theme.colors.black,
          marginHorizontal: width * 0.05,
        }}
        flex={false}
        shadow>
        <Text left white h2 style={{paddingTop: 20}}>
          {currentSongData.title}
        </Text>
        <Text white title>
          {currentSongData.author}
        </Text>
        {_renderProgressBar()}
        {_renderPlayBackControls()}
      </Card>
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
