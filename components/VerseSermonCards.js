import React, {Component} from 'react';
import {
  TouchableOpacity,
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

export class _renderVerseCard extends React.Component {
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

  render() {
    const {verses, index, scroller, props, imageIndex} = this.props;
    return (
      <React.Fragment>
        <TouchableOpacity
          style={scroller && {width: WIDTH * 0.8}}
          onPress={() => {
            props.navigation.navigate('Detail', {
              verse: verses[0],
              index: index,
              imageIndex: imageIndex,
            });
          }}>
          <Transition shared={'image' + index}>
            <ImageBackground
              style={[
                {
                  marginBottom: 10,
                  padding: theme.sizes.padding,
                  borderRadius: theme.sizes.border,
                },
                theme.shadow,
              ]}
              imageStyle={{
                borderRadius: theme.sizes.border,
              }}
              source={theme.randomImages[imageIndex]}>
              <Transition shared={'filter' + index}>
                <Block
                  flex={false}
                  middle
                  style={{
                    padding: 10,
                    backgroundColor: 'rgba(0, 0, 0, .3)',
                    borderRadius: theme.sizes.border,
                  }}>
                  <Block flex={false}>
                    <Block flex={false} center>
                      <Transition shared={'versetext' + index}>
                        <Text
                          h2
                          white
                          numberOfLines={3}
                          style={{marginVertical: 8}}>
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
                  <Block flex={false} row middle justifyContent={'flex-start'}>
                    <Transition shared={'likebutton' + index}>
                      <TouchableOpacity>
                        <Icon
                          name="heart"
                          solid={this.state.alreadyLiked}
                          size={20}
                          color={theme.colors.white}
                          style={{marginHorizontal: 10}}
                          onPress={() =>
                            this.addToFavourites(
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
                </Block>
              </Transition>
            </ImageBackground>
          </Transition>
        </TouchableOpacity>
      </React.Fragment>
    );
  }

  async addToFavourites(verseText, bookText, osis) {
    osis = osis.toString();
    if (osis.length == 7) {
      osis = '0' + osis.toString();
    }
    let firestoreref = firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('likes');
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

export function _renderSermon(item, idx, props) {
  let uri = item.speakerimg;
  let speakerName = item.author;
  let duration = item.duration;
  let plays = item.plays;
  const changeSong = props.screenProps.changeSong;
  return (
    <TouchableOpacity
      key={idx}
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
            padding: 5,

            marginBottom: 20,
            marginRight: 20,
            width: WIDTH * 0.7,
            borderRadius: theme.sizes.border,
          },
          theme.shadow,
        ]}>
        <Block middle center row>
          <Image
            style={{
              width: 80,
              height: 80,
              borderRadius: 10,
              marginRight: 10,
            }}
            source={{
              uri: uri,
            }}
          />
          <Block middle>
            <Text caption gray3>
              {speakerName}
            </Text>
            <Text title numberOfLines={2}>
              {item.title}
            </Text>
          </Block>
        </Block>
        <Block
          row
          center
          style={{
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <Block flex={false} row center middle style={{marginTop: 10}}>
            <Icon
              name="heart"
              size={20}
              color={theme.colors.black}
              style={{marginRight: 10}}
            />
            <Icon name="paper-plane" size={20} color={theme.colors.black} />
          </Block>
          <Block flex={false} row center middle>
            <Text right caption light>
              {duration + 's'}
            </Text>
            <Block flex={false} row center middle style={styles.playButton}>
              <Text white>PLAY</Text>
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
    padding: 5,
  },
  // horizontal line
  hLine: {
    marginBottom: theme.sizes.base,
    marginHorizontal: WIDTH * 0.1,
    height: 3,
    backgroundColor: theme.colors.gray2,
  },
});
