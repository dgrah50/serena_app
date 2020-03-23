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
import moment, {relativeTimeThreshold} from 'moment';

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

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.alreadyLiked !== this.state.alreadyLiked;
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
          style={
            !scroller && {
              // alignItems: !scroller && 'center',
              alignItems: 'center',
            }
          }
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
                  ? {
                      width: WIDTH * 0.7,
                      marginRight: 20,
                      height: WIDTH * 0.5,
                    }
                  : {width: WIDTH * 0.9},
                theme.shadow,
              ]}
              imageStyle={{
                borderRadius: theme.sizes.border,
              }}
              source={theme.randomImages[imageIndex]}>
              <Block
                flex={false}
                center
                middle
                style={{padding: 10, marginBottom: 20}}>
                <Block flex={false} center middle>
                  <Transition shared={'versetext' + index}>
                    <Text
                      white
                      center
                      numberOfLines={3}
                      style={{marginVertical: 8, fontSize: 20}}>
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
                style={{
                  position: 'absolute',
                  width: '100%',
                  bottom: 10,
                }}>
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
                        onShare(
                          verses[0].verse +
                            ' ' +
                            verses[0].bookname +
                            '. I found this verse with the Serena app - download it here : http://onelink.to/yq89j8',
                        )
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

export function _renderPodcast(item, idx, props, center = false) {
  return _renderSermon(item, idx, props, center, false);
}

function formatDuration(duration) {
  if(duration==""){
    return ""
  }
  if (duration === undefined) {
    return null;
  }
  if (duration.includes('min')) {
    return duration;
  } else if (duration.includes(':')) {
    let dursplit = duration.split(':');
    if (dursplit.length == 3) {
      return duration.split(':')[1] + ' min';
    } else if (dursplit.length == 2) {
      return duration.split(':')[0] + ' min';
    } else {
      return duration;
    }
  } else {
    return Math.floor(duration / 60) + 'min';
  }
}

export function _renderSermon(
  item,
  idx,
  props,
  center = false,
  isSermon = true,
) {
  if (
    typeof item == 'undefined'
    // typeof item.speakerimg == 'undefined' ||
    // typeof item.duration == 'undefined'
  ) {
    return null;
  }
  let uri =
    item.speakerimg != undefined
      ? item.speakerimg
      : 'https://via.placeholder.com/150/449CD6/FFFFFF?text=Serena.app';
  let speakerName = item.author;
  let duration = item.duration;
  let uploaddate = item.date_uploaded;
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
          center ? {width: WIDTH * 0.9} : {width: WIDTH * 0.7, marginRight: 20},
          theme.shadow,
        ]}>
        <Block flex={false} row right style={{width: '100%', paddingBottom: 5}}>
          <Text>{moment(uploaddate).isValid() ? moment(uploaddate).format('LL'):""}</Text>
        </Block>
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
            <Text gray numberOfLines={2}>
              {speakerName}
            </Text>
            <Text title numberOfLines={2}>
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
            justifyContent: 'flex-end',
            width: '100%',
          }}>
          {/* <Block flex={false} row center middle>
            <Icon
              name="heart"
              size={20}
              color={theme.colors.gray}
              style={{marginRight: 10}}
            />
            <Icon name="paper-plane" size={20} color={theme.colors.gray} />
          </Block> */}
          <Block
            flex={false}
            row
            center
            space={'between'}
            style={{width: '100%'}}>
            <Text left body gray>
              {isSermon ? 'Sermon' : 'Podcast'} | {formatDuration(duration)}
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
