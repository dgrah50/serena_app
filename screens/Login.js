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
import {Button, Block, Text} from '../components';
import {theme} from '../constants';
import LottieView from 'lottie-react-native';
import {request, PERMISSIONS} from 'react-native-permissions';

const {height, width} = Dimensions.get('window');

class Onboarding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: 0,
    };
  }

  render() {
    switch (this.state.screen) {
      case 0:
        return this._renderScreen0();
      case 1:
        return this._renderScreen1();
      case 2:
        return this._renderScreen2();
      default:
        return this._renderScreen0();
    }
  }

  _renderScreen0() {
    return (
      <Block style={styles.onboarding} flex={false}>
        <Image
          resizeMode="contain"
          source={require('../assets/images/Base/Logobig.png')}
          style={{height: 40, width: width, position: 'absolute', top: '10%'}}
        />
        <Block flex={false} center style={{marginBottom: 20}}>
          <LottieView
            style={{width: width * 0.5}}
            source={require('../assets/anims/levitate.json')}
            autoPlay
            loop
          />
        </Block>
        <Block flex={false} style={{paddingHorizontal: '5%'}}>
          <Text h2 black center style={{marginBottom: 20}}>
            Welcome {'\n'} to Serena
          </Text>
          <Text black center>
            We want to help every Christian feel closer to God, and live the
            happiest, most fulfilling life.
          </Text>
        </Block>
        <Block flex={false} center middle style={styles.paginationRow}>
          <Button
            style={styles.buttonStyle}
            onPress={() => this.setState({screen: 1})}>
            <Text button white>
              {' '}
              CONTINUE{' '}
            </Text>
          </Button>
          <Dots
            isLight={true}
            numPages={3}
            currentPage={this.state.screen}
            Dot={Dot}
            style={styles.dots}
          />
        </Block>
      </Block>
    );
  }
  _renderScreen1() {
    return (
      <Block style={styles.onboarding}>
        <Image
          resizeMode="contain"
          source={require('../assets/images/Base/Logobig.png')}
          style={{height: 40, width: width, position: 'absolute', top: '10%'}}
        />
        <Block flex={false} space={'between'} style={{height: height * 0.6}}>
          <Block
            flex={false}
            center
            middle
            style={{
              marginBottom: 20,
              height: width * 0.5,
            }}>
            <LottieView
              style={{width: width * 0.5}}
              source={require('../assets/anims/happydude.json')}
              autoPlay
              loop
            />
          </Block>
          <Text h2 black center style={{margin: 20}}>
            Personalised {'\n'} for You.
          </Text>
          <Block
            flex={false}
            style={{
              padding: '2.5%',
              height: width * 0.5,
            }}>
            <Text black center>
              Serena recommends Bible verses, sermons & podcasts just for you.
              Enable microphone access, and you can even speak aloud to Serena.
            </Text>
          </Block>
        </Block>

        <Block flex={false} center style={styles.paginationRow}>
          <Button
            style={styles.buttonStyle}
            onPress={() => this.requestPermissions()}>
            <Text button white>
              {' '}
              ALLOW MICROPHONE ACCESS{' '}
            </Text>
          </Button>
          <Dots
            isLight={true}
            numPages={3}
            currentPage={this.state.screen}
            Dot={Dot}
            style={styles.dots}
          />
        </Block>
      </Block>
    );
  }
  _renderScreen2() {
    return (
      <Block style={styles.onboarding}>
        <Image
          resizeMode="contain"
          source={require('../assets/images/Base/Logobig.png')}
          style={{height: 40, width: width, position: 'absolute', top: '10%'}}
        />
        <Block flex={false} center middle style={{marginBottom: 20}}>
          <LottieView
            style={{width: width * 0.5}}
            source={require('../assets/anims/womanonphone.json')}
            autoPlay
            loop
          />
        </Block>
        <Block flex={false} style={{paddingHorizontal: '5%'}}>
          <Text h2 black center style={{marginBottom: 20}}>
            Share with friends and family.
          </Text>
          <Text black center>
            Receive a daily Bible Verse and share with your friends to spread
            the word of God.
          </Text>
        </Block>
        <Block
          flex={false}
          center
          justifyContent={'flex-end'}
          style={[styles.paginationRow, {height: '25%'}]}>
          <Block flex={false} row style={{width: '80%'}}>
            <Button
              style={[styles.buttonStyle, {width: '50%', marginBottom: 0}]}
              onPress={() => this.props.navigation.navigate('EmailLogin')}>
              <Text button white>
                LOG IN
              </Text>
            </Button>
            <Button
              style={[styles.buttonStyle, {width: '50%', marginBottom: 0}]}
              onPress={() => this.props.navigation.navigate('Register')}>
              <Text button white>
                SIGN UP
              </Text>
            </Button>
          </Block>

          <Button
            style={[styles.buttonStyle, {backgroundColor: '#3b5998'}]}
            onPress={() => this.facebookLogin()}>
            <Text button white>
              OR CONTINUE WITH FACEBOOK
            </Text>
          </Button>
          <Dots
            isLight={true}
            numPages={3}
            currentPage={this.state.screen}
            Dot={Dot}
            style={styles.dots}
          />
        </Block>
      </Block>
    );
  }

  requestPermissions() {
    if (Platform.OS === 'android') {
      request(PERMISSIONS.ANDROID.RECORD_AUDIO).then(result => {
        this.setState({screen: 2});
      });
    } else {
      request(PERMISSIONS.IOS.SPEECH_RECOGNITION).then(result => {
        this.setState({screen: 2});
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

const Dots = ({isLight, numPages, currentPage, Dot}) => (
  <View style={styles.container}>
    {[...Array(numPages)].map((_, index) => (
      <Dot key={index} selected={index === currentPage} isLight={isLight} />
    ))}
  </View>
);

const Dot = ({isLight, selected}) => {
  let backgroundColor;
  if (isLight) {
    backgroundColor = selected ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.3)';
  } else {
    backgroundColor = selected ? '#fff' : 'rgba(255, 255, 255, 0.5)';
  }
  return (
    <View
      style={{
        ...styles.dot,
        backgroundColor,
      }}
    />
  );
};

const styles = StyleSheet.create({
  onboarding: {
    width: '100%',
    // flex: 1,
    height: '100%',
    backgroundColor: theme.colors.bg,
    paddingTop: '30%',
  },
  container: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
    backgroundColor: 'red',
  },
  paginationRow: {
    position: 'absolute',
    bottom: '10%',
    width: '100%',
    paddingHorizontal: '10%',
  },
  buttonStyle: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.white,
    borderWidth: 2,
    marginBottom: 10,
    width: '80%',
  },
});

export default Onboarding;
