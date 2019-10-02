import React, {Component} from 'react';
import {
  Image,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import firebase from 'react-native-firebase';
import {Button, Block, Text, Input} from '../components';
import * as theme from '../constants/theme';

const {height} = Dimensions.get('window');

class Register extends Component {
  state = {
    active: null,
  };

  handleType = id => {
    const {active} = this.state;
    this.setState({active: active === id ? null : id});
  };

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
  nameTextHandler = e => {
    this.setState({
      name: e,
    });
  };

  onSignupPress() {
    firebase
      .auth()
      .createUserWithEmailAndPassword(
        this.state.emailAddress,
        this.state.password,
      )
      // .then(userCredentials => {
      //   if (userCredentials.user) {
      //     userCredentials.user
      //       .updateProfile({
      //         displayName: this.state.name,
      //       })
            // .then(this.onSignupSuccess.bind(this));
        // }
      // })
      .catch(err => {
        this.creationFailure(err).bind(this);
      });
  }

  onSignupSuccess() {
    navigation.navigate('Overview');
  }

  creationFailure(err) {
    this.setState({error: err, loading: false});
    Alert.alert(
      'Account creation failed. ' + err,
      'Try again!',
      [{text: 'OK'}],
      {
        cancelable: false,
      },
    );
  }

  render() {
    const {navigation} = this.props;
    const {active} = this.state;

    const adminIcon = (
      <Image
        source={require('../assets/images/icons/energy.png')}
        style={{height: 16, width: 14}}
      />
    );

    const operatorIcon = (
      <Image
        source={require('../assets/images/icons/message.png')}
        style={{height: 14, width: 14}}
      />
    );

    const checkIcon = (
      <Image
        source={require('../assets/images/icons/check.png')}
        style={{height: 18, width: 18}}
      />
    );

    return (
      <KeyboardAwareScrollView
        style={{marginVertical: 40}}
        showsVerticalScrollIndicator={false}>
        <Block center middle style={{marginBottom: 30, marginTop: 30}}>
          <Image
            source={require('../assets/images/Base/Logo.png')}
            style={{height: 28, width: 102}}
          />
        </Block>
        <Block flex center>
          <Text h3 style={{marginBottom: 6}}>
            Get started for free
          </Text>
          <Text paragraph color="black3">
            Free forever. No credit card needed.
          </Text>
          <Block row style={{marginHorizontal: 28, marginTop: 40}}>
            <TouchableWithoutFeedback
              onPress={() => this.handleType('administrator')}
              style={active === 'administrator' ? styles.activeBorder : null}>
              <Block
                center
                middle
                style={[
                  styles.card,
                  {marginRight: 20},
                  active === 'administrator' ? styles.active : null,
                ]}>
                {active === 'administrator' ? (
                  <Block center middle style={styles.check}>
                    {checkIcon}
                  </Block>
                ) : null}
                <Block center middle style={styles.icon}>
                  {adminIcon}
                </Block>
                <Text h4 style={{marginBottom: 11}}>
                  Administrator
                </Text>
                <Text paragraph center color="black3">
                  Full access to all settings
                </Text>
              </Block>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={() => this.handleType('operator')}
              style={active === 'operator' ? styles.activeBorder : null}>
              <Block
                center
                middle
                style={[
                  styles.card,
                  active === 'operator' ? styles.active : null,
                ]}>
                {active === 'operator' ? (
                  <Block center middle style={styles.check}>
                    {checkIcon}
                  </Block>
                ) : null}
                <Block center middle style={styles.icon}>
                  {operatorIcon}
                </Block>
                <Text h4 style={{marginBottom: 11}}>
                  Operator
                </Text>
                <Text paragraph center color="black3">
                  Service desk and chat permissions
                </Text>
              </Block>
            </TouchableWithoutFeedback>
          </Block>
          <Block center style={{marginTop: 25}}>
            <Input
              full
              label="Full name"
              style={{marginBottom: 25}}
              onChangeTextHandler={this.nameTextHandler}
            />
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
            />

            <Button
              full
              style={{marginBottom: 12}}
              onPress={() => this.onSignupPress()}>
              <Text button>Create Account</Text>
            </Button>
            <Text paragraph color="gray">
              Already have an account?{' '}
              <Text
                height={18}
                color="blue"
                onPress={() => navigation.navigate('Login')}>
                Sign in
              </Text>
            </Text>
          </Block>
        </Block>
      </KeyboardAwareScrollView>
    );
  }
}

export default Register;

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 5,
    backgroundColor: theme.colors.white,
  },
  active: {
    borderColor: theme.colors.blue,
    shadowOffset: {width: 0, height: 0},
    shadowColor: theme.colors.lightblue,
    shadowRadius: 3,
    shadowOpacity: 1,
  },
  icon: {
    flex: 0,
    height: 48,
    width: 48,
    borderRadius: 48,
    marginBottom: 15,
    backgroundColor: theme.colors.lightblue,
  },
  check: {
    position: 'absolute',
    right: -9,
    top: -9,
  },
});
