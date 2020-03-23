import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Block, Text} from '../components';
import {theme} from '../constants';
import Spinner from 'react-native-spinkit';
import TrackPlayer, {
  useProgress,
  usePlaybackState,
  State,
} from 'react-native-track-player';
import Slider from 'react-native-slider';

const {height, width} = Dimensions.get('window');

export default function Player(props) {
  const {navigation, screenProps} = props;
  const {currentSongData} = screenProps;
  const playbackState = usePlaybackState();
  const iconPlay =
    State[playbackState] != 'Playing' ? 'play-circle' : 'pause-circle';

  return (
    <View
      style={[
        {
          width: '100%',
          height: '60%',
          bottom: 0,
          position: 'absolute',
          borderTopLeftRadius: theme.sizes.border,
          borderTopRightRadius: theme.sizes.border,
          backgroundColor: theme.colors.white,
        },
        Platform.OS === 'android' && {height: '100%'},
      ]}>
      {_renderHeader()}
      {_renderControlCard()}
      {/* {_renderFooter()} */}
    </View>
  );

  //****** SUB COMPONENTS SECTION
  function _renderPlayBackControls() {
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
    console.log(State[playbackState]);
    if (
      State[playbackState] == 'Buffering' ||
      State[playbackState] == 'Connecting'
    ) {
      return (
        <Block center middle>
          <Spinner type={'Bounce'} />
        </Block>
      );
    }
    return (
      <React.Fragment>
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
              State[playbackState] != 'Connecting' && (
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
        <Block
          flex={false}
          middle
          center
          style={{
            bottom: 0,
            flexDirection: 'row',
            marginHorizontal: '10%',
          }}>
          {/* <TouchableOpacity>
            <Icon color={theme.colors.black} name="step-backward" size={40} />
          </TouchableOpacity> */}

          <TouchableOpacity
            onPress={() => {
              togglePlay();
            }}>
            <Icon color={theme.colors.black} name={iconPlay} size={80} />
          </TouchableOpacity>
          {/* <TouchableOpacity>
            <Icon color={theme.colors.black} name="step-forward" size={40} />
          </TouchableOpacity> */}
        </Block>
      </React.Fragment>
    );
  }

  function _renderHeader() {
    return (
      <TouchableOpacity onPress={() => navigation.goBack(null)}>
        <Block
          flex={false}
          center
          style={{
            marginHorizontal: '5%',
            backgroundColor: theme.colors.white,
            width: '90%',
            height: height * 0.1,
          }}>
          {Platform.OS === 'android' && (
            <Icon
              hitSlop={{bottom: 10, left: 10, right: 10, top: 10}}
              name="arrow-left"
              size={25}
              style={{position: 'absolute', left: 0, top: 10}}
              color={theme.colors.black}
              onPress={() => {
                navigation.goBack(null);
              }}
            />
          )}
          <View
            style={{
              height: 6,
              borderRadius: 3,
              width: width * 0.3,
              top: 0,
              backgroundColor: 'black',
              marginHorizontal: width * 0.2,
              marginTop: 5,
              marginBottom: 15,
            }}
          />
          <Text center bold middle title black>
            {currentSongData.title}
          </Text>
        </Block>
      </TouchableOpacity>
    );
  }
  function _renderControlCard() {
    return (
      <Block
        style={{
          backgroundColor: theme.colors.white,
          marginHorizontal: width * 0.05,
          padding: 0,
        }}
        middle>
        <Block flex={false} center middle>
          <Block flex={false} row center style={{width: '100%'}}>
            <Image
              style={{
                width: width * 0.2,
                height: width * 0.2,
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
            <Block flex={false} style={{width: width * 0.7}}>
              <Text center middle black title style={{paddingTop: 20}}>
                {currentSongData.title}
              </Text>
              <Text black body center middle>
                {currentSongData.author}
              </Text>
            </Block>
          </Block>
        </Block>

        {_renderPlayBackControls()}
      </Block>
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
    backgroundColor: theme.colors.white,
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
