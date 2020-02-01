import React, {Component} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Share,
  Dimensions,
  View,
} from 'react-native';
import axios from 'axios';
import firebase from 'react-native-firebase';
import {Block, Text} from '../components';
import {theme, time} from '../constants';
import {DOMParser} from 'xmldom';
import {
  _renderVerseCard,
  _renderSermon,
  _renderPodcast,
} from '../components/VerseSermonCards';
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
      verses: null,
      recommendedVerses: props.screenProps.recommendedVerses.verses,
      recommendedSermons: props.screenProps.recommendedVerses.sermons.current,
      dailyVerse: null,
      podcasts: [],
      likedosis: null,
    };

    this.fetchDailyVerse();
    this.fetchLikes();
    
  }

  componentDidMount() {
    this.fetchPodcasts(this.props.screenProps.recommendedVerses.keyword);
    try {
      this.setState({
        sermons: this.props.navigation.getParam('response').sermons.current,
        verses: this.props.navigation.getParam('response').verses,
        recommendedVerses: props.screenProps.recommendedVerses.verses,
        recommendedSermons: props.screenProps.recommendedVerses.sermons.current,
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <View style={styles.welcome}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text
            h2
            black
            spacing={1}
            style={{
              marginVertical: 8,
              paddingHorizontal: theme.sizes.padding,
            }}>
            {this.state.verses ? 'Related Verses' : 'Verse Of The Day'}
          </Text>
          {this.state.verses
            ? this._renderSearchResults()
            : this.state.dailyVerse && [this._renderDailyVerse(), this._renderSOD()]}
          {this.state.sermons && this._renderRelatedSermons()}
          <View style={styles.hLine} />
          {this.state.dailyVerse &&
            this.state.likedosis &&
            this._renderRecommendedVerses()}
          {this.state.dailyVerse &&
            this.state.likedosis &&
            this._renderRecommendedSermons()}
          {this.state.podcasts && this._renderPodcasts()}
        </ScrollView>
      </View>
    );
  }

  //****** SUB COMPONENTS SECTION

  _renderDailyVerse() {
    return (
      <_renderVerseCard
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
  _renderRecommendedVerses() {
    return this.state.recommendedVerses.map((verse, index) => {
      return (
        <_renderVerseCard
          likedosis={this.state.likedosis}
          imageIndex={Math.floor(Math.random() * theme.randomImages.length)}
          verses={[verse]}
          index={index + 3}
          key={index + 3}
          scroller={false}
          props={this.props}
        />
      );
    });
  }
  _renderRecommendedSermons() {
    return (
      <Block>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            marginVertical: 8,
            paddingHorizontal: theme.sizes.padding,
          }}>
          {this.state.recommendedSermons.map((sermon, idx) => {
            return _renderSermon(sermon, idx, this.props);
          })}
        </ScrollView>
      </Block>
    );
  }
  _renderSOD() {
    return (
      <Block>
        <Text
          h2
          black
          spacing={1}
          style={{
            marginVertical: 8,
            paddingHorizontal: theme.sizes.padding,
          }}>
          Sermon Of The Day
        </Text>
        <View
          style={{
            marginVertical: 8,
            paddingHorizontal: theme.sizes.padding,
          }}>
          {_renderSermon(this.state.recommendedSermons[0], 2, this.props, true)}
        </View>
      </Block>
    );
  }
  _renderSearchResults() {
    return (
      <ScrollView
        style={{width: '100%'}}
        horizontal={true}
        showsHorizontalScrollIndicator={false}>
        {this.state.verses.map(
          (verse, index) =>
            this.state.likedosis && (
              <_renderVerseCard
                likedosis={this.state.likedosis}
                imageIndex={Math.floor(
                  Math.random() * theme.randomImages.length,
                )}
                verses={[verse]}
                key={index}
                index={index}
                scroller={true}
                props={this.props}
              />
            ),
        )}
      </ScrollView>
    );
  }
  _renderVODs() {}

  _renderRelatedSermons() {
    return (
      <Block>
        <Text
          h2
          black
          spacing={1}
          style={{
            marginVertical: 8,
            paddingHorizontal: theme.sizes.padding,
          }}>
          Related Sermons
        </Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            marginVertical: 8,
            paddingHorizontal: theme.sizes.padding,
          }}>
          {this.state.sermons.map((sermon, idx) => {
            return _renderSermon(sermon, idx, this.props);
          })}
        </ScrollView>
      </Block>
    );
  }
  _renderPodcasts() {
    return (
      <Block>
        <Text
          h2
          black
          spacing={1}
          style={{
            marginVertical: 8,
            paddingHorizontal: theme.sizes.padding,
          }}>
          Related Podcasts
        </Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            marginVertical: 8,
            paddingHorizontal: theme.sizes.padding,
          }}>
          {this.state.podcasts.map((podcast, idx) => {
            return _renderSermon(podcast, idx, this.props);
          })}
        </ScrollView>
      </Block>
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

  fetchPodcasts = async term => {
    console.log('test');
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
          .filter(item => item != undefined);

        this.setState(previousState => ({
          podcasts: [...previousState.podcasts, ..._.sample(newcasts, 5)],
        }));
      }
      console.log(this.state.podcasts);
    } catch (e) {
      // what should we do if
      // the request returns invalid JSON?
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
    paddingTop: 2 * theme.sizes.padding,
    backgroundColor: theme.colors.bg,
    // paddingHorizontal: theme.sizes.padding,
    flex: 1,
  },
  // horizontal line
  hLine: {
    marginBottom: theme.sizes.base,
    marginHorizontal: WIDTH * 0.1,
    height: 3,
    backgroundColor: theme.colors.gray2,
  },
});
