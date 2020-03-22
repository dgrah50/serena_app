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
  constructor(props) {
    super(props);
    this.state = {
      emailAddress: null,
    };
  }
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
              resizeMode="contain"
              style={{height: 28}}
            />
          </Block>
          <Block style={{flex: 2.5}} center>
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
                  onPress={() => this.props.navigation.navigate('Login')}>
                  SIGN UP
                </Text>
              </Text>
            </Block>
          </Block>
        </Block>
      </KeyboardAvoidingView>
    );
  }



  //****** HELPER FUNCTIONS SECTION
  emailAddressTextHandler = e => {
    this.setState({
      emailAddress: e,
    });
  };
  
  forgotPassword = yourEmail => {
    if (!this.state.emailAddress) {
      Alert.alert('Incomplete details entered ', 'Try again!', [{text: 'OK'}], {
        cancelable: false,
      });
    } else {
      firebase
        .auth()
        .sendPasswordResetEmail(yourEmail)
        .then(function(user) {
          alert('Please check your email.');
        })
        .catch(function(err) {
          Alert.alert(err.toString(), 'Try again!', [{text: 'OK'}], {
            cancelable: false,
          });
        });
    }
  };
}

export default Forgot;
