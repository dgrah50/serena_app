import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import firebase from 'react-native-firebase';
import Carousel from 'react-native-snap-carousel';
import axios from 'axios';
import {RNChipView} from 'react-native-chip-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import qs from 'qs';
import {Block, Card, Text} from '../components';
import {theme, emotions} from '../constants';
const {width} = Dimensions.get('window');

export default class Overview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      likes: [],
      sermonRecs: [
        {
          title: 'So Many Reasons to Love The Lord Jesus Christ',
          mp3link:
            '//mp3.sermonaudio.com/download/112512158135/112512158135.mp3',
          speakerimg:
            'https://media.sermonaudio.com/gallery/photos/thumbnails/mikeallison-01.PNG',
          author: 'Mike Allison',
          plays: '160+ ',
          duration: ' 36 min',
          date_uploaded: 'SUN 11/25/2012',
        },
        {
          title: 'The Enemies of the Cross.',
          mp3link:
            '//mp3.sermonaudio.com/download/1213091951010/1213091951010.mp3',
          speakerimg:
            'https://media.sermonaudio.com/gallery/photos/thumbnails/cranston-01.PNG',
          author: 'Rev. Reginald Cranston',
          plays: '140+ ',
          duration: ' 48 min',
          date_uploaded: 'SUN 12/13/2009',
        },
        {
          title: 'Restore Fatherhood',
          mp3link:
            '//mp3.sermonaudio.com/download/617121927576/617121927576.mp3',
          speakerimg:
            'https://media.sermonaudio.com/gallery/photos/thumbnails/jasonyoung-01.PNG',
          author: 'Jason Young',
          plays: '3,860+ ',
          duration: ' 65 min',
          date_uploaded: 'SUN 06/17/2012',
        },
      ],
      dailyVerse: null,
    };
    this.fetchLikes();
    this.fetchDailyVerse();
  }

  render() {
    return (
      <View
        style={{
          width: '100%',
          flex: 1,
          backgroundColor: theme.colors.bg,
          justifyContent: 'space-between',
        }}>
        <ScrollView style={styles.home} showsVerticalScrollIndicator={false}>
          {this._renderEmotionChips()}
          {this._renderTopicChips()}
          {this._renderRecommendations()}
          {/* {this._renderFavourites()} */}
        </ScrollView>
      </View>
    );
  }

  //****** HELPER FUNCTIONS SECTION
  fetchLikes() {
    let firestoreref = firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('likes');
    likesarray = [];
    firestoreref
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          likesarray.push({
            bookText: doc.data().bookText,
            osis: doc.id,
            time: doc.data().time.toMillis(),
            verseText: doc.data().verseText,
          });
        });
      })
      .then(() => {
        console.log(likesarray);
        this.setState({
          likes: likesarray.sort(
            (a, b) => parseFloat(b.time) - parseFloat(a.time),
          ),
          sermonRecs: this.props.screenProps.recommendedVerses.sermons.nextrecs,
        });
      });
  }

  timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + ' years';
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + ' months';
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + ' days';
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + ' hours';
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + ' minutes';
    }
    return Math.floor(seconds) + ' seconds';
  }

  fetchDailyVerse() {
    axios.get('https://beta.ourmanna.com/api/v1/get/?format=text').then(res => {
      console.log(res.data);
    });
  }

  apiCall(query) {
    this.setState({fetched: false});
    axios
      .post(
        'https://serenaengine333.co.uk/api/verses',
        // 'http://localhost:8000/api/verses',
        qs.stringify({content: query}),
      )
      .then(response => {
        this.setState({
          fetched: true,
        });
        this.props.navigation.navigate('HomeFeed', {
          response: response.data,
        });
      })
      .catch(error => {
        this.setState({
          fetched: true,
          verse: {
            verseText:
              "Oops! We couldn't find a result for that one, could you rephrase that?",
          },
        });
        console.log(error);
      });
  }

  //****** SUB COMPONENTS SECTION
  _renderTopCardOLD() {
    let today = new Date();
    let hour = today.getHours();
    let period = null;
    if (5 < hour && hour < 12) {
      period = 'morning';
    } else if (12 < hour && hour < 17) {
      period = 'afternoon';
    } else if (17 < hour && hour < 20) {
      period = 'evening';
    } else {
      period = 'night';
    }
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => this.props.navigation.navigate('Pray')}>
        <Card shadow>
          <Block>
            <Block center>
              <Text h3 style={{marginVertical: 8}}>
                Good {period}! How are you feeling today? {'\n'}
                {/* {'\n'}
                You're on a 4 day streak, keep it up! */}
              </Text>
            </Block>
            {/* <Block row right>
              <Icon name="quote-right" size={42} color="black" />
            </Block> */}
          </Block>
        </Card>
      </TouchableOpacity>
    );
  }

  _renderTopicChips() {
    return (
      <Card shadow>
        <Block center middle>
          <Text h3> What does the Bible say about... </Text>
          <ScrollView horizontal={true}>
            {emotions.topicList.map(topic => {
              return (
                <Block style={{padding: 5}} key={topic}>
                  <RNChipView
                    onPress={() => {
                      this.apiCall(topic);
                    }}
                    title={topic}
                    avatar={false}
                  />
                </Block>
              );
            })}
          </ScrollView>
        </Block>
      </Card>
    );
  }
  //To be implemented. Each emoji needs to map to a sub emotion
  //List of sub emotions is given in emotions.emotions
  _renderEmotionChips() {
    return (
      <Card shadow>
        <Block center middle>
          <Text h3> How are you feeling? </Text>
          {this.state.EmojiEmotion ? (
            <React.Fragment>
              <ScrollView horizontal={true}>
                {emotions.emotions[this.state.EmojiEmotion].map(
                  (topic, idx) => {
                    return (
                      <Block style={{padding: 5}} key={topic}>
                        <RNChipView
                          onPress={() => {
                            this.apiCall(topic);
                          }}
                          title={topic}
                          avatar={false}
                        />
                      </Block>
                    );
                  },
                )}
              </ScrollView>
              <Icon
                name={'times-circle'}
                size={30}
                color={theme.colors.gray2}
                onPress={() => {
                  this.setState({EmojiEmotion: null});
                }}
              />
            </React.Fragment>
          ) : (
            <ScrollView horizontal={true}>
              {['😀', '😡', '😔', '😨'].map((topic, idx) => {
                return (
                  <Block style={{padding: 5}} key={topic}>
                    <RNChipView
                      onPress={() => {
                        this.setState({
                          EmojiEmotion: Object.keys(emotions.emotions)[idx],
                        });
                      }}
                      title={topic}
                      avatar={false}
                    />
                  </Block>
                );
              })}
            </ScrollView>
          )}
        </Block>
      </Card>
    );
  }
  _renderSermon({item, index}) {
    const changeSong = this.props.screenProps.changeSong;
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('Player', {
            sermon: item,
          });
          changeSong(item);
        }}>
        <Card
          shadow
          style={{
            marginRight: 30,
            width: width * 0.35,
            height: width * 0.35,
            padding: 0,
            borderBottomLeftRadius: theme.sizes.border,
            borderBottomRightRadius: theme.sizes.border,
          }}>
          <View
            style={{
              width: '100%',
              flex: 1,
              borderRadius: theme.sizes.border,
              backgroundColor: theme.colors.bg,
            }}>
            <Image
              source={require('../assets/images/icon.png')}
              style={{
                height: '50%',
                width: '100%',
                marginVertical: '10%',
              }}
              resizeMode="contain"
            />
            <Block
              space={'between'}
              center
              row
              style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                height: '25%',
                paddingHorizontal: '5%',
                backgroundColor: 'white',
                borderBottomLeftRadius: theme.sizes.border,
                borderBottomRightRadius: theme.sizes.border,
              }}>
              <Image
                style={{
                  width: '25%',
                  height: '100%',
                  borderRadius: theme.sizes.border,
                }}
                resizeMode="contain"
                source={{
                  uri: item.speakerimg,
                }}
              />
              <Block center style={{width: '75%'}}>
                <Text black center caption numberOfLines={2}>
                  {item.title}
                </Text>
              </Block>
            </Block>
          </View>
        </Card>
      </TouchableOpacity>
    );
  }
  _renderVOD({item, index}) {
    const serverdate = new Date(item.time);
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('HomeFeed', {
            response: {
              verses: [{verse: item.verseText, bookname: item.bookText}],
              sermons: null,
            },
          });
        }}>
        <Card
          shadow
          style={{
            marginRight: 30,
            width: width * 0.35,
            height: width * 0.35,
            padding: 10,
          }}>
          <Block center space={'between'}>
            <Text center gray numberOfLines={2}>
              {item.verseText}
              {'\n'}
            </Text>
            <Text title bold black center middle>
              {item.bookText.split(' ').join('\n')}
            </Text>
            <Text black light caption center middle>
              {this.timeSince(serverdate) + ' ago'}
            </Text>
          </Block>
        </Card>
      </TouchableOpacity>
    );
  }
  _renderRecommendations() {
    return (
      <Block>
        <Text h3 black spacing={1} style={{marginVertical: 8}}>
          Recommended For You
        </Text>
        {this.state.sermonRecs && (
          <Block>
            <Carousel
              data={this.state.sermonRecs}
              renderItem={this._renderSermon.bind(this)}
              sliderWidth={width}
              itemWidth={width * 0.45}
              inactiveSlideScale={1}
              inactiveSlideOpacity={0.8}
              enableMomentum={true}
              activeSlideAlignment={'start'}
              activeAnimationType={'spring'}
              activeAnimationOptions={{
                friction: 4,
                tension: 40,
              }}
            />
          </Block>
        )}
      </Block>
    );
  }
  _renderFavourites() {
    return (
      <Block>
        <Text h3 black spacing={1} style={{marginVertical: 8}}>
          Your Favourite Verses
        </Text>

        {!(this.state.likes.length == 0) ? (
          <Block>
            <Carousel
              data={this.state.likes}
              renderItem={this._renderVOD.bind(this)}
              sliderWidth={width}
              itemWidth={width * 0.45}
              inactiveSlideScale={1}
              inactiveSlideOpacity={0.8}
              enableMomentum={true}
              activeSlideAlignment={'start'}
              activeAnimationType={'spring'}
              activeAnimationOptions={{
                friction: 4,
                tension: 40,
              }}
            />
          </Block>
        ) : (
          this._renderEmptyState()
        )}
      </Block>
    );
  }
  _renderEmptyState = () => (
    <TouchableOpacity onPress={() => this.props.navigation.navigate('Pray')}>
      <Card
        shadow
        style={{
          margin: 10,
          width: 150,
          height: 150,
          padding: 5,
        }}>
        <Block center>
          <Text black title center middle>
            You havent added any favourites yet. Tap to add your first.
          </Text>
        </Block>
        <Block
          center
          middle
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: '25%',
            backgroundColor: 'black',
            borderBottomLeftRadius: theme.sizes.border,
            borderBottomRightRadius: theme.sizes.border,
          }}></Block>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  home: {
    paddingTop: 2 * theme.sizes.padding,
    paddingHorizontal: theme.sizes.padding,
  },
  // horizontal line
  hLine: {
    marginVertical: theme.sizes.base,
    marginHorizontal: theme.sizes.base * 2,
    height: 1,
  },
});
