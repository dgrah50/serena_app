import React, {Component} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Share,
} from 'react-native';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import {Block, Card, Text} from '../components';
import {theme} from '../constants';
import {Bars} from 'react-native-loader';

export default class OneVerse extends Component {
 
  constructor(props) {
    super(props);
    this.state = {
      sermons: undefined,
    };
    this.onShare = this.onShare.bind(this);
  }

  componentDidMount() {
    this.setState({
      sermons: this.props.navigation.getParam('response').sermons.current,
    });
  }

  render() {
    return (
      <LinearGradient
        colors={['rgba(76, 102, 159, 0.4)', 'rgba(76, 102, 159, 0.8)']}
        style={styles.welcome}>
        {this._renderVerseCard()}
        <Block>
          {this.state.sermons ? this._renderSermons() : this._renderSpinner()}
        </Block>
      </LinearGradient>
    );
  }

  //****** SUB COMPONENTS SECTION
  _renderVerseCard() {
    let navprop = this.props.navigation.getParam('response').verses;
    let verses = [
      {
        verse:
          'You will seek Me and find Me when you search for Me with all your heart.',
        bookname: 'Jeremiah 29:13',
      },
    ];
    if (navprop.length != 0) {
      verses = navprop;
    }

    return (
      <Card flex={false} shadow>
        <Block flex={false}>
          <Block flex={false} center>
            <Text h2 style={{marginVertical: 8}}>
              {verses[0].verse}
            </Text>
          </Block>
          <Block flex={false} center>
            <Text h3 style={{marginVertical: 8}}>
              {verses[0].bookname}
            </Text>
          </Block>
        </Block>
        <Block flex={false} row middle space={'between'}>
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
        </Block>
      </Card>
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
  _renderSermons() {
    return (
      <Block>
        <Text h3 spacing={1} style={{marginVertical: 8}}>
          Related Sermons
        </Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.state.sermons.map((sermon, idx) => {
            return this._renderItem(sermon, idx);
          })}
        </ScrollView>
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
    backgroundColor: theme.colors.gray4,
    flex:1,
  },
  // horizontal line
  hLine: {
    marginVertical: theme.sizes.base * 2,
    marginHorizontal: theme.sizes.base * 2,
    height: 1,
  },
});
