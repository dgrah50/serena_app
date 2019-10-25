import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';

import rgba from 'hex-to-rgba';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-snap-carousel';
import {Block, Badge, Card, Text, Input, Button} from '../components';
import {styles as blockStyles} from '../components/Block';
import {styles as cardStyles} from '../components/Card';
import {theme, mocks, time} from '../constants';
import {DOMParser} from 'xmldom';

const {width} = Dimensions.get('window');

export default class Podcast extends Component {
  constructor(props) {
    super(props);
    this.state = {
      podcasts: [],
      searchText: '',
      podcast: undefined,
      podcastDocument: undefined,
      view: undefined,
    };
  }
  static navigationOptions = {
    headerLeft: (
      <Block left style={{paddingLeft: 10}}>
        <Text gray style={theme.fonts.title}>
          {time.DateNow.weekday}
          {', '}
          <Text style={theme.fonts.title}>
            {time.DateNow.month} {time.DateNow.date}
          </Text>
        </Text>
      </Block>
    ),
    headerRight: (
      <TouchableOpacity>
        <Block flex={false}>
          <Image
            resizeMode="contain"
            source={require('../assets/images/Icon/Menu.png')}
            style={{width: 45, height: 18, paddingRight: 40}}
          />
        </Block>
      </TouchableOpacity>
    ),
  };

  renderNavBar() {
    const {navigation} = this.props;

    return (
      <Block center middle style={styles.endTrip}>
        <Card
          shadow
          row
          style={{
            width: '90%',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Welcome')}>
            <Icon name="square" size={62 / 2.5} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Welcome')}>
            <Icon name="square" size={62 / 2.5} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Welcome')}>
            <Icon name="square" size={62 / 2.5} color="black" />
          </TouchableOpacity>
        </Card>
      </Block>
    );
  }

  searchTextHandler = e => {
    this.setState({
      searchText: e,
    });
  };

  onPressSearch = async () => {
    const result = await fetch(
      'https://listen-api.listennotes.com/api/v2/best_podcasts?genre_id=75&safe_mode=1',
      {
        headers: {
          'X-ListenAPI-Key': 'dfe039a08e26434191c68ba606a0023e',
        },
      },
    );
    const json = await result.json();

    try {
      console.log(json.podcasts);
      this.setState({
        podcasts: json.podcasts,
      });
    } catch (e) {
      console.log(e);
      // what should we do if
      // the request returns invalid JSON?
    }
  };

  onPressListenPodcast = async podcast => {
    const result = await fetch(podcast.rss);
    const text = await result.text();

    const podcastDocument = new DOMParser().parseFromString(text, 'text/xml');
    console.log('hello');
    this.setState({
      podcast: podcast,
      podcastDocument: podcastDocument,
      view: 'tracks',
    });
  };

  renderSearchBar() {
    return (
      <Block center middle>
        <Input
          full
          label="Search for a podcast"
          style={{marginBottom: 25}}
          onChangeTextHandler={this.searchTextHandler}
        />
        <Button
          full
          style={{marginBottom: 12}}
          onPress={() => this.onPressSearch()}>
          <Text button>Search</Text>
        </Button>
      </Block>
    );
  }

  renderPodcasts() {
    const podcasts = this.state.podcasts;
    if (podcasts === undefined) {
      return null;
    }

    if (podcasts.length < 1) {
      return (
        <Block center middle>
          <Text>There are no podcasts matching these terms</Text>
        </Block>
      );
    }

    return podcasts.map(podcast => this.renderPodcastCard(podcast));
  }

  renderPodcastTracks() {
    const podcast = this.state.podcast;
    console.log(podcast)
    const podcastDocument = this.state.podcastDocument;
    const items = podcastDocument.getElementsByTagName('item');
    return (
      <View>
        <View
          style={{
            width: '100%',
            height: 100,
          }}>
          <Image
            style={{
              width: '100%',
              height: '100%',
            }}
            resizeMode="cover"
            source={{
              uri: podcast.image,
            }}
          />
        </View>
        {Array.prototype.slice.call(items).map(this.renderPodcastTrack)}
      </View>
    );
  }

  renderPodcastTrack = track => {
    const links = Array.prototype.slice.call(
      track.getElementsByTagName('link'),
    );

    const titles = Array.prototype.slice.call(
      track.getElementsByTagName('title'),
    );

    return (
      <TouchableOpacity
        key={links[0].childNodes[0].nodeValue}
        onPress={() => this.onPressPodcastTrack(track)}>
        <View
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
      </TouchableOpacity>
    );
  };

  renderPodcastCard(podcast) {
    return (
      <TouchableOpacity
        key={podcast.id}
        onPress={() => {
          this.onPressListenPodcast(podcast);
        }}>
        <Card shadow>
          <Block row>
            <Image
              style={{width: 50, height: 50}}
              source={{
                uri: podcast.image,
              }}
            />

            <Block left center>
              <Text title style={{marginVertical: 8}}>
                {podcast.title}
              </Text>
            </Block>
          </Block>
        </Card>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <React.Fragment>
        <ScrollView style={styles.welcome} showsVerticalScrollIndicator={false}>
          {this.renderSearchBar()}
          {this.state.view == 'tracks'
            ? this.renderPodcastTracks()
            : this.renderPodcasts()}
        </ScrollView>
        {this.renderNavBar()}
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    paddingVertical: theme.sizes.padding,
    paddingHorizontal: theme.sizes.padding,
    backgroundColor: theme.colors.gray4,
  },
  // horizontal line
  hLine: {
    marginVertical: theme.sizes.base * 2,
    marginHorizontal: theme.sizes.base * 2,
    height: 1,
  },
  // vertical line
  vLine: {
    marginVertical: theme.sizes.base / 2,
    width: 1,
  },
  endTrip: {
    position: 'absolute',
    width: width,
    bottom: 0,
  },
});
