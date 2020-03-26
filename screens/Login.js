import React, {Component} from 'react';
import {
  Image,
  Dimensions,
  Alert,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import firebase from 'react-native-firebase';
import {AccessToken, LoginManager} from 'react-native-fbsdk';
import {Button, Block, Card, Text} from '../components';
import {theme} from '../constants';
import LottieView from 'lottie-react-native';
import {request, PERMISSIONS} from 'react-native-permissions';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import * as Animatable from 'react-native-animatable';
AnimatedBlock = Animatable.createAnimatableComponent(Block);
const {height, width} = Dimensions.get('window');

const anim = [
  require('../assets/anims/levitate.json'),
  require('../assets/anims/happydude.json'),
  require('../assets/anims/womanonphone2.json'),
];
const bigCaption = ['Discover', 'Speak', 'Share'];
const caption = [
  'Serena recommends Bible verses, sermons & podcasts just for you',
  'Enable microphone access, and you can even speak aloud to Serena',
  'Receive a daily Bible Verse and share with your friends to spread the word of God',
];

class Onboarding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: 0,
    };
  }
  componentDidUpdate() {
    if (this.state.screen == 0) {
      this.buttons0.fadeIn(1500);
    } else if (this.state.screen == 1) {
      this.buttons1.fadeIn(1500);
    } else if (this.state.screen == 2) {
      this.buttons2.fadeIn(1500);
    }
  }

  render() {
    return (
      <Block flex={false} center middle style={styles.onboarding}>
        <Carousel
          ref={c => {
            this._carousel = c;
          }}
          layout={'default'}
          lockScrollTimeoutDuration={3000}
          // scrollEnabled={false}
          onSnapToItem={index => {
            if (index != this.state.screen) {
              this.setState({screen: index});
            }
          }}
          data={['a', 'b', 'c']}
          renderItem={this._renderItem}
          sliderWidth={width}
          itemWidth={width}
          activeAnimationOptions={{
            duration:1500
          }}
        />
        {/* </Block> */}

        {this._renderDots()}
        {this._renderButton()}
      </Block>
    );
  }

  _renderItem = ({item, index}) => {
    return (
      <>
        <Card shadow center flex={false} style={{marginHorizontal: 20}}>
          <Image
            resizeMode="contain"
            source={require('../assets/images/Base/Logobig.png')}
            style={{height: 40, width: width}}
          />

          <LottieView
            style={{width: width * 0.5}}
            source={anim[index]}
            autoPlay
            loop
          />
          <Block flex={false}>
            <Text h2 bold black right>
              {bigCaption[index]}
            </Text>
          </Block>
        </Card>
        <Block>
          <Text title black center style={{paddingHorizontal: '5%'}}>
            {caption[index]}
          </Text>
        </Block>
      </>
    );
  };

  _renderDots() {
    return (
      <Pagination
        dotsLength={3}
        activeDotIndex={this.state.screen}
        dotColor={'rgba(255, 255, 255, 0.92)'}
        dotStyle={styles.paginationDot}
        containerStyle={styles.paginationContainer}
        inactiveDotColor={theme.colors.black}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        carouselRef={this._carousel}
        tappableDots={false}
      />
    );
  }

  _renderButton() {
    switch (this.state.screen) {
      case 0:
        return (
          <Animatable.View
            ref={ci => (this.buttons0 = ci)}

            center
            justifyContent={'flex-end'}
            style={[styles.paginationRow, {height: '25%'}]}>
            <Button
              style={styles.buttonStyle}
              onPress={() =>
                this.setState({screen: 1}, () => this._carousel.snapToItem(1))
              }>
              <Text button white>
                {' '}
                CONTINUE{' '}
              </Text>
            </Button>
          </Animatable.View>
        );
      case 1:
        return (
          <Animatable.View
            ref={ci => (this.buttons1 = ci)}

            center
            justifyContent={'flex-end'}
            style={[styles.paginationRow, {height: '25%'}]}>
            <Button
              style={styles.buttonStyle}
              onPress={() => this.requestPermissions()}>
              <Text button white>
                {' '}
                ALLOW MICROPHONE ACCESS{' '}
              </Text>
            </Button>
          </Animatable.View>
        );
      case 2:
        return (
          <Animatable.View
            ref={ci => (this.buttons2 = ci)}
            delay={300}

            center
            justifyContent={'flex-end'}
            style={[styles.paginationRow]}>
            <Block flex={false} row style={{width: '100%', marginBottom: 5}}>
              <Block center middle style={{width: '45%', paddingRight: 5}}>
                <Button
                  style={[styles.buttonStyle]}
                  onPress={() => this.props.navigation.navigate('EmailLogin')}>
                  <Text button white>
                    LOG IN
                  </Text>
                </Button>
              </Block>

              <Block center middle style={{width: '45%', paddingLeft: 5}}>
                <Button
                  style={[styles.buttonStyle]}
                  onPress={() => this.props.navigation.navigate('Register')}>
                  <Text button white>
                    SIGN UP
                  </Text>
                </Button>
              </Block>
            </Block>

            <Block center middle style={[{width: '100%'}]}>
              <Button
                style={[styles.buttonStyle, {backgroundColor: '#3b5998'}]}
                onPress={() => this.facebookLogin()}>
                <Text button white>
                  FACEBOOK
                </Text>
              </Button>
            </Block>
          </Animatable.View>
        );
      default:
        return this._renderScreen0();
    }
  }

  requestPermissions() {
    if (Platform.OS === 'android') {
      request(PERMISSIONS.ANDROID.RECORD_AUDIO).then(result => {
        this.setState({screen: 2}, () => this._carousel.snapToItem(2));
      });
    } else {
      request(PERMISSIONS.IOS.SPEECH_RECOGNITION).then(result => {
        this.setState({screen: 2}, () => this._carousel.snapToItem(2));
      });
    }
  }

  async facebookLogin() {
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
      if (result.isCancelled) {
        // handle this however suites the flow of your app
        // throw new Error('User cancelled request');
        return null;
      }
      console.log(
        `Login success with permissions: ${result.grantedPermissions.toString()}`,
      );

      // get the access token
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        // handle this however suites the flow of your app
        throw new Error(
          'Something went wrong obtaining the users access token',
        );
      }

      // create a new firebase credential with the token
      const credential = firebase.auth.FacebookAuthProvider.credential(
        data.accessToken,
      );

      // login with credential
      const firebaseUserCredential = await firebase
        .auth()
        .signInWithCredential(credential);

      let firestoreref = firebase
        .firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .collection('Info');
      try {
        await firestoreref.doc('fullName').set({
          fullname: firebaseUserCredential.user.toJSON().displayName,
        });
        await firestoreref.doc('groups').set(
          {
            subscribed: firebase.firestore.FieldValue.arrayUnion('Serena'),
          },
          {merge: true},
        );
      } catch (err) {
        console.log(err);
      }
    } catch (e) {
      console.log(e);
    }
  }

  onLoginFail(err) {
    this.setState({err, loading: false});
    Alert.alert(err.toString(), 'Try again!', [{text: 'OK'}], {
      cancelable: false,
    });
  }
}

const styles = StyleSheet.create({
  onboarding: {
    width: '100%',
    // flex: 1,
    height: '100%',
    backgroundColor: theme.colors.bg,
    paddingTop: '20%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paginationContainer: {
    paddingVertical: 8,
    position: 'absolute',
    bottom: '30%',
  },
  paginationDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  paginationRow: {
    position: 'absolute',
    bottom: '10%',
    width: '100%',
    paddingHorizontal: '10%',
  },
  buttonStyle: {
    backgroundColor: theme.colors.primary,
    width: '100%',
    borderRadius: theme.sizes.border,
  },
});

export default Onboarding;
