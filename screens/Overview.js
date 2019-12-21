import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import firebase from 'react-native-firebase';
import Carousel from 'react-native-snap-carousel';
import {Block, Card, Text} from '../components';
import {theme, mocks, time} from '../constants';
const {width} = Dimensions.get('window');

export default class Overview extends Component {
 

  constructor(props) {
    super(props);
    this.state = {
      likes: [],
    };
    this.fetchLikes();
  }

  render() {
    return (
      <ScrollView style={styles.home} showsVerticalScrollIndicator={false}>
        {this._renderVerseCard()}
        <Block color="gray3" style={styles.hLine} />
        {this._renderRecommendations()}
        {this._renderFavourites()}
      </ScrollView>
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

  //****** SUB COMPONENTS SECTION
  _renderVerseCard() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => this.props.navigation.navigate('Pray')}>
        <Card shadow>
          <Block>
            <Block center>
              <Text h3 style={{marginVertical: 8}}>
                Good evening, Dayan. How are you feeling today? {'\n'}
                {'\n'}
                You're on a 4 day streak, keep it up!
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
  _renderSermon({item, index}) {
    return (
      <Card
        shadow
        style={{
          marginRight: 30,
          width: 150,
          height: 150,
          padding: 0,
        }}>
        <Image
          style={{
            width: '100%',
            height: '100%',
            borderRadius: theme.sizes.border,
          }}
          resizeMode="cover"
          source={{
            uri: item.speaker.albumArtURL
              .replace('{size}', 200)
              .replace('{size}', 200),
          }}
        />
        <Block
          center
          middle
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: '25%',
            paddingHorizontal: '10%',
            backgroundColor: 'white',
            borderBottomLeftRadius: theme.sizes.border,
            borderBottomRightRadius: theme.sizes.border,
          }}>
          <Text black center caption>
            {item.fullTitle}
          </Text>
        </Block>
      </Card>
    );
  }
  _renderVOD({item, index}) {
    const serverdate = new Date(item.time);
    return (
      <Card
        shadow
        center
        middle
        style={{
          marginRight: 30,
          width: width * 0.35,
          height: width * 0.35,
          padding: 10,
        }}>
        <Block center space={'between'}>
          <Text center gray numberOfLines={3}>
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
    );
  }
  _renderRecommendations() {
    return (
      <Block>
        <Text h3 spacing={1} style={{marginVertical: 8}}>
          Recommended For You
        </Text>
        <Block>
          <Carousel
            data={mocks.sermons}
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
      </Block>
    );
  }
  _renderFavourites() {
    return (
      <Block>
        <Text h3 spacing={1} style={{marginVertical: 8}}>
          Your Favourite Verses
        </Text>

        {!(this.state.likes.length == 0) ? (
          <Block style={{height: 180}}>
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
            backgroundColor: 'white',
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
    backgroundColor: theme.colors.gray4,
  },
  // horizontal line
  hLine: {
    marginVertical: theme.sizes.base,
    marginHorizontal: theme.sizes.base * 2,
    height: 1,
  },
  // vertical line
  vLine: {
    marginVertical: theme.sizes.base / 2,
    width: 1,
  },
  navbar: {
    position: 'absolute',
    width: width,
    bottom: '5%',
  },
});
