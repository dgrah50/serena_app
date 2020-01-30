import React, {Component} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Share,
  View,
  ImageBackground,
} from 'react-native';
import axios from 'axios';
import qs from 'qs';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Block, Card, Text} from '../components';
import {theme} from '../constants';
import {Bars} from 'react-native-loader';
import {Transition} from 'react-navigation-fluid-transitions';

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
      verses: [
        {
          verse:
            'You will seek Me and find Me when you search for Me with all your heart.',
          bookname: 'Jeremiah 29:13',
        },
      ],
      dailyVerse: [
        {
          verse:
            'You will seek Me and find Me when you search for Me with all your heart.',
          bookname: 'Jeremiah 29:13',
        },
      ],
    };
    this.onShare = this.onShare.bind(this);
    this.fetchDailyVerse();
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

  fetchDailyVerse() {
    axios.get('https://beta.ourmanna.com/api/v1/get/?format=json').then(res => {
      console.log(res.data.verse);
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

  render() {
    return (
      <View style={styles.welcome}>
      <ScrollView >
        {this._renderVerseCard(this.state.verses,1)}
        <Block>{this.state.sermons && this._renderRelatedSermons()}</Block>
        {this._renderVerseCard(this.state.dailyVerse,2)}
      </ScrollView>
      </View>
    );
  }

  //****** SUB COMPONENTS SECTION
  _renderVerseCard(verses,index) {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('Detail', {
            verse: verses[0],
            index: index,
          });
        }}>
        <Transition shared={'image' + index}>
          <ImageBackground
            style={{width: '100%'}}
            imageStyle={{borderRadius: theme.sizes.border}}
            source={require('../assets/images/hand.jpg')}>
            <Block flex={false} style={{padding: 10, marginBottom: 10}}>
              <Block flex={false}>
                <Block flex={false} center>
                  <Transition shared={'versetext' + index}>
                    <Text h2 white style={{marginVertical: 8}}>
                      {verses[0].verse}
                    </Text>
                  </Transition>
                </Block>
                <Block flex={false} center>
                  <Transition shared={'booktext' + index}>
                    <Text h3 white style={{marginVertical: 8}}>
                      {verses[0].bookname}
                    </Text>
                  </Transition>
                </Block>
              </Block>
              <Block flex={false} row middle space={'between'}>
                <Transition shared={'likebutton' + index}>
                  <TouchableOpacity>
                    <Icon.Button
                      name="heart"
                      backgroundColor={theme.colors.accent}
                      onPress={() =>
                        this.addToFavourites(
                          verses[0].verse,
                          verses[0].bookname,
                          verses[0].osis,
                        )
                      }>
                      Like
                    </Icon.Button>
                  </TouchableOpacity>
                </Transition>
                <Transition shared={'sharebutton' + index}>
                  <TouchableOpacity>
                    <Icon.Button
                      name="share-alt"
                      backgroundColor={theme.colors.share}
                      onPress={() =>
                        this.onShare(verses[0].verse + ' ' + verses[0].bookname)
                      }>
                      Share
                    </Icon.Button>
                  </TouchableOpacity>
                </Transition>
              </Block>
            </Block>
          </ImageBackground>
        </Transition>
      </TouchableOpacity>
    );
  }
  _renderItem(item, idx) {
    let uri = item.speakerimg;
    let speakerName = item.author;
    let duration = item.duration;
    let plays = item.plays;
    const changeSong = this.props.screenProps.changeSong;
    return (
      <TouchableOpacity
        key={idx}
        onPress={() => {
          this.props.navigation.navigate('Player', {
            sermon: item,
          });
          changeSong(item);
        }}>
        <Card shadow center middle style={{height: 100}}>
          <Block middle center row>
            <Image
              style={{
                width: 80,
                height: 80,
                borderRadius: 10,
                marginRight: 10,
              }}
              source={{
                uri: uri,
              }}
            />
            <Block middle>
              <Text title numberOfLines={1}>
                {item.title}
              </Text>
              <Text caption secondary>
                {speakerName}
              </Text>
              <Text right h3 light>
                {duration}
              </Text>
            </Block>
          </Block>
        </Card>
      </TouchableOpacity>
    );
  }
  _renderRelatedSermons() {
    return (
      <Block>
        <Text h3 black spacing={1} style={{marginVertical: 8}}>
          Related Sermons
        </Text>
        <View showsVerticalScrollIndicator={false}>
          {this.state.sermons.map((sermon, idx) => {
            return this._renderItem(sermon, idx);
          })}
        </View>
      </Block>
    );
  }
  _renderSpinner() {
    return (
      <Block center middle>
        <Bars size={25} color="#000" />
      </Block>
    );
  }

  //****** HELPER FUNCTIONS SECTION
  onShare = async message => {
    try {
      const result = await Share.share({
        message: message,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  addToFavourites(verseText, bookText, osis) {
    osis = osis.toString();
    if (osis.length == 7) {
      osis = '0' + osis.toString();
    }
    let firestoreref = firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('likes');
    try {
      firestoreref.doc(osis).set({
        verseText: verseText,
        bookText: bookText,
        time: firebase.firestore.FieldValue.serverTimestamp(),
      });
      this.setState({alreadyLiked: true});
    } catch (err) {
      console.log(err);
    }
  }
}

const styles = StyleSheet.create({
  welcome: {
    paddingTop: 2 * theme.sizes.padding,
    paddingHorizontal: theme.sizes.padding,
    backgroundColor: theme.colors.bg,
    flex: 1,
  },
  // horizontal line
  hLine: {
    marginVertical: theme.sizes.base * 2,
    marginHorizontal: theme.sizes.base * 2,
    height: 1,
  },
});
