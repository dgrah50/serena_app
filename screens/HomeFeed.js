import React, {Component} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Share,
  Dimensions,
  View,
  ImageBackground,
} from 'react-native';
import axios from 'axios';
import qs from 'qs';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Block, Card, Text} from '../components';
import {theme} from '../constants';
import {Bars} from 'react-native-loader';
import {Transition} from 'react-navigation-fluid-transitions';
import {DOMParser} from 'xmldom';
const {width: WIDTH, height: HEIGHT} = Dimensions.get('window');
import _ from 'underscore';

export default class HomeFeed extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Feed',
      // headerTransparent: true,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      sermons: undefined,
      verses: [
        {
          verse:
            'You will seek Me and find Me when you search for Me with all your heart.',
          bookname: 'Jeremiah 29:13',
        },
      ],
      dailyVerse: [
        {
          verse:
            'You will seek Me and find Me when you search for Me with all your heart.',
          bookname: 'Jeremiah 29:13',
        },
      ],
      podcasts: null,
    };
    this.onShare = this.onShare.bind(this);
    this.fetchDailyVerse();
    this.fetchPodcasts('food');
  }

  componentDidMount() {
    try {
      this.setState({
        sermons: this.props.navigation.getParam('response').sermons.current,
        verses: this.props.navigation.getParam('response').verses,
      });
    } catch (error) {
      console.log(error);
    }
  }

  fetchDailyVerse() {
    axios.get('https://beta.ourmanna.com/api/v1/get/?format=json').then(res => {
      this.setState({
        dailyVerse: [
          {
            verse: res.data.verse.details.text,
            bookname: res.data.verse.details.reference,
          },
        ],
      });
    });
  }
  fetchPodcasts = async term => {
    const podcasts = await fetch(
      `https://itunes.apple.com/search?term=${term}&entity=podcast&genreId=1314`,
    );
    let text = await podcasts.text();
    let sample = _.sample(JSON.parse(text).results, 5);
    let xmlList = sample.map(async item => {
      let interm = await fetch(item.feedUrl);
      let ret = await interm.text();
      return ret;
    });
    Promise.all(xmlList).then(res => {
      const podcastDocument = new DOMParser().parseFromString(
        res[0],
        'text/xml',
      );
      this.setState({
        podcasts: podcastDocument,
      });
    });
  };

  render() {
    return (
      <View style={styles.welcome}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {this._renderVerseCard(this.state.verses, 1)}
          {this.state.sermons && this._renderRelatedSermons()}
          <Block style={styles.hline} />
          {this._renderVerseCard(this.state.dailyVerse, 2)}
          {/* {this.state.podcasts && this._renderPodcasts()} */}
        </ScrollView>
      </View>
    );
  }

  //****** SUB COMPONENTS SECTION
  _renderVerseCard(verses, index) {
    return (
      <React.Fragment>
        <Text h2 black spacing={1} style={{marginVertical: 8}}>
          Related Verses
        </Text>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('Detail', {
              verse: verses[0],
              index: index,
            });
          }}>
          <Transition shared={'image' + index}>
            <ImageBackground
              style={{width: '100%'}}
              imageStyle={{borderRadius: theme.sizes.border}}
              source={require('../assets/images/hand.jpg')}>
              <Block
                flex={false}
                middle
                style={{padding: 10, marginBottom: 10}}>
                <Block flex={false}>
                  <Block flex={false} center>
                    <Transition shared={'versetext' + index}>
                      <Text h2 white style={{marginVertical: 8}}>
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
                          this.onShare(
                            verses[0].verse + ' ' + verses[0].bookname,
                          )
                        }></Icon>
                    </TouchableOpacity>
                  </Transition>
                </Block>
              </Block>
            </ImageBackground>
          </Transition>
        </TouchableOpacity>
      </React.Fragment>
    );
  }
  _renderItem(item, idx) {
    let uri = item.speakerimg;
    let speakerName = item.author;
    let duration = item.duration;
    let plays = item.plays;
    const changeSong = this.props.screenProps.changeSong;
    return (
      <TouchableOpacity
        key={idx}
        onPress={() => {
          this.props.navigation.navigate('Player', {
            sermon: item,
          });
          changeSong(item);
        }}>
        <Card
          // shadow
          center
          middle
          style={{
            backgroundColor: theme.colors.gray3,
            paddingVertical: 5,
            marginRight: 20,
            width: WIDTH * 0.7,
          }}>
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
        </Card>
      </TouchableOpacity>
    );
  }
  _renderRelatedSermons() {
    return (
      <Block>
        <Text h2 black spacing={1} style={{marginVertical: 8}}>
          Related Sermons
        </Text>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {this.state.sermons.map((sermon, idx) => {
            return this._renderItem(sermon, idx);
          })}
        </ScrollView>
      </Block>
    );
  }
  _renderSpinner() {
    return (
      <Block center middle>
        <Bars size={25} color="#000" />
      </Block>
    );
  }
  _renderPodcasts() {
    const items = this.state.podcasts.getElementsByTagName('item');
    let podcastsamples = _.sample(Array.prototype.slice.call(items), 5);
    return (
      <View style={{width: 300, backgroundColor: 'red'}}>
        {podcastsamples.map(this._renderPodcast)}
      </View>
    );
  }

  _renderPodcast(track) {
    const links = Array.prototype.slice.call(
      track.getElementsByTagName('link'),
    );

    const titles = Array.prototype.slice.call(
      track.getElementsByTagName('title'),
    );
    const descs = Array.prototype.slice.call(
      track.getElementsByTagName('description'),
    );
    const images = Array.prototype.slice.call(
      track.getElementsByTagName('url'),
    );
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

  //****** HELPER FUNCTIONS SECTION
  onShare = async message => {
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
  };

  addToFavourites(verseText, bookText, osis) {
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
      this.setState({alreadyLiked: true});
    } catch (err) {
      console.log(err);
    }
  }
}

const styles = StyleSheet.create({
  welcome: {
    paddingTop: 2 * theme.sizes.padding,
    paddingHorizontal: theme.sizes.padding,
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
    marginVertical: theme.sizes.base * 2,
    marginHorizontal: theme.sizes.base * 2,
    height: 1,
  },
});
