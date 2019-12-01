import React, {Component} from 'react';
import {Image, KeyboardAvoidingView, Dimensions, Alert} from 'react-native';
import firebase from 'react-native-firebase';
import {Button, Block, Text, Input} from '../components';
import Icon from 'react-native-vector-icons/FontAwesome';
import {theme, mocks, time} from '../constants';

const {height, width} = Dimensions.get('window');

class Login extends Component {
  render() {
    const {navigation} = this.props;
    return (
      <KeyboardAvoidingView
        enabled
        behavior="padding"
        style={{flex: 1, backgroundColor: theme.colors.black}}
        keyboardVerticalOffset={height * 0.2}>
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
          {this._renderButtons()}

          {/* <Block flex={3.5}>
            <Block center style={{marginTop: 44}}>
              <Input
                full
                email
                label="Email address"
                style={{marginBottom: 25}}
                onChangeTextHandler={this.emailAddressTextHandler}
              />
              <Input
                full
                password
                label="Password"
                style={{marginBottom: 25}}
                onChangeTextHandler={this.passwordTextHandler}
                rightLabel={
                  <Text
                    paragraph
                    color="red"
                    onPress={() => navigation.navigate('Forgot')}>
                    Forgot password?
                  </Text>
                }
              />

              <Button
                shadow
                style={{
                  marginBottom: 12,
                  width: width * 0.4,
                  backgroundColor: '#808080',
                }}
                onPress={() => this.onLoginPress()}>
                <Icon name="envelope" size={30} color="#fff" />
                <Text button white>
                  Or sign in with email
                </Text>
              </Button>
              <Text paragraph color="gray">
                Don't have an account?{' '}
                <Text
                  height={18}
                  color="blue"
                  onPress={() => navigation.navigate('Register')}>
                  Sign up
                </Text>
              </Text>
            </Block>
          </Block> */}
        </Block>
      </KeyboardAvoidingView>
    );
  }


  _renderButtons () {
    return (
      <Block
        flex={false}
        style={{height: '20%', marginBottom: '10%'}}>
        <Block row middle center space={'between'} >
          <Button
            shadow
            style={{width: width * 0.35, backgroundColor: theme.colors.white}}>
            {/* <Icon name="facebook-f" size={30} color="#fff" /> */}
            <Text button black>
              LOG IN
            </Text>
          </Button>
          <Button
            shadow
            style={{width: width * 0.35, backgroundColor: theme.colors.white}}>
            <Text button black>
              SIGN UP
            </Text>
          </Button>
        </Block>
        <Block row middle center>
          <Button
            shadow
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

  emailAddressTextHandler = e => {
    this.setState({
      emailAddress: e,
    });
  };
  passwordTextHandler = e => {
    this.setState({
      password: e,
    });
  };

  onLoginPress() {
    this.setState({loading: true});
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.emailAddress, this.state.password)
      .catch(err => {
        console.log(err);
        this.onLoginFail(err);
      });
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
