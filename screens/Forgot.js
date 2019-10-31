import React, {Component} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Dimensions,
  Alert,
  StyleSheet,
} from 'react-native';
import firebase from 'react-native-firebase';
import {Button, Block, Text, Input} from '../components';
const {height} = Dimensions.get('window');

const styles = StyleSheet.create({
  forgot: {
    flex: 1,
  },
});

class Forgot extends Component {
  emailAddressTextHandler = e => {
    this.setState({
      emailAddress: e,
    });
  };

  forgotPassword = yourEmail => {
    firebase
      .auth()
      .sendPasswordResetEmail(yourEmail)
      .then(function(user) {
        alert('Please check your email.');
      })
      .catch(function(err) {
        Alert.alert(err, 'Try again!', [{text: 'OK'}], {
          cancelable: false,
        });
      });
  };

  render() {
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
              Reset password
            </Text>
            <Text paragraph>Please enter your email address.</Text>
            <Block center style={{marginTop: 44}}>
              <Input
                full
                email
                label="Email address"
                style={{marginBottom: 25}}
                onChangeTextHandler={this.emailAddressTextHandler}
              />

              <Button
                full
                style={{marginBottom: 12}}
                onPress={() => this.forgotPassword(this.state.emailAddress)}>
                <Text button>Send recovery email</Text>
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
}

export default Forgot;
