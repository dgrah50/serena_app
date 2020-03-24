import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import firebase from 'react-native-firebase';
import {Block} from '../components';
import {theme} from '../constants';
import {_renderPodcast} from '../components/VerseSermonCards';
import {DOMParser} from 'xmldom';
import moment from 'moment';

export default class SubscribedPodcasts extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Subscribed Podcasts',
      headerTitleStyle: theme.fonts.title,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Profile');
          }}
        />
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      results: [],
      inputValue: '',
      followedPodcasts: [],
      subs: [],
    };
  }
  componentDidMount() {
    firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('Info')
      .doc('followedPodcasts')
      .get()
      .then(res => {
        this.setState({
          followedPodcasts: res.data().subscribed,
        });
      })
      .then(() => {
        this.fetchSubscriptions().then(subs => {
          this.setState({subs: subs});
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }
  render() {
    return (
      <Block
        style={{
          width: '100%',
          backgroundColor: 'theme.colors.bg',
        }}>
        <FlatList
          style={styles.container}
          data={this.state.subs}
          renderItem={({item, index}) => {
            return _renderPodcast(item, 1, this.props, true);
          }}
        />
      </Block>
    );
  }

  //****** HELPER FUNCTIONS SECTION
  logPodTrack = (track, author, img) => {
    let titles = Array.prototype.slice.call(
      track.getElementsByTagName('title'),
    );
    let enclosures = Array.prototype.slice.call(
      track.getElementsByTagName('enclosure'),
    );
    let pubDates = Array.prototype.slice.call(
      track.getElementsByTagName('pubDate'),
    );
    let durations = Array.prototype.slice.call(
      track.getElementsByTagName('itunes:duration'),
    );
    let descriptions = Array.prototype.slice.call(
      track.getElementsByTagName('description'),
    );

    const getSafe = list => {
      try {
        return list[0].childNodes[0].nodeValue;
      } catch (error) {
        return '';
      }
    };

    return {
      title: getSafe(titles),
      mp3link: enclosures[0].getAttribute('url'),
      date_uploaded: moment(getSafe(pubDates))
        .local()
        .format(),
      duration: getSafe(durations),
      author: author,
      speakerimg: img,
      plays: null,
      description: getSafe(descriptions).replace(/(<([^>]+)>)/gi, ''),
    };
  };
  async fetchSubscriptions() {
    let subbedDetails = await Promise.all(
      this.state.followedPodcasts.map(async collectionId => {
        const result = await fetch(
          `https://itunes.apple.com/lookup?id=` + collectionId,
        );
        return await result.json();
      }),
    );
    subbedDetails = await Promise.all(
      subbedDetails.map(async i => {
        let res = i.results[0];
        const result = await fetch(res.feedUrl);
        const text = await result.text();
        const podcastDocument = new DOMParser().parseFromString(
          text,
          'text/xml',
        );
        const items = podcastDocument.getElementsByTagName('item');
        return Array.prototype.slice
          .call(items)
          .map(i => this.logPodTrack(i, res.artistName, res.artworkUrl600));
      }),
    );

    subbedDetails = [].concat.apply([], subbedDetails);
    return await subbedDetails.sort((a, b) =>
      a.date_uploaded < b.date_uploaded ? 1 : -1,
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    height: '100%',
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  // horizontal line
  hLine: {
    marginVertical: theme.sizes.base * 2,
    marginHorizontal: theme.sizes.base * 2,
    height: 1,
  },
  sectionHeader: {
    paddingHorizontal: theme.sizes.padding * 0.5,
    paddingVertical: 8,
  },
  podContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start', // if you want to fill rows left to right
  },
});
