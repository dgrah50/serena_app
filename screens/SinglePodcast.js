import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import {Block, Text, Button} from '../components';
import {theme} from '../constants';
import {DOMParser} from 'xmldom';
const {width} = Dimensions.get('window');
import {_renderPodcast} from '../components/VerseSermonCards';
import firebase from 'react-native-firebase';
import moment from 'moment';

export default class SinglePodcast extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Podcast',
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
      podcasts: [],
      podcastDetail: null,
      following: false,
    };
  }
  componentDidMount() {
    var podcastDetail = JSON.stringify(
      this.props.navigation.getParam('podcastDetail', {}),
    );
    podcastDetail = JSON.parse(podcastDetail);
    this.setState({podcastDetail: podcastDetail});
    this.fetchPodcasts(podcastDetail);
    firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('Info')
      .doc('followedPodcasts')
      .get()
      .then(res => {
        this.setState({
          following: res.data().subscribed.includes(podcastDetail.collectionId),
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }

  render() {
    return (
      <FlatList
        style={styles.welcome}
        data={this.state.podcasts}
        extraData={this.state.following}
        renderItem={({item, index}) => {
          return this.whichCard(item, index);
        }}
      />
    );
  }
  //****** SUB COMPONENTS SECTION
  _renderHeader() {
    let pod = this.state.podcastDetail;
    return (
      <Block key={0}>
        <Block center row style={styles.header}>
          <Block flex={false}>
            <Image
              style={{
                width: width * 0.3,
                height: width * 0.3,
                borderRadius: theme.sizes.border,
              }}
              source={{
                uri: pod.artworkUrl600,
              }}
            />
          </Block>
          <Block middle style={{paddingLeft: 20, height: width * 0.3}}>
            <Text body bold>
              {pod.collectionName}
            </Text>
            <Text small>{pod.artistName}</Text>
          </Block>
        </Block>

        <Button
          onPress={() => {
            this.followPodcast();
          }}
          full
          style={{
            width: width * 0.3,
            height: width * 0.1,
            marginBottom: 10,
            flexDirection: 'row',
            backgroundColor: this.state.following
              ? theme.colors.accent
              : 'rgba(68, 156, 214, 0.5)',
          }}>
          <Text button white>
            {this.state.following ? 'Following' : 'Follow'}
          </Text>
        </Button>
      </Block>
    );
  }
  //****** HELPER FUNCTIONS SECTION
  followPodcast() {
    let firestoreref = firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('Info')
      .doc('followedPodcasts');
    if (this.state.following) {
      this.setState({following: false});
      firestoreref.update({
        subscribed: firebase.firestore.FieldValue.arrayRemove(
          this.state.podcastDetail.collectionId,
        ),
      });
    } else {
      this.setState({following: true});
      firestoreref.set(
        {
          subscribed: firebase.firestore.FieldValue.arrayUnion(
            this.state.podcastDetail.collectionId,
          ),
        },
        {merge: true},
      );
    }
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
  fetchPodcasts = async podcast => {
    try {
      podcastList = [];
      let newcasts = null;

      const result = await fetch(podcast.feedUrl);
      const text = await result.text();
      const podcastDocument = new DOMParser().parseFromString(text, 'text/xml');
      const items = podcastDocument.getElementsByTagName('item');
      newcasts = Array.prototype.slice.call(items).map(item => {
        return this.logPodTrack(
          item,
          podcast.artistName,
          podcast.artworkUrl600,
        );
      });

      this.setState({
        podcasts: newcasts.filter(Boolean),
      });
    } catch (e) {
      console.log(e);
    }
  };
  whichCard(item, index) {
    if (index == 0) {
      return this._renderHeader();
    }
    return _renderPodcast(item, index, this.props, true);
  }
}

const styles = StyleSheet.create({
  welcome: {
    paddingTop: 50,
    paddingHorizontal: theme.sizes.padding,
    backgroundColor: theme.colors.bg,
    alignContent: 'center',
    flex: 1,
    width: '100%',
  },
  header: {
    width: '100%',
    height: width * 0.3,
    marginBottom: 10,
  },
});
