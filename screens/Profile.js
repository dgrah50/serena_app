import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  Alert,
  AsyncStorage,
  Linking,
} from 'react-native';
import {Text} from '../components';
import {theme} from '../constants';
import firebase from 'react-native-firebase';
import moment from 'moment';
import {PERMISSIONS} from 'react-native-permissions';

const {height, width} = Dimensions.get('window');
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import DateTimePicker from 'react-native-modal-datetime-picker';
import OneSignal from 'react-native-onesignal';
import {
  Content,
  Button,
  ListItem,
  Icon,
  Left,
  Body,
  Right,
  Switch,
} from 'native-base';

export default class Profile extends Component {
  static navigationOptions = {
    title: 'Profile Settings',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      bio: null,
      name: null,
      profileImage: null,
      isDateTimePickerVisible: false,
      notificationTime: null,
      areNotificationsEnabled: null,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('notifsEnabled')
      .then(value => {
        if (value != null) {
          console.log(value);
          this.setState({
            areNotificationsEnabled: value == 'true',
          });
        } else {
          this.setState({areNotificationsEnabled: true});
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({areNotificationsEnabled: true});
      });
  }

  componentDidUpdate() {
    AsyncStorage.setItem(
      'notifsEnabled',
      JSON.stringify(this.state.areNotificationsEnabled),
    ).catch(err => console.log(err));
  }

  render() {
    return (
      <>
        <Content>
          <ListItem icon>
            <Body>
              <Text>Daily Notification</Text>
            </Body>
            <Right>
              <Switch
                value={this.state.areNotificationsEnabled}
                onValueChange={value => {
                  this.setState({
                    areNotificationsEnabled: value,
                  });
                }}
              />
            </Right>
          </ListItem>

          <ListItem
            onPress={() => {
              Linking.openURL('https://serena.app');
            }}>
            <Body>
              <Text>About</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem
            onPress={() => {
              firebase.auth().signOut();
            }}>
            <Body>
              <Text>Sign Out</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
        </Content>
      </>
    );
  }
  //****** SUB COMPONENTS SECTION
  _renderLogoutButton = () => {
    return (
      <Button
        center
        middle
        shadow
        row
        style={{
          marginBottom: 12,
          width: width * 0.5,
          bottom: 0,
        }}
        onPress={() => {
          console.log('hello');
          firebase.auth().signOut();
        }}>
        <Text button white>
          SIGN OUT
        </Text>
      </Button>
    );
  };
}

const styles = StyleSheet.create({
  welcome: {
    flex: 1,
    paddingBottom: '20%',
    paddingTop: '20%',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.bg,
  },
});
