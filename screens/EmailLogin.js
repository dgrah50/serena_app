import React, {Component} from 'react';
import {Image, KeyboardAvoidingView, Dimensions, Alert} from 'react-native';
import firebase from 'react-native-firebase';
import {Button, Block, Text, Input} from '../components';
import Icon from 'react-native-vector-icons/FontAwesome';
import {theme, mocks, time} from '../constants';

const {height, width} = Dimensions.get('window');

class EmailLogin extends Component {
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
            <Text h2 white center>
              Log in {'\n'} {'\n'}
              <Text h3 white center>
                Find the right scripture or sermon for you. {'\n'}
                Any time, any place.
              </Text>
            </Text>
          </Block>

          <Block flex={3.5}>
            <Block center style={{marginTop: 44}}>
              <Input
                full
                email
                label="Email address"
                style={{
                  marginBottom: 25,
                  color: theme.colors.white,
                  borderColor: theme.colors.white,
                }}
                onChangeTextHandler={this.emailAddressTextHandler}
              />
              <Input
                full
                password
                label="Password"
                style={{
                  marginBottom: 25,
                  color: theme.colors.white,
                  borderColor: theme.colors.white,
                }}
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
                  backgroundColor: theme.colors.white,
                }}
                onPress={() => this.onLoginPress()}>
                <Text button black>
                  LOG IN
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

export default EmailLogin;
