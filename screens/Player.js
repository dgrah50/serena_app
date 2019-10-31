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
import {Block, Badge, Card, Text, Controls} from '../components';
import {styles as blockStyles} from '../components/Block';
import {styles as cardStyles} from '../components/Card';
import {theme, mocks, time, emotions} from '../constants';
import TrackPlayer, {useProgress, State} from 'react-native-track-player';
var Slider = require('react-native-slider');

const {width} = Dimensions.get('window');

// class ProgressBar extends ProgressComponent {
//   render() {
//     return (
//       <View style={styles.progress}>
//         <View style={{flex: this.getProgress(), backgroundColor: 'white'}} />
//         <View style={{flex: 1 - this.getProgress(), backgroundColor: 'grey'}} />
//       </View>
//     );
//   }
// }

export default function Player(props) {
  const sermon = props.navigation.getParam('sermon');
  const albumArtURL = sermon.speaker.albumArtURL;
  const title = sermon.fullTitle;
  const speaker = sermon.speaker.displayName;
  const audioURL = sermon.media.audio[0].streamURL;

  TrackPlayer.setupPlayer().then(async () => {
    // Adds a track to the queue
    await TrackPlayer.add({
      id: '1',
      url: audioURL,
      title: 'Track Title',
      artist: 'Track Artist',
    });

    // Starts playing it
    TrackPlayer.play();
  });

  // renderTrackDetails(title, speaker) {
  //   return (
  //     <Block center middle>
  //       <Text title>{title}</Text>
  //       <Text capto>{speaker}</Text>
  //     </Block>
  //   );
  // }

  // togglePlay() {
  //   if (this.state.playing) {
  //     TrackPlayer.pause();
  //     this.setState({
  //       playing: false,
  //     });
  //   } else {
  //     TrackPlayer.play();
  //     this.setState({
  //       playing: true,
  //     });
  //   }
  // }

  function renderPlayBackControls() {
    return (
      <Block
        row
        center
        space={'between'}
        style={{width: '80%', height: '15%', marginHorizontal: '10%'}}>
        <TouchableOpacity>
          <Icon name="backward" size={30} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            this.togglePlay();
          }}>
          {/* <Icon name={this.state.playing ? 'pause' : 'play'} size={60} /> */}
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="forward" size={30} />
        </TouchableOpacity>
      </Block>
    );
  }


  function renderAlbumArt(url) {
    url = url.replace('{size}', 500).replace('{size}', 500);
    return (
      <Card
        shadow
        center
        middle
        style={{
          width: width * 0.6,
          height: width * 0.6,
          marginHorizontal: width * 0.2,
        }}>
        <Image style={{width: width, height: width}} source={{uri: url}} />
      </Card>
    );
  }

  function ProgressBar() {
    const progress = useProgress();
    console.log(progress.position);
    const playbackState = usePlaybackState();
    console.log(playbackState)

    return (
      <Slider
        style={styles.slider}
        trackStyle={styles.progress}
        thumbStyle={styles.progressThumb}
        maximumValue={progress.duration}
        value={progress.position}
        minimumTrackTintColor={colors.canarySecondary}
        maximumTrackTintColor="transparent"
        thumbTintColor={colors.canarySecondary}
        onSlidingComplete={(value: number) => TrackPlayer.seekTo(value)}
      />
    );
  }

  // render() {

  return (
    <React.Fragment>
      <Block>
        <ProgressBar />
        {renderAlbumArt(albumArtURL)}
        {renderPlayBackControls()}
        {ProgressBar()}
      </Block>
    </React.Fragment>
  );
  // }
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
  progress: {
    height: 10,
    width: '90%',
    marginTop: 10,
    flexDirection: 'row',
  },
});
