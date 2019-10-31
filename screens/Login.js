import React, {Component} from 'react';
import {Image, KeyboardAvoidingView, Dimensions, Alert} from 'react-native';
import firebase from 'react-native-firebase';
import {Button, Block, Text, Input} from '../components';
import Icon from 'react-native-vector-icons/FontAwesome';

const {height, width} = Dimensions.get('window');

class Login extends Component {
  render() {
    const {navigation} = this.props;
    return (
      <KeyboardAvoidingView
        enabled
        behavior="padding"
        style={{flex: 1}}
        keyboardVerticalOffset={height * 0.2}>
        <Block center middle>
          <Block middle>
            <Image
              source={require('../assets/images/Base/Logobig.png')}
              style={{height: 28, width: 102}}
            />
          </Block>
          <Block center>
            <Text h2 style={{marginBottom: 6}}>
              Welcome back to Serena
            </Text>
            <Block row middle center>
              <Button
                shadow
                style={{width: width * 0.4, backgroundColor: '#3b5998'}}>
                <Icon name="facebook-f" size={30} color="#fff" />
                <Text button white>
                  Login with Facebook
                </Text>
              </Button>
              <Button
                shadow
                style={{
                  width: width * 0.4,
                  marginLeft: width * 0.05,
                  backgroundColor: '#4285F4',
                }}>
                <Icon name="google" size={30} color="#fff" />
                <Text button white>
                  Login with Google
                </Text>
              </Button>
            </Block>
          </Block>
          <Block flex={3.5}>
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
          </Block>
        </Block>
      </KeyboardAvoidingView>
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
