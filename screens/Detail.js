import React, {Component} from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  AsyncStorage,
} from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {Block, Text} from '../components';
import {theme} from '../constants';
import Share from 'react-native-share';
import firebase from 'react-native-firebase';
import ViewShot, {captureRef} from 'react-native-view-shot';
import {Coachmark, CoachmarkComposer} from 'react-native-coachmark';

const {width} = Dimensions.get('window');

export default class Detail extends Component {
  constructor(props) {
    super(props);
    console.log();
    this.state = {
      alreadyLiked: false,
      showButtons: true,
      micCoach2: false,
    };
    this.coachmark1 = React.createRef();
  }

  componentDidMount(props) {
    if (this.props.navigation.getParam('alreadyLiked')) {
      this.setState({alreadyLiked: true});
    }
    const composer = new CoachmarkComposer([this.coachmark1]);
    AsyncStorage.getItem('micCoach2')
      .then(value => {
        console.log(value);
        if (value == null) {
          composer.show();
          this.setState({micCoach2: true});
        }
      })
      .catch(err => {
        console.log(err);
        composer.show();
        this.setState({micCoach2: true});
      });
  }

  componentDidUpdate() {
    if (this.state.micCoach2) {
      AsyncStorage.setItem('micCoach2', JSON.stringify('true')).catch(err =>
        console.log(err),
      );
    }
  }

  render() {
    let verse = this.props.navigation.getParam('verse');
    let imageIndex = this.props.navigation.getParam('imageIndex');

    return (
      <>
        <ViewShot ref="viewShot">
          <ImageBackground
            style={{width: '100%'}}
            source={theme.randomImages[imageIndex]}>
            <Block
              flex={false}
              center
              middle
              style={{
                height: '100%',
                borderRadius: theme.sizes.border,
              }}>
              {this.state.showButtons && this._renderTopButtons()}
              {this._renderBibleText(verse)}
            </Block>
          </ImageBackground>
        </ViewShot>
        {this._renderLikeAndShare(verse)}
      </>
    );
  }

  _renderTopButtons() {
    return (
      <>
        <TouchableOpacity
          hitSlop={{
            bottom: 100,
            left: 100,
            right: 100,
            top: 100,
          }}
          style={{
            height: 6,
            borderRadius: 3,
            width: width * 0.3,
            top: '5%',
            backgroundColor: 'white',
            marginHorizontal: width * 0.35,
            marginTop: 5,
            marginBottom: 15,
            position: 'absolute',
          }}
          onPress={() => {
            this.props.navigation.goBack();
            this.props.navigation.state.params.cardToggle(
              this.state.alreadyLiked,
            );
          }}
        />
        <TouchableOpacity
          hitSlop={{
            bottom: 100,
            left: 100,
            right: 100,
            top: 100,
          }}
          onPress={() => {
            console.log('test');
            this.props.navigation.goBack();
            this.props.navigation.state.params.cardToggle(
              this.state.alreadyLiked,
            );
          }}
          style={{
            position: 'absolute',
            top: 50,
            left: 30,
          }}>
          <Icon name="arrow-left" light size={35} color={theme.colors.white} />
        </TouchableOpacity>
      </>
    );
  }
  _renderBibleText(verse) {
    return (
      <Block flex={false}>
        <Block flex={false} center>
          <Text
            white
            center
            style={{
              marginVertical: 8,
              marginHorizontal: 15,
              fontSize: 0.07 * width,
            }}>
            {verse.verse}
          </Text>
          <Text h3 white center style={{marginVertical: 8}}>
            {verse.bookname}
          </Text>
          <Image
            source={require('../assets/images/whiteicon.png')}
            resizeMode="cover"
            style={{
              height: 40,
              width: 40,
              bottom: 0,
            }}
          />
        </Block>
      </Block>
    );
  }
  _renderLikeAndShare(verse) {
    return (
      <Block
        flex={false}
        row
        middle
        style={{
          width: '100%',
          position: 'absolute',
          bottom: 25,
          paddingHorizontal: '5%',
        }}
        space={'between'}>
        <TouchableOpacity
          onPress={() =>
            this.toggleFavourites(verse.verse, verse.bookname, verse.osis)
          }>
          <Icon
            name="heart"
            solid={this.state.alreadyLiked}
            size={40}
            color={theme.colors.white}
            style={{marginLeft: 10}}></Icon>
        </TouchableOpacity>
        <Coachmark
          ref={this.coachmark1}
          message="Click here to share this verse!">
          <TouchableOpacity>
            <Icon
              name="paper-plane"
              size={40}
              color={theme.colors.white}
              style={{marginRight: 10}}
              onPress={() =>
                this.onShare(
                  verse.verse +
                    ' ' +
                    verse.bookname +
                    '. I found this verse with the Serena app - download it here : http://onelink.to/yq89j8',
                )
              }></Icon>
          </TouchableOpacity>
        </Coachmark>
      </Block>
    );
  }
  async toggleFavourites(verseText, bookText, osis) {
    osis = osis.toString();
    if (osis.length == 7) {
      osis = '0' + osis.toString();
    }
    let firestoreref = firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('likes');
    if (!this.state.alreadyLiked) {
      try {
        firestoreref.doc(osis).set({
          verseText: verseText,
          bookText: bookText,
          time: firebase.firestore.FieldValue.serverTimestamp(),
        });
        this.setState({
          alreadyLiked: true,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        firestoreref.doc(osis).delete();
        this.setState({
          alreadyLiked: false,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  async onShare(message) {
    this.setState({showButtons: false}, () => {
      captureRef(this.refs.viewShot, {
        result: 'data-uri',
        quality: 0.8,
      }).then(
        uri => {
          const shareOptions = {
            title: 'Share via',
            message: message,
            url: uri,
            subject: 'Serena Verse',
            // social: Share.Social.WHATSAPP,
            // filename: 'SerenaVerseOfTheDay', // only for base64 file in Android
          };
          Share.open(shareOptions);
          this.setState({showButtons: true});
        },
        error => console.error('Oops, snapshot failed', error),
      );
    });

    // try {
    //   const result = await Share.share({
    //     message: message,
    //   });

    //   if (result.action === Share.sharedAction) {
    //     if (result.activityType) {
    //       // shared with activity type of result.activityType
    //     } else {
    //       // shared
    //     }
    //   } else if (result.action === Share.dismissedAction) {
    //     // dismissed
    //   }
    // } catch (error) {
    //   alert(error.message);
    // }
  }
}

const styles = StyleSheet.create({
  welcome: {
    paddingTop: 2 * theme.sizes.padding,
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  buttonStyle: {
    width: 125,
    height: 125,
    borderRadius: 62.5,
    backgroundColor: theme.colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyleMini: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  growingPrayerInput: {
    width: '90%',
    fontSize: 20,
    zIndex: 2,
    textAlign: 'center',
    position: Platform.OS === 'ios' ? 'relative' : 'absolute',
    color: 'rgba(255, 255, 255, 1)',
    bottom: 0,
    alignSelf: 'center',
    textAlignVertical: 'bottom',
  },
});
