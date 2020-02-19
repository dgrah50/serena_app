import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  SectionList,
} from 'react-native';
import axios from 'axios';
import qs from 'qs';
import firebase from 'react-native-firebase';
import {Block, Text} from '../components';
import {theme, time} from '../constants';
import {DOMParser} from 'xmldom';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  VerseCard,
  _renderSermon,
  _renderPodcast,
} from '../components/VerseSermonCards';
const {width: WIDTH, height: HEIGHT} = Dimensions.get('window');
import _ from 'underscore';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Subtitle,
} from 'native-base';

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
      recommendedPodcasts: null,
      recommendedVerses: null,
      recommendedSermons: null,
      dailyVerse: null,
      likedosis: null,
      isLoading: true,
    };

    this.fetchDailyVerse();
    this.fetchLikes();
  }

  componentDidMount() {
    console.log(firebase.auth().currentUser.uid);
    try {
      if (this.props.navigation.getParam('response') != undefined) {
        this.fetchPodcasts(
          this.props.navigation.getParam('response').keyword,
          true,
        );
        this.setState({
          sermons: this.props.navigation.getParam('response').sermons.current,
          verses: this.props.navigation.getParam('response').verses,
        });
      }
    } catch (error) {
      console.log(error);
    }
    if (!this.state.recommendedSermons || !this.state.recommendedSermons) {
      axios
        .post(
          // 'https://serenaengine333.co.uk/api/verses/recs',
          'http://localhost:8000/api/verses/recs',
          qs.stringify({
            userID: firebase.auth().currentUser.uid,
          }),
        )
        .then(res => {
          console.log(res.data);
          this.setState({
            recommendedSermons: res.data.sermons.current,
            recommendedVerses: res.data.verses,
          });
          console.log(res.data.keyword);
          this.fetchPodcasts(res.data.keyword, false);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  render() {
    let isLoading = true;
    let sectionlistdata = null;
    if (
      this.state.dailyVerse &&
      this.state.recommendedVerses &&
      this.state.recommendedSermons &&
      this.state.recommendedPodcasts
    ) {
      firebase.analytics().setCurrentScreen('Discover');
      isLoading = false;
      sectionlistdata = [
        {
          title: 'Verse Of The Day',
          data: this.state.dailyVerse,
        },
        {
          title: 'Serena Recommends',
          data: _.shuffle(
            this.state.recommendedPodcasts
              .concat(this.state.recommendedVerses)
              .concat(this.state.recommendedSermons),
          ),
        },
      ];
    }
    return isLoading ? (
      this._renderLoadingPlaceHolder()
    ) : (
      <View style={styles.welcome}>
        <Header>
          <Left>
            <Icon
              name="chevron-left"
              size={25}
              style={{paddingLeft: 10}}
              color={theme.colors.black}
              onPress={() => {
                this.props.navigation.navigate('Pray');
              }}
            />
          </Left>
          <Body>
            <Title>Discover</Title>
          </Body>
          <Right />
        </Header>
        <SectionList
          sections={sectionlistdata}
          renderItem={({item, index}) => this._whichCard(item, index)}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({section: {title}}) => (
            <Text
              h3
              black
              style={{
                marginVertical: 8,
                paddingHorizontal: theme.sizes.padding,
              }}>
              {title}
            </Text>
          )}
        />
      </View>
    );
  }

  _whichCard(item, index) {
    console.log(item);
    if (item.hasOwnProperty('title')) {
      return this._renderRecommendedSermon(item, index, this.props);
    } else if (item.hasOwnProperty('osis')) {
      if (item.osis.includes('VOD')) {
        return (
          [
            this._renderRecommendedVerse(item, index),
            this._renderFavouritesButton()]
          
        );
      } else {
        return this._renderRecommendedVerse(item, index);
      }
    }
  }

  //****** SUB COMPONENTS SECTION
  _renderLoadingPlaceHolder() {
    return (
      <Block
        center
        style={[styles.welcome, {paddingTop: 2 * theme.sizes.padding}]}>
        <ShimmerPlaceHolder
          autoRun={true}
          style={{
            width: WIDTH * 0.9,
            height: WIDTH * 0.7,
            marginBottom: WIDTH * 0.05,
            borderRadius: theme.sizes.border,
          }}
        />
        <ShimmerPlaceHolder
          autoRun={true}
          style={{
            width: WIDTH * 0.9,
            height: WIDTH * 0.4,
            borderRadius: theme.sizes.border,
          }}
        />
        <View style={[styles.hLine, {marginBottom: theme.sizes.base}]} />
        <ShimmerPlaceHolder
          autoRun={true}
          style={{
            width: WIDTH * 0.9,
            height: WIDTH * 0.7,
            marginBottom: WIDTH * 0.05,
            borderRadius: theme.sizes.border,
          }}
        />
      </Block>
    );
  }
  _renderDailyVerse() {
    return (
      <VerseCard
        likedosis={this.state.likedosis}
        imageIndex={Math.floor(Math.random() * theme.randomImages.length)}
        verses={this.state.dailyVerse}
        index={2}
        key={2}
        scroller={false}
        props={this.props}
      />
    );
  }
  _renderRecommendedVerse(verse, index) {
    return (
      <VerseCard
        likedosis={this.state.likedosis}
        imageIndex={Math.floor(Math.random() * theme.randomImages.length)}
        verses={[verse]}
        index={index + 3}
        key={index + 3}
        scroller={false}
        props={this.props}
      />
    );
    s;
  }
  _renderRecommendedSermon(item, index, prps) {
    return (
      <Block center middle>
        {_renderSermon(item, index, prps, true)}
      </Block>
    );
  }
  _renderRecommendedPodcasts() {
    return (
      <Block>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            marginVertical: 8,
            paddingHorizontal: theme.sizes.padding,
          }}>
          {this.state.recommendedPodcasts.map((podcast, idx) => {
            return _renderSermon(podcast, idx, this.props);
          })}
        </ScrollView>
      </Block>
    );
  }

  _renderFavouritesButton() {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Favourites')}>
        <Block
          space={'between'}
          middle
          row
          style={[
            {
              backgroundColor: theme.colors.gray3,
              padding: 15,
              paddingBottom: 13,
              marginHorizontal: WIDTH * 0.05,
              marginBottom: WIDTH * 0.05,
              width: WIDTH * 0.9,
              borderRadius: theme.sizes.border,
            },
            theme.shadow,
          ]}>
          <Icon
            name="heart"
            size={20}
            solid={true}
            color={'red'}
            style={{marginRight: 10}}
          />
          <Text h3>Favourites</Text>
          <Icon
            name="chevron-right"
            size={20}
            color={theme.colors.black}
            style={{marginRight: 10}}
          />
        </Block>
      </TouchableOpacity>
    );
  }

  //****** HELPER FUNCTIONS SECTION

  fetchDailyVerse() {
    axios.get('https://beta.ourmanna.com/api/v1/get/?format=json').then(res => {
      this.setState({
        dailyVerse: [
          {
            verse: res.data.verse.details.text,
            bookname: res.data.verse.details.reference,
            osis: time.DateNowOSIS,
          },
        ],
      });
    });
  }
  logPodTrack = (track, podcastImage) => {
    const titles = Array.prototype.slice.call(
      track.getElementsByTagName('title'),
    );
    const authors = Array.prototype.slice.call(
      track.getElementsByTagName('itunes:author'),
    );
    const durations = Array.prototype.slice.call(
      track.getElementsByTagName('itunes:duration'),
    );
    const descriptions = Array.prototype.slice.call(
      track.getElementsByTagName('description'),
    );
    const enclosures = Array.prototype.slice.call(
      track.getElementsByTagName('enclosure'),
    );

    try {
      return {
        title: titles[0].childNodes[0].nodeValue,
        mp3link: enclosures[0].getAttribute('url'),
        speakerimg: podcastImage,
        date_uploaded: null,
        duration: durations[0].childNodes[0].nodeValue,
        author: authors[0].childNodes[0].nodeValue,
        plays: null,
        description: descriptions[0].childNodes[0].nodeValue.replace(
          /(<([^>]+)>)/gi,
          '',
        ),
      };
    } catch (err) {
      console.log(err);
    }
  };
  fetchPodcasts = async (term, related) => {
    const result = await fetch(
      `https://itunes.apple.com/search?term=${term}&entity=podcast&genreId=1314`,
    );
    try {
      const json = await result.json();
      let podcasts = json.results;
      sampleIndexs = _.sample([...Array(podcasts.length).keys()], 5);

      podcastList = [];
      let newcasts = null;
      for (const index in sampleIndexs) {
        const result2 = await fetch(podcasts[index].feedUrl);
        const text = await result2.text();
        const podcastImage = podcasts[index].artworkUrl600;
        const podcastDocument = new DOMParser().parseFromString(
          text,
          'text/xml',
        );
        const items = podcastDocument.getElementsByTagName('item');

        newcasts = Array.prototype.slice
          .call(items)
          .map(item => {
            return this.logPodTrack(item, podcastImage);
          })
          .filter(item => item != undefined)
          .filter(item => !item.title.includes('Islam'))
          .filter(item => !item.title.includes('Hindu'))
          .filter(item => !item.title.includes('Jew'))
          .filter(item => !item.title.includes('Judaism'))
          .filter(item => !item.title.includes('Homosexuality'))
          .filter(item => !item.title.includes('Gay'));

        podcastList = [...podcastList, ..._.sample(newcasts, 5)];
      }
      if (related) {
        this.setState({
          podcasts: _.sample(podcastList, 5),
        });
      } else {
        this.setState({
          recommendedPodcasts: _.sample(podcastList, 5),
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
  fetchLikes() {
    let firestoreref = firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('likes')
      .get()
      .then(snapshot => {
        let likedosis = snapshot._docs.map(doc => doc.id);
        this.setState({
          likedosis: likedosis,
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }
}

const styles = StyleSheet.create({
  welcome: {
    // paddingTop: 2 * theme.sizes.padding,
    backgroundColor: theme.colors.bg,

    flex: 1,
  },
  // horizontal line
  hLine: {
    marginHorizontal: WIDTH * 0.1,
    marginTop: 3,
    height: 1,
    backgroundColor: theme.colors.gray,
  },
});
