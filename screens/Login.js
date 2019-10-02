import React, {Component} from 'react';
import {Image, KeyboardAvoidingView, Dimensions, Alert} from 'react-native';
import firebase from 'react-native-firebase';
import {Button, Block, Text, Input} from '../components';

const {height} = Dimensions.get('window');

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
          <Block flex={2.5} center>
            <Text h3 style={{marginBottom: 6}}>
              Sign in to Serena
            </Text>
            <Text paragraph color="black3">
              Please enter your credentials to proceed.
            </Text>
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
                    color="gray"
                    onPress={() => navigation.navigate('Forgot')}>
                    Forgot password?
                  </Text>
                }
              />

              <Button
                full
                style={{marginBottom: 12}}
                onPress={() => this.onLoginPress()}>
                <Text button>Sign in</Text>
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
      .then(this.onLoginSuccess.bind(this))
      .catch((err) => {
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
