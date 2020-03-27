import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
} from 'react-native';
import firebase from 'react-native-firebase';
import {Block, Text} from '../components';
import {theme} from '../constants';
import {DOMParser} from 'xmldom';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import * as Animatable from 'react-native-animatable';
AnimatedShimmer = Animatable.createAnimatableComponent(ShimmerPlaceHolder);
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {
  VerseCard,
  _renderSermon,
  _renderPodcast,
} from '../components/VerseSermonCards';
const {width: WIDTH, height: HEIGHT} = Dimensions.get('window');
import _ from 'underscore';
import moment from 'moment';
import {Header, Left, Body, Right} from 'native-base';

export default class Results extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Feed',
      headerTitleStyle: theme.fonts.title,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      sermons: undefined,
      verses: null,
      podcasts: [],
      likedosis: null,
      isLoading: true,
    };
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
  }

  render() {
    let isLoading = true;
    if (this.state.verses && this.state.sermons && this.state.podcasts) {
      firebase.analytics().setCurrentScreen('Result');
      isLoading = false;
    }
    return isLoading ? (
      this._renderLoadingPlaceHolder()
    ) : (
      <View style={styles.welcome}>
        <Header>
          <Left>
            <TouchableOpacity
              hitSlop={{
                bottom: 30,
                left: 30,
                right: 30,
                top: 30,
              }}
              onPress={() => {
                this.props.navigation.navigate('Home');
              }}>
              <Icon
                name="arrow-left"
                size={25}
                style={{paddingLeft: 10}}
                color={theme.colors.black}
              />
            </TouchableOpacity>
          </Left>
          <Body>
            <Text title bold>
              Results
            </Text>
          </Body>
          <Right />
        </Header>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text
            h3
            black
            spacing={1}
            style={{
              marginVertical: 8,
              paddingHorizontal: theme.sizes.padding,
            }}>
            {this.state.verses ? 'Related Verses' : 'Verse Of The Day'}
          </Text>
          {this.state.verses && this._renderSearchResults()}
          {this.state.sermons && this._renderRelatedSermons()}
          {this.state.verses &&
            this.state.podcasts &&
            this._renderRelatedPodcasts()}
          {this._renderFavouritesButton()}
        </ScrollView>
      </View>
    );
  }

  //****** SUB COMPONENTS SECTION
  _renderLoadingPlaceHolder() {
    return (
      <Block
        center
        style={[styles.welcome, {paddingTop: 2 * theme.sizes.padding}]}>
        <AnimatedShimmer
          animation="fadeInLeft"
          delay={400}
          autoRun={true}
          style={{
            width: WIDTH * 0.9,
            height: WIDTH * 0.7,
            marginBottom: WIDTH * 0.05,
            borderRadius: theme.sizes.border,
          }}
        />
        <AnimatedShimmer
          animation="fadeInLeft"
          delay={800}
          autoRun={true}
          style={{
            width: WIDTH * 0.9,
            height: WIDTH * 0.4,
            borderRadius: theme.sizes.border,
          }}
        />
        <View style={[styles.hLine, {marginBottom: theme.sizes.base}]} />
        <AnimatedShimmer
          animation="fadeInLeft"
          delay={1200}
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
  _renderSearchResults() {
    return (
      <ScrollView
        style={{width: '100%', marginLeft: 20}}
        horizontal={true}
        showsHorizontalScrollIndicator={false}>
        {this.state.verses.map(
          (verse, index) =>
            this.state.likedosis && (
              <VerseCard
                likedosis={this.state.likedosis}
                imageIndex={Math.floor(
                  Math.random() * theme.randomImages.length,
                )}
                verses={[verse]}
                key={index}
                index={index}
                scroller={this.state.verses.length > 1}
                props={this.props}
              />
            ),
        )}
      </ScrollView>
    );
  }
  _renderRelatedSermons() {
    return (
      <Block>
        {this.state.sermons.length > 0 && (
          <Text
            h3
            black
            spacing={1}
            style={{
              marginVertical: 8,
              paddingHorizontal: theme.sizes.padding,
            }}>
            Related Sermons
          </Text>
        )}
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
  _renderRelatedPodcasts() {
    return (
      <Block>
        {this.state.podcasts.length > 0 && (
          <Text
            h3
            black
            spacing={1}
            style={{
              marginVertical: 8,
              paddingHorizontal: theme.sizes.padding,
            }}>
            Related Podcasts
          </Text>
        )}
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            marginVertical: 8,
            paddingHorizontal: theme.sizes.padding,
          }}>
          {this.state.podcasts.map((podcast, idx) => {
            return _renderPodcast(podcast, idx, this.props);
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
          center
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
            name="arrow-right"
            size={20}
            color={theme.colors.black}
            style={{marginRight: 10}}
          />
        </Block>
      </TouchableOpacity>
    );
  }

  //****** HELPER FUNCTIONS SECTION
  logPodTrack = (track, podcastImage) => {
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
    const authors = Array.prototype.slice.call(
      track.getElementsByTagName('itunes:author'),
    );

    const getSafe = list => {
      try {
        return list[0].childNodes[0].nodeValue;
      } catch (error) {
        return '';
      }
    };
    const getSafe2 = list => {
      try {
        return list[0].getAttribute('url');
      } catch (error) {
        return '';
      }
    };

    return {
      title: getSafe(titles),
      mp3link: getSafe2(enclosures),
      date_uploaded: moment(getSafe(pubDates))
        .local()
        .format(),
      duration: getSafe(durations),
      author: getSafe(authors),
      speakerimg: podcastImage,
      plays: null,
      description: getSafe(descriptions).replace(/(<([^>]+)>)/gi, ''),
    };
  };
  fetchPodcasts = async (term, related) => {
    const result = await fetch(
      `https://itunes.apple.com/search?term=${term}&entity=podcast&genreId=1439`,
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
          .filter(item => !item.title.toLowerCase().includes('islam'))
          .filter(item => !item.title.toLowerCase().includes('muslim'))
          .filter(item => !item.author.toLowerCase().includes('wallace'))
          .filter(item => !item.title.toLowerCase().includes('hindu'))
          .filter(item => !item.title.toLowerCase().includes('jew'))
          .filter(item => !item.title.toLowerCase().includes('judaism'))
          .filter(item => !item.title.toLowerCase().includes('homosexuality'))
          .filter(item => !item.title.toLowerCase().includes('gay'));

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
    backgroundColor: theme.colors.bg,
    // paddingHorizontal: theme.sizes.padding,
    flex: 1,
  },
  // horizontal line
  hLine: {
    // marginBottom: theme.sizes.base,
    marginHorizontal: WIDTH * 0.1,
    marginTop: 3,
    height: 1,
    backgroundColor: theme.colors.gray,
  },
});
