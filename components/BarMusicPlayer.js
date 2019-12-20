import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity, View, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Block, Badge, Card, Text} from './';
import {styles as blockStyles} from './Block';
import {styles as cardStyles} from './Card';
import {theme, mocks, time} from '../constants';
import TrackPlayer, {
  useProgress,
  State,
  usePlaybackState,
} from 'react-native-track-player';

const {width} = Dimensions.get('window');

function BarMusicPlayer(props) {
  const playbackState = usePlaybackState();

  function togglePlay() {
    if (playbackState == 'playing') {
      TrackPlayer.pause();
    } else {
      TrackPlayer.play();
    }
  }

  const {navigation, song} = props;
  const iconPlay = playbackState != 'playing' ? 'play-circle' : 'pause-circle';
  const favoriteColor = theme.colors.white;
  const favoriteIcon = 'heart';
  console.log(song);
  // const favoriteColor = favorited ? theme.colors.white : theme.colors.white;
  // const favoriteIcon = favorited ? 'heart' : 'heart-o';

  return song.mp3link ? (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => navigation.navigate('Player')}
      style={styles.container}>
      <TouchableOpacity
        // activeOpacity={gStyle.activeOpacity}
        hitSlop={{bottom: 10, left: 10, right: 10, top: 10}}
        onPress={this.toggleFavorite}
        style={styles.containerIcon}>
        <Icon color={favoriteColor} name={favoriteIcon} size={20} />
      </TouchableOpacity>
      {song && (
        <Block flex row center middle style={styles.containerSong}>
          <Text center middle white h3>{`${song.title} · ${song.author} `}</Text>
        </Block>
      )}
      <TouchableOpacity
        // activeOpacity={gStyle.activeOpacity}
        hitSlop={{bottom: 10, left: 10, right: 10, top: 10}}
        onPress={togglePlay}
        style={(styles.containerIcon, {justifyContent: 'flex-end'})}>
        <Icon color={theme.colors.white} name={iconPlay} size={28} />
      </TouchableOpacity>
    </TouchableOpacity>
  ) : (
    <React.Fragment></React.Fragment>
  );
}

BarMusicPlayer.defaultProps = {
  song: null,
};

BarMusicPlayer.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,

  // optional
  song: PropTypes.shape({
    artist: PropTypes.string,
    title: PropTypes.string,
  }),
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.black,
    borderBottomColor: theme.colors.blackBg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    width: '100%',
  },
  containerIcon: {
    // width: 50,
  },
  containerSong: {
    overflow: 'hidden',
    width: width - 100,
  },
  device: {
    color: theme.colors.primary,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
});

export default BarMusicPlayer;
