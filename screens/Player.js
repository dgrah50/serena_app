import React, {useState} from 'react';
import {Dimensions, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Block, Text, Card} from '../components';
import {theme} from '../constants';
import TrackPlayer, {
  useProgress,
  usePlaybackState,
  State,
} from 'react-native-track-player';
import Slider from 'react-native-slider';
import LinearGradient from 'react-native-linear-gradient';

const {height, width} = Dimensions.get('window');

export default function Player(props) {
  const {navigation, screenProps} = props;
  const {currentSongData} = screenProps;
  const playbackState = usePlaybackState();
  const iconPlay =
    State[playbackState] != 'Playing' ? 'play-circle' : 'pause-circle';

  return (
    <LinearGradient
      colors={['rgba(76, 102, 159, 1)', '#7D7EB1']}
      style={{
        width: '100%',
        flex: 1,
      }}>
      {_renderHeader()}
      {_renderControlCard()}
      {_renderFooter()}
    </LinearGradient>
  );

  //****** SUB COMPONENTS SECTION
  function _renderPlayBackControls() {
    return (
      <Block
        flex={false}
        middle
        center
        space={'between'}
        style={{
          bottom:0,
          flexDirection: 'row',
          marginHorizontal: '10%',
        }}>
        <TouchableOpacity>
          <Icon color={theme.colors.black} name="step-backward" size={40} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            togglePlay();
          }}>
          <Icon color={theme.colors.black} name={iconPlay} size={80} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon color={theme.colors.black} name="step-forward" size={40} />
        </TouchableOpacity>
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
          thumbTintColor={theme.colors.black}
          onSlidingComplete={value => TrackPlayer.seekTo(value)}
        />

        <Block row space={'between'} flex={false}>
          {State[playbackState] != 'Buffering' &&
            State[playbackState] != 'loading' && (
              <React.Fragment>
                <Text caption black>
                  {convertToMinutes(progress.position)}
                </Text>
                <Text caption black>
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
            backgroundColor: theme.colors.gray4,
            flexDirection: 'row',
          }}>
          <Block style={{position: 'absolute', top: 10, left: 10, margin: 10}}>
            <Icon color={theme.colors.black} name="chevron-down" size={20} />
          </Block>
          <Block style={{paddingHorizontal: 15}}>
            <Text center bold middle h3 black>
              {currentSongData.title}
            </Text>
          </Block>
        </Card>
      </TouchableOpacity>
    );
  }
  function _renderControlCard() {
    return (
      <Card
        style={{
          backgroundColor: theme.colors.gray4,
          marginHorizontal: width * 0.05,
          padding: 0,
        }}
        middle
        shadow>
        <Block flex={false} center middle>
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
            }}
            source={{uri: currentSongData.speakerimg}}
          />
        </Block>
        <Text center middle black h3 style={{paddingTop: 20}}>
          {currentSongData.title}
        </Text>
        <Text black title center middle>
          {currentSongData.author}
        </Text>
        {_renderProgressBar()}
        {_renderPlayBackControls()}
      </Card>
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
            backgroundColor: theme.colors.gray4,
            flexDirection: 'row',
          }}>
          <Text center middle h3 black>
            Powered by Serena
          </Text>
        </Card>
      </TouchableOpacity>
    );
  }

  //****** HELPER FUNCTONS SECTION
  function togglePlay() {
    if (State[playbackState] == 'Playing') {
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
  progressTrack: {
    height: 10,
    borderRadius: 1,
  },
  progressThumb: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: 'black',
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
