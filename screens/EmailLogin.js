import React, {Component} from 'react';
import {Dimensions, Alert} from 'react-native';
import firebase from 'react-native-firebase';
import {Button, Block, Text, Input} from '../components';
import {theme} from '../constants';
const {width} = Dimensions.get('window');

class EmailLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailAddress: null,
      password: null
    };
  }
  render() {
    return (
      <Block
        style={{flex: 1, backgroundColor: theme.colors.gray3}}>
        {this._renderHeader()}
        {this._renderInputAndButtons()}
      </Block>
    );
  }

  //****** SUB COMPONENTS SECTION
  _renderInputAndButtons() {
    return (
      <Block  style={{flex: 3.5}} >
        <Block center style={{marginTop: 44}}>
          <Input
            full
            email
            label="Email address"
            style={{
              marginBottom: 25,
              color: theme.colors.black,
              borderColor: theme.colors.black,
            }}
            onChangeTextHandler={this.emailAddressTextHandler}
          />
          <Input
            full
            password
            label="Password"
            style={{
              marginBottom: 25,
              color: theme.colors.black,
              borderColor: theme.colors.black,
            }}
            onChangeTextHandler={this.passwordTextHandler}
            rightLabel={
              <Text
                paragraph
                color="red"
                onPress={() => this.props.navigation.navigate('Forgot')}>
                Forgot password?
              </Text>
            }
          />

          <Button
            shadow
            style={{
              marginBottom: 12,
              width: width * 0.4,
            }}
            onPress={() => this.onLoginPress()}>
            <Text button white>
              LOG IN WITH EMAIL
            </Text>
          </Button>
          <Text paragraph color="gray">
            Don't have an account?{' '}
            <Text
              height={18}
              color="blue"
              onPress={() => this.props.navigation.navigate('Login')}>
              Sign up
            </Text>
          </Text>
        </Block>
      </Block>
    );
  }
  _renderHeader() {
    return (
      <Block center space={'between'}>
        <Block
          flex={false}
          center
          middle
          style={{marginVertical: '10%', height: '30%'}}>
          <Text h2 black center>
            Log in {'\n'} {'\n'}
            <Text h3 black center>
              Find the right scripture or sermon for you. {'\n'}
              Any time, any place.
            </Text>
          </Text>
        </Block>
      </Block>
    );
  }

  //****** HELPER FUNCTIONS SECTION
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
    if (!this.state.emailAddress || !this.state.password) {
      Alert.alert('Incomplete details entered ', 'Try again!', [{text: 'OK'}], {
        cancelable: false,
      });
    } else {
      this.setState({loading: true});
      firebase
        .auth()
        .signInWithEmailAndPassword(
          this.state.emailAddress,
          this.state.password,
        )
        .catch(err => {
          console.log(err);
          this.onLoginFail(err);
        });
    }
  }
  onLoginFail(err) {
    this.setState({err, loading: false});
    console.log(err)
    Alert.alert(err.toString(), 'Try again!', [{text: 'OK'}], {
      cancelable: false,
    });
  }

  onLoginSuccess() {
    navigation.navigate('Pray');
  }
}

export default EmailLogin;
