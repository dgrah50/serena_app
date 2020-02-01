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
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Block, Text} from '../components';
import {theme} from '../constants';
import {Bars} from 'react-native-loader';
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
      dailyVerse: [
        {
          verse:
            'You will seek Me and find Me when you search for Me with all your heart.',
          bookname: 'Jeremiah 29:13',
        },
      ],
      podcasts: null,
    };
    this.fetchDailyVerse();
    // this.fetchPodcasts('food');
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
          {this.state.verses ? (
            this._renderSearchResults()
          ) : (
            <_renderVerseCard
              verses={this.state.dailyVerse}
              index={2}
              scroller={false}
              props={this.props}
            />
          )}
          {this.state.sermons && this._renderRelatedSermons()}
          <View style={styles.hLine} />
          <_renderVerseCard
            verses={this.state.dailyVerse}
            index={3}
            scroller={false}
            props={this.props}
          />
          <_renderVerseCard
            verses={this.state.dailyVerse}
            index={4}
            scroller={false}
            props={this.props}
          />
          {/* {this.state.podcasts && this._renderPodcasts()} */}
        </ScrollView>
      </View>
    );
  }

  //****** SUB COMPONENTS SECTION

  _renderSearchResults() {
    return (
      <ScrollView
        style={{width: '100%'}}
        horizontal={true}
        showsHorizontalScrollIndicator={false}>
        {this.state.verses.map((verse, index) => (
          <_renderVerseCard
            verses={[verse]}
            index={index}
            scroller={true}
            props={this.props}
          />
        ))}
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
    const items = this.state.podcasts.getElementsByTagName('item');
    let podcastsamples = _.sample(Array.prototype.slice.call(items), 5);
    return (
      <View style={{width: 300, backgroundColor: 'red'}}>
        {podcastsamples.map(this._renderPodcast)}
      </View>
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
}

const styles = StyleSheet.create({
  welcome: {
    paddingTop: 2 * theme.sizes.padding,
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
