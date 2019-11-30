import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity, View, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Block, Badge, Card, Text} from './';
import {styles as blockStyles} from './Block';
import {styles as cardStyles} from './Card';
import {theme, mocks, time} from '../constants';

const {width} = Dimensions.get('window');

class BarMusicPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      favorited: false,
      paused: true,
    };

    this.toggleFavorite = this.toggleFavorite.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
  }

  toggleFavorite() {
    this.setState(prev => ({
      favorited: !prev.favorited,
    }));
  }

  togglePlay() {
    this.setState(prev => ({
      paused: !prev.paused,
    }));
  }

  render() {
    const {navigation, song} = this.props;
    const {favorited, paused} = this.state;

    const favoriteColor = favorited ? theme.colors.white : theme.colors.white;
    const favoriteIcon = favorited ? 'heart' : 'heart-o';
    const iconPlay = paused ? 'play-circle' : 'pause-circle';

    return (
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
              <Text white h3>{`${song.title} · `}</Text>
              <Text white h3>
                {song.artist}
              </Text>
            </Block>
        )}
        <TouchableOpacity
          // activeOpacity={gStyle.activeOpacity}
          hitSlop={{bottom: 10, left: 10, right: 10, top: 10}}
          onPress={this.togglePlay}
          style={styles.containerIcon}>
          <Icon color={theme.colors.white} name={iconPlay} size={28} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }
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
    width: 50,
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
