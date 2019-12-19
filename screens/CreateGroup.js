import React, {Component} from 'react';
import axios from 'axios';
import qs from 'qs';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import rgba from 'hex-to-rgba';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {Block, Button, Badge, Card, Text, Input} from '../components';
import {styles as blockStyles} from '../components/Block';
import {styles as cardStyles} from '../components/Card';
import {theme, mocks, time} from '../constants';
import firebase from 'react-native-firebase';

var stream = require('getstream');

const {height, width} = Dimensions.get('window');

export default class CreateGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupName: null,
      groupDesc: null,
    };
  }

  componentDidMount() {
    firebase
      .auth()
      .currentUser.getIdToken()
      .then(idToken => {
        axios
          .post(
            'http://localhost:8000/api/users/token',
            qs.stringify({content: idToken}),
          )
          .then(res => {
            this.setState({
              loading: false,
              token: res.data,
            });
          });
      })
      .catch(error => {
        console.log(error);
      });

    let firestoreref = firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('Info')
      .doc('groups');
    firestoreref.get().then(res => {
      this.setState({
        groups: res.data().subscribed,
      });
    });
  }

  render() {
    return (
      <KeyboardAvoidingView
        enabled
        behavior="padding"
        style={{
          flex: 1,
          paddingTop: height * 0.2,
          backgroundColor: theme.colors.gray3,
        }}
        keyboardVerticalOffset={height * 0.2}>
        {this._renderInputAndButtons()}
      </KeyboardAvoidingView>
    );
  }

  //****** SUB COMPONENTS SECTION
  _renderInputAndButtons() {
    return (
      <Block center style={{marginTop: 44}}>
        <Input
          full
          email
          label="Group Name"
          style={{
            marginBottom: 25,
            color: theme.colors.black,
            borderColor: theme.colors.black,
          }}
          onChangeTextHandler={this.groupNameHandler}
        />
        <Input
          full
          password
          label="Group Description"
          style={{
            marginBottom: 25,
            color: theme.colors.black,
            borderColor: theme.colors.black,
            height: height * 0.2,
          }}
          onChangeTextHandler={this.groupDescHandler}
        />

        <Button
          shadow
          style={{
            marginBottom: 12,
            width: width * 0.4,
          }}
          onPress={() => this.createNewGroup()}>
          <Text button white>
            CREATE NEW GROUP
          </Text>
        </Button>
      </Block>
    );
  }

  //****** HELPER FUNCTIONS SECTION
  groupNameHandler = e => {
    this.setState({
      groupName: e,
    });
  };
  groupDescHandler = e => {
    this.setState({
      groupDesc: e,
    });
  };

  onLoginPress() {
    let firestoreref = firebase.firestore().collection('groups');
    firestoreref.get().then(res => {
      console.log(res.data());
    });
  }
}
const styles = StyleSheet.create({
  welcome: {
    paddingTop: 2 * theme.sizes.padding,
    paddingHorizontal: theme.sizes.padding,
    backgroundColor: theme.colors.gray4,
    alignContent: 'center',
    flex: 1,
  },
  // horizontal line
  hLine: {
    marginVertical: theme.sizes.base * 2,
    marginHorizontal: theme.sizes.base * 2,
    height: 1,
  },
  // vertical line
  vLine: {
    marginVertical: theme.sizes.base / 2,
    width: 1,
  },
  endTrip: {
    position: 'absolute',
    width: width,
    bottom: 0,
  },
});
