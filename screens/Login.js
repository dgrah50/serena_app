import React, {Component} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Dimensions,
  Alert,
  View,
  StyleSheet,
} from 'react-native';
import firebase from 'react-native-firebase';
import {AccessToken, LoginManager} from 'react-native-fbsdk';
import {Button, Block, Text, Input} from '../components';
import Icon from 'react-native-vector-icons/FontAwesome';
import {theme, mocks, time} from '../constants';
import LottieView from 'lottie-react-native';

import Swiper from '../components/Swiper';
import {ThemeColors} from 'react-navigation';

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
      <Block style={styles.onboarding}>
        <Image
          resizeMode="contain"
          source={require('../assets/images/Base/Logobig.png')}
          style={{height: 40, width: width, position: 'absolute', top: '10%'}}
        />
        <Block flex={false} center middle style={{marginBottom: 20}}>
          <LottieView
            style={{width: width * 0.6}}
            source={require('../assets/anims/levitate.json')}
            autoPlay
            loop
          />
        </Block>
        <Block flex={false} style={{paddingHorizontal: '15%'}}>
          <Text h2 black center style={{marginBottom: 40}}>
            Welcome {'\n'} to Serena
          </Text>
          <Text title black center>
            Find the perfect Bible verse for you at instantly. Just say what's
            on your mind.
          </Text>
        </Block>
        <Block flex={false} center style={styles.paginationRow}>
          <Button
            style={styles.buttonStyle}
            onPress={() => this.setState({screen: 1})}>
            <Text white> CONTINUE </Text>
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
        <Block flex={false} center middle style={{marginBottom: 20}}>
          <LottieView
            style={{width: width * 0.6}}
            source={require('../assets/anims/happydude.json')}
            autoPlay
            loop
          />
        </Block>
        <Block flex={false} style={{paddingHorizontal: '15%'}}>
          <Text h2 black center style={{marginBottom: 40}}>
            Personalised {'\n'} for You.
          </Text>
          <Text title black center>
            Serena is designed to recommend sermons for you. Please allow Serena
            to access your microphone in order to enable voice search.
          </Text>
        </Block>
        <Block flex={false} center style={styles.paginationRow}>
          <Button
            style={styles.buttonStyle}
            onPress={() => this.setState({screen: 2})}>
            <Text white> ALLOW MICROPHONE ACCESS </Text>
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
            style={{width: width * 0.6}}
            source={require('../assets/anims/womanonphone.json')}
            autoPlay
            loop
          />
        </Block>
        <Block flex={false} style={{paddingHorizontal: '15%'}}>
          <Text h2 black center style={{marginBottom: 40}}>
            Share with friends and family.
          </Text>
          <Text title black center>
            Filler text
          </Text>
        </Block>
        <Block
          flex={false}
          center
          style={[styles.paginationRow, {height: '20%'}]}>
          <Block flex={false} row style={{width: '80%', height: '50%'}}>
            <Button
              style={[styles.buttonStyle, {width: '50%', marginBottom: 0}]}
              onPress={() => this.props.navigation.navigate('EmailLogin')}>
              <Text white> LOG IN WITH EMAIL </Text>
            </Button>
            <Button
              style={[styles.buttonStyle, {width: '50%', marginBottom: 0}]}
              onPress={() => this.props.navigation.navigate('Register')}>
              <Text white> SIGN UP WITH EMAIL </Text>
            </Button>
          </Block>

          <Button
            style={[styles.buttonStyle, {backgroundColor: '#3b5998'}]}
            onPress={() => this.facebookLogin()}>
            <Text white> CONTINUE WITH FACEBOOK </Text>
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
    flex: 1,
    backgroundColor: theme.colors.bg,
    paddingTop: '40%',
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
    height: '10%',
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
