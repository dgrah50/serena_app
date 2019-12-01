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
        {this._renderSerenaHeader()}
        {this._renderButtons()}
      </KeyboardAvoidingView>
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
        <Block row middle center space={'between'} style={{marginHorizontal:"10%",marginBottom:20}}> 
          <Button shadow onPress={() => this.props.navigation.navigate('EmailLogin')}
            style={{width: width * 0.35, backgroundColor: theme.colors.white}}>
            {/* <Icon name="facebook-f" size={30} color="#fff" /> */}
            <Text button black>
              LOG IN
            </Text>
          </Button>
          <Button shadow onPress={() => this.props.navigation.navigate('Register')}
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

  onLoginFacebookPress() {
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
