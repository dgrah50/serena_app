import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import firebase from 'react-native-firebase';
import {Block, Text} from '../components';
import {theme} from '../constants';
const {width} = Dimensions.get('window');
import {_renderPodcast} from '../components/VerseSermonCards';
import {DOMParser} from 'xmldom';
import moment from 'moment';
import * as Animatable from 'react-native-animatable';
AnimatedBlock = Animatable.createAnimatableComponent(Block);

import {
  Header,
  Left,
  Icon,
  Body,
  Right,
  Input,
  Item,
  Button,
} from 'native-base';
// import Icon from 'react-native-vector-icons/SimpleLineIcons';

export default class Podcasts extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
      // title: 'Serena Creators',
      // headerTitleStyle: theme.fonts.title,
      // headerRight: () => (
      //   <TouchableOpacity
      //     onPress={() => {
      //       navigation.navigate('Profile');
      //     }}
      //   />
      // ),
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
        {this._renderHeader()}
        <ScrollView
          style={styles.container}
          numColumns={2}
          showsVerticalScrollIndicator={false}>
          {this.state.subs.length > 0 && (
            <Animatable.View animation="fadeInLeft" delay={400}>
              <Block
                key={0}
                style={styles.sectionHeader}
                row
                center
                space={'between'}
                flex={false}>
                <>
                  <Text title>New from Subscriptions</Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('SubscribedPodcasts');
                    }}>
                    <Text button style={{color: theme.colors.primary}}>
                      View All
                    </Text>
                  </TouchableOpacity>
                </>
              </Block>
              {_renderPodcast(this.state.subs[0], 1, this.props, true)}
            </Animatable.View>
          )}
          <Block
            style={styles.sectionHeader}
            key={2}
            row
            center
            space={'between'}
            flex={false}>
            <Text title>Podcasts</Text>
          </Block>

          <Block key={3} style={styles.podContainer}>
            {this.state.results.map(item => {
              return this._renderPodcastTile(item);
            })}
          </Block>
        </ScrollView>
      </Block>
    );
  }
  //****** SUB COMPONENTS SECTION
  _renderPodcastTile(item) {
    return (
      <TouchableOpacity
        style={{
          width: width * 0.5,
          height: width * 0.6,
        }}
        onPress={() => {
          this.props.navigation.navigate('SinglePodcast', {
            podcastDetail: item,
          });
        }}>
        <AnimatedBlock center animation="fadeInLeft" delay={400}>
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
        </AnimatedBlock>
      </TouchableOpacity>
    );
  }

  _renderHeader = () => {
    if (!this.state.searching) {
      return (
        <Header searchBar rounded>
          <Left />
          <Body style>
            <Text title bold>
              Podcasts
            </Text>
          </Body>
          <Right>
            <Button
              transparent
              onPress={() => {
                this.setState({searching: true});
              }}>
              <Text>Search</Text>
            </Button>
          </Right>
        </Header>
      );
    } else {
      return (
        <Header searchBar rounded>
          <Item>
            <Icon name="ios-search" />
            <Input
              placeholder="Search Podcasts"
              value={this.state.inputValue}
              onChangeText={inputValue =>
                this.setState({inputValue}, () => {
                  this.searchPodcastHandler(inputValue);
                })
              }
            />
            <Icon name="ios-people" />
          </Item>
          <Button
            transparent
            onPress={() => {
              this.setState({inputValue: '', searching: false}, () => {
                this.searchPodcastHandler('podcast');
              });
            }}>
            <Text>Cancel</Text>
          </Button>
        </Header>
      );
    }
  };

  // <Block
  //   style={{
  //     paddingHorizontal: '5%',
  //     paddingVertical: 10,
  //     backgroundColor: theme.colors.bg,
  //   }}
  //   flex={false}>
  //   <Input
  //     label={'Search'}
  //     onFocus={() => this.setState({searching: true})}
  //     value={this.state.inputValue}
  //     onChangeText={inputValue =>
  //       this.setState({inputValue}, () => {
  //         this.searchPodcastHandler(inputValue);
  //       })
  //     }
  //     rightLabel={
  //       <TouchableOpacity
  //         onPress={() => {
  //           this.setState({inputValue: ''}, () => {
  //             this.searchPodcastHandler('podcast');
  //           });
  //         }}>
  //         <Text style={{color: 'red'}}>Cancel</Text>
  //       </TouchableOpacity>
  //     }
  //     onChangeTextHandler={this.searchPodcastHandler}
  //   />
  // </Block>

  //****** HELPER FUNCTIONS SECTION
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
        return this.logPodTrack(items[0], res.artistName, res.artworkUrl600);
      }),
    );
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
