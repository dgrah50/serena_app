import React, {Component} from 'react';
import {Image, KeyboardAvoidingView, Dimensions, Alert} from 'react-native';
import firebase from 'react-native-firebase';
import {AccessToken, LoginManager} from 'react-native-fbsdk';
import {Button, Block, Text, Input} from '../components';
import Icon from 'react-native-vector-icons/FontAwesome';
import {theme, mocks, time} from '../constants';
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';

const {height, width} = Dimensions.get('window');

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showOnboarding: false,
    };
  }

  render() {
    const {navigation} = this.props;
    return this.state.showOnboarding
      ? this._renderLoginView()
      : this._renderOnboarding();
  }

  //****** SUB COMPONENTS SECTION

  _renderLoginView() {
    return (
      <KeyboardAvoidingView
        enabled
        behavior="padding"
        style={{flex: 1, backgroundColor: theme.colors.black}}
        keyboardVerticalOffset={height * 0.2}>
        {this._renderSerenaHeader()}
        {this._renderButtons()}
      </KeyboardAvoidingView>
    );
  }
  _renderOnboarding() {
    return (
      <Onboarding
        pages={[
          {
            backgroundColor: '#fff',
            image: (
              <LottieView
                style={{width: 500}}
                source={require('../assets/anims/happydude.json')}
                autoPlay
                loop
              />
            ),
            title: 'Simple Messenger UI',
            subtitle: 'Implemented in React Native',
          },
          {
            backgroundColor: '#fff',
            image: (
              <LottieView
                style={{width: 500}}
                source={require('../assets/anims/levitate.json')}
                autoPlay
                loop
              />
            ),
            title: 'Welcome',
            subtitle: 'To Earth',
          },
          {
            backgroundColor: '#fff',
            image: (
              <LottieView
                style={{width: 500}}
                source={require('../assets/anims/womanonphone.json')}
                autoPlay
                loop
              />
            ),
            title: 'Also',
            subtitle: 'Mars is nice',
          },
        ]}
      />
    );
  }

  _renderSerenaHeader() {
    return (
      <Block center space={'between'} style={{top: '10%'}}>
        <Block
          flex={false}
          center
          middle
          style={{marginVertical: '10%', height: '30%'}}>
          <Image
            source={require('../assets/images/Base/Logobig.png')}
            style={{height: 56, width: 204, marginVertical: '10%'}}
          />
          <Text h2 white center>
            Welcome back to Serena. {'\n'} {'\n'}
            <Text h3 white center>
              Find the right scripture or sermon for you. {'\n'}
              Any time, any place.
            </Text>
          </Text>
        </Block>
      </Block>
    );
  }

  _renderButtons() {
    return (
      <Block flex={false} style={{height: '20%', marginBottom: '10%'}}>
        <Block
          row
          middle
          center
          space={'between'}
          style={{marginHorizontal: '10%', marginBottom: 20}}>
          <Button
            shadow
            onPress={() => this.props.navigation.navigate('EmailLogin')}
            style={{width: width * 0.35, backgroundColor: theme.colors.white}}>
            {/* <Icon name="facebook-f" size={30} color="#fff" /> */}
            <Text button black>
              LOG IN
            </Text>
          </Button>
          <Button
            shadow
            onPress={() => this.props.navigation.navigate('Register')}
            style={{width: width * 0.35, backgroundColor: theme.colors.white}}>
            <Text button black>
              SIGN UP
            </Text>
          </Button>
        </Block>
        <Block row middle center>
          <Button
            shadow
            onPress={() => this.facebookLogin()}
            style={{width: width * 0.8, backgroundColor: '#3b5998'}}>
            {/* <Icon name="facebook-f" size={30} color="#fff" /> */}
            <Text button white>
              CONTINUE WITH FACEBOOK
            </Text>
          </Button>
        </Block>
      </Block>
    );
  }

  //****** HELPER FUNCTIONS SECTION
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

      console.log(JSON.stringify(firebaseUserCredential.user.toJSON()));
    } catch (e) {
      console.error(e);
    }
  }

  onLoginFail(err) {
    this.setState({err, loading: false});
    Alert.alert(err, 'Try again!', [{text: 'OK'}], {
      cancelable: false,
    });
  }
  onLoginSuccess() {
    navigation.navigate('Overview');
  }
}

export default Login;
