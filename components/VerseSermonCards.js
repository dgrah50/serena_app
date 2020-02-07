import React, {Component} from 'react';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Block, Text} from '../components';
import {theme} from '../constants';
import {Transition} from 'react-navigation-fluid-transitions';
import firebase from 'react-native-firebase';
const {width: WIDTH, height: HEIGHT} = Dimensions.get('window');
import _ from 'underscore';

export class VerseCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alreadyLiked: false,
    };
  }
  componentDidMount() {
    if (this.props.likedosis) {
      if (this.props.likedosis.includes(this.props.verses[0].osis)) {
        this.setState({
          alreadyLiked: true,
        });
      }
    }
  }

  cardToggle = val => {
    if (val != this.state.alreadyLiked) {
      this.setState({
        alreadyLiked: val,
      });
    }
  };

  render() {
    const {verses, index, scroller, props, imageIndex} = this.props;
    return (
      <React.Fragment>
        <TouchableOpacity
          style={ !scroller && {
            // alignItems: !scroller && 'center',
            alignItems:  'center',
          }}
          onPress={() => {
            props.navigation.navigate('Detail', {
              verse: verses[0],
              index: index,
              imageIndex: imageIndex,
              alreadyLiked: this.state.alreadyLiked,
              cardToggle: this.cardToggle,
            });
          }}>
          <Transition shared={'image' + index}>
            <ImageBackground
              style={[
                {
                  width: WIDTH * 0.9,
                  height: WIDTH * 0.7,
                  marginBottom: WIDTH * 0.05,
                  borderRadius: theme.sizes.border,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 10,
                },
                scroller
                  ? {width: WIDTH * 0.7, marginRight: 20, height: WIDTH * 0.5}
                  : {width: WIDTH * 0.9},
                theme.shadow,
              ]}
              imageStyle={{
                borderRadius: theme.sizes.border,
              }}
              source={theme.randomImages[imageIndex]}>
              <Block flex={false} center middle style={{padding: 10}}>
                <Block flex={false} center middle>
                  <Transition shared={'versetext' + index}>
                    <Text
                      white
                      center
                      numberOfLines={3}
                      style={{marginVertical: 8, fontSize: 24}}>
                      {verses[0].verse}
                    </Text>
                  </Transition>
                </Block>
                <Block flex={false} center>
                  <Transition shared={'booktext' + index}>
                    <Text h3 white style={{marginVertical: 8}}>
                      {verses[0].bookname}
                    </Text>
                  </Transition>
                </Block>
              </Block>
              <Block
                flex={false}
                row
                middle
                justifyContent={'flex-start'}
                style={{position: 'absolute', width: '100%', bottom: 20}}>
                <Transition shared={'likebutton' + index}>
                  <TouchableOpacity>
                    <Icon
                      name="heart"
                      solid={this.state.alreadyLiked}
                      size={20}
                      color={theme.colors.white}
                      style={{marginHorizontal: 10}}
                      onPress={() =>
                        this.toggleFavourites(
                          verses[0].verse,
                          verses[0].bookname,
                          verses[0].osis,
                        )
                      }></Icon>
                  </TouchableOpacity>
                </Transition>
                <Transition shared={'sharebutton' + index}>
                  <TouchableOpacity>
                    <Icon
                      name="paper-plane"
                      size={20}
                      color={theme.colors.white}
                      onPress={() =>
                        onShare(verses[0].verse + ' ' + verses[0].bookname)
                      }></Icon>
                  </TouchableOpacity>
                </Transition>
              </Block>
            </ImageBackground>
          </Transition>
        </TouchableOpacity>
      </React.Fragment>
    );
  }

  async toggleFavourites(verseText, bookText, osis) {
    osis = osis.toString();
    if (osis.length == 7) {
      osis = '0' + osis.toString();
    }
    let firestoreref = firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('likes');
    if (!this.state.alreadyLiked) {
      try {
        firestoreref.doc(osis).set({
          verseText: verseText,
          bookText: bookText,
          time: firebase.firestore.FieldValue.serverTimestamp(),
        });
        this.setState({
          alreadyLiked: true,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        firestoreref.doc(osis).delete();
        this.setState({
          alreadyLiked: false,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
}

export function _renderPodcast(track, props) {
  const links = Array.prototype.slice.call(track.getElementsByTagName('link'));

  const titles = Array.prototype.slice.call(
    track.getElementsByTagName('title'),
  );
  const descs = Array.prototype.slice.call(
    track.getElementsByTagName('description'),
  );
  const images = Array.prototype.slice.call(track.getElementsByTagName('url'));
  console.log(images);
  return (
    <View
      key={links[0].childNodes[0].nodeValue}
      style={{
        paddingTop: 10,
        paddingBottom: 10,
      }}>
      <Text
        style={{
          color: '#007afb',
          fontSize: 18,
        }}>
        {titles[0].childNodes[0].nodeValue}
      </Text>
    </View>
  );
}

export function _renderSermon(item, idx, props, center = false) {
  let uri = item.speakerimg;
  let speakerName = item.author;
  let duration = item.duration;
  let plays = item.plays;
  const changeSong = props.screenProps.changeSong;
  return (
    <TouchableOpacity
      key={idx}
      style={
        center && {
          alignItems: 'center',
        }
      }
      onPress={() => {
        props.navigation.navigate('Player', {
          sermon: item,
        });
        changeSong(item);
      }}>
      <Block
        center
        middle
        style={[
          {
            backgroundColor: theme.colors.gray3,
            padding: 15,
            paddingBottom: 13,
            marginBottom: WIDTH * 0.05,

            width: WIDTH * 0.7,
            borderRadius: theme.sizes.border,
          },

          center
            ? {width: WIDTH * 0.9}
            : {width: WIDTH * 0.7, marginRight:20},
          theme.shadow,
        ]}>
        <Block middle center row style={{marginBottom: 10}}>
          <Image
            style={{
              width: 70,
              height: 70,
              borderRadius: 10,
              marginRight: 10,
            }}
            source={{
              uri: uri,
            }}
          />
          <Block middle>
            <Text title gray>
              {speakerName}
            </Text>
            <Text h3 numberOfLines={2}>
              {item.title}
            </Text>
          </Block>
        </Block>
        <Block
          flex={false}
          row
          center
          middle
          style={{
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <Block flex={false} row center middle>
            <Icon
              name="heart"
              size={20}
              color={theme.colors.gray}
              style={{marginRight: 10}}
            />
            <Icon name="paper-plane" size={20} color={theme.colors.gray} />
          </Block>
          <Block flex={false} row center middle>
            <Text right title gray>
              {duration}
            </Text>
            <Block flex={false} row center middle style={styles.playButton}>
              <Text white>PLAY </Text>
              <Icon name="play" size={10} color={theme.colors.white} />
            </Block>
          </Block>
        </Block>
      </Block>
    </TouchableOpacity>
  );
}

async function onShare(message) {
  try {
    const result = await Share.share({
      message: message,
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    alert(error.message);
  }
}

const styles = StyleSheet.create({
  welcome: {
    paddingTop: 2 * theme.sizes.padding,
    // paddingHorizontal: theme.sizes.padding,
    flex: 1,
  },
  playButton: {
    backgroundColor: theme.colors.blue,
    borderRadius: 10,
    marginLeft: 10,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  // horizontal line
  hLine: {
    marginBottom: theme.sizes.base,
    marginHorizontal: WIDTH * 0.1,
    height: 3,
    backgroundColor: theme.colors.gray2,
  },
});
