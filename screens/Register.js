import React, {Component} from 'react';
import {
  Image,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import firebase from 'react-native-firebase';
import {Button, Block, Text, Input} from '../components';
import * as theme from '../constants/theme';

const {height} = Dimensions.get('window');

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailAddress: null,
      password: null,
      name: null,
    };
  }
  render() {
    const {navigation} = this.props;

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
              shadow
              style={{marginBottom: 12}}
              onPress={() => this.onSignupPress()}>
              <Text button white>
                CREATE ACCOUNT
              </Text>
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

  //****** HELPER FUNCTIONS SECTION

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
  async onSignupPress() {
    if (!this.state.emailAddress || !this.state.password || !this.state.name) {
      Alert.alert('Incomplete details entered ', 'Try again!', [{text: 'OK'}], {
        cancelable: false,
      });
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(
          this.state.emailAddress,
          this.state.password,
        )
        .then(() => {
          let firestoreref = firebase
            .firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('Info');
          try {
            firestoreref.doc('fullName').set({
              fullname: this.state.name,
            }).then()
            firestoreref.doc('groups').set(
              {
                subscribed: firebase.firestore.FieldValue.arrayUnion('Serena'),
              },
              {merge: true},
            );
          } catch (err) {
            console.log(err);
          }
        })
        .catch(err => {
          this.creationFailure(err).bind(this);
        });
    }
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
