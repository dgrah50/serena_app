import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  SectionList,
  ScrollView,
} from 'react-native';
import firebase from 'react-native-firebase';
import {Block, Text, Input} from '../components';
import {theme} from '../constants';
const {width} = Dimensions.get('window');
import {_renderPodcast} from '../components/VerseSermonCards';
import {DOMParser} from 'xmldom';
import moment, {relativeTimeThreshold} from 'moment';

export default class Podcasts extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Serena Creators',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
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
    this.searchPodcastHandler('podcast');
    firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('Info')
      .doc('followedPodcasts')
      .get()
      .then(res => {
        console.log(res.data());
        this.setState({
          followedPodcasts: res.data().subscribed,
        });
      })
      .then(() => {
        this.fetchSubscriptions().then(subs => {
          console.log(subs);
          this.setState({subs: subs});
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }

  createiTunesLink(searchQuery, results = 25) {
    return (
      'https://itunes.apple.com/search?term=' +
      encodeURIComponent(searchQuery) +
      '&entity=podcast&genreId=1439&limit=' +
      results
    );
  }

  searchPodcastHandler = e => {
    iTunesLink = this.createiTunesLink(e);
    fetch(iTunesLink)
      .then(response => {
        return response.json();
      })
      .then(jsonData => {
        this.setState(oldState => {
          return {
            results: jsonData['results'],
          };
        });
      });
  };
  header = () => {
    return (
      <Block
        style={{
          paddingHorizontal: '5%',
          backgroundColor: theme.colors.bg,
        }}
        flex={false}>
        <Input
          label={'Search'}
          onFocus={() => this.setState({searching: true})}
          value={this.state.inputValue}
          onChangeText={inputValue =>
            this.setState({inputValue}, () => {
              this.searchPodcastHandler(inputValue);
            })
          }
          rightLabel={
            <TouchableOpacity
              onPress={() => {
                this.setState({inputValue: ''}, () => {
                  this.searchPodcastHandler('podcast');
                });
              }}>
              <Text style={{color: 'red'}}>Cancel</Text>
            </TouchableOpacity>
          }
          onChangeTextHandler={this.searchPodcastHandler}
        />
      </Block>
    );
  };

  render() {
    return (
      <Block
        style={{
          width: '100%',
          backgroundColor: 'theme.colors.bg',
        }}>
        {this.header()}
        <ScrollView
          style={styles.container}
          numColumns={2}
          showsVerticalScrollIndicator={false}>
          <Text title style={styles.sectionHeader}>
            New from your Subscriptions
          </Text>
          {_renderPodcast(this.state.subs[0], 1, this.props, true)}
          <Text title style={styles.sectionHeader}>
            Podcasts
          </Text>
          <Block style={styles.podContainer}>
            {this.state.results.map(item => {
              console.log(item);
              return this._renderPodcastTile(item);
            })}
          </Block>
        </ScrollView>
      </Block>
    );
  }
  _renderPodcastTile(item) {
    return (
      <TouchableOpacity
        style={{
          width: width * 0.5,
          height: width * 0.6,
          // marginVertical: 10,
        }}
        onPress={() => {
          this.props.navigation.navigate('SinglePodcast', {
            podcastDetail: item,
          });
        }}>
        <Block center>
          <Image
            style={{
              width: width * 0.4,
              height: width * 0.4,
              borderRadius: theme.sizes.border,
            }}
            source={{
              uri: item.artworkUrl600,
            }}
          />
          <Text
            bold
            caption
            center
            numberOfLines={2}
            style={{paddingHorizontal: width * 0.05}}>
            {item.collectionName}
          </Text>
          <Text
            caption
            center
            numberOfLines={1}
            style={{paddingHorizontal: width * 0.05}}>
            {item.artistName}
          </Text>
        </Block>
      </TouchableOpacity>
    );
  }
  _renderSubscribedPodcasts() {
    return (
      <Block flex={false} center middle style={{height: width * 0.4}}>
        {_renderPodcast(this.state.subs[0], 1, this.props, true)}
      </Block>
    );
  }

  logPodTrack = (track, author, img) => {
    const titles = Array.prototype.slice.call(
      track.getElementsByTagName('title'),
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
    const pubDates = Array.prototype.slice.call(
      track.getElementsByTagName('pubDate'),
    );
    return {
      title: titles[0].childNodes[0].nodeValue,
      mp3link: enclosures[0].getAttribute('url'),
      date_uploaded:
        pubDates.length != 0
          ? moment(pubDates[0].childNodes[0].nodeValue)
              .local()
              .format()
          : '',
      duration:
        durations.length != 0 ? durations[0].childNodes[0].nodeValue : '',
      author: author,
      speakerimg: img,
      plays: null,
      description: descriptions[0].childNodes[0].nodeValue.replace(
        /(<([^>]+)>)/gi,
        '',
      ),
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
        return this.logPodTrack(items[0], res.artistName, res.artworkUrl600);
      }),
    );
    console.log(subbedDetails);
    return await subbedDetails.sort((a, b) =>
      a.date_uploaded > b.date_uploaded ? 1 : -1,
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
