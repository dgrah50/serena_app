import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  AsyncStorage,
  Linking,
  Alert,
} from 'react-native';
import {Text} from '../components';
import {theme} from '../constants';
import firebase from 'react-native-firebase';
const {width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {
  Content,
  Button,
  ListItem,
  Body,
  Right,
  Left,
  Switch,
} from 'native-base';

export default class Profile extends Component {
  static navigationOptions = {
    title: 'Profile Settings',
    headerTitleStyle: theme.fonts.title,
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
            <Left>
              <Icon size={18} name="bell" />
            </Left>
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
            icon
            onPress={() => {
              Linking.openURL('https://serena.app');
            }}>
            <Left>
              <Icon size={18} name="envelope-open" />
            </Left>
            <Body>
              <Text>About</Text>
            </Body>
            <Right>
              <Icon active name="arrow-right" />
            </Right>
          </ListItem>

          <ListItem
            icon
            onPress={() => {
              firebase.auth().signOut();
            }}>
            <Left>
              <Icon size={18} name="logout" />
            </Left>
            <Body>
              <Text>Sign Out</Text>
            </Body>
            <Right>
              <Icon active name="arrow-right" />
            </Right>
          </ListItem>

          <ListItem
            icon
            onPress={() => {
              this.deleteAccount();
            }}>
            <Left>
              <Icon size={18} name="trash" />
            </Left>
            <Body>
              <Text>Delete Account</Text>
            </Body>
            <Right>
              <Icon active name="arrow-right" />
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

  // ****** HELPER FUNCTIONS SECTION

  deleteAccount() {
    Alert.alert(
      'Are you sure?',
      "We're sorry to see you go. Please note that this action is permanent and cannot be undone.",
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            let user = firebase.auth().currentUser;
            user.delete().catch(function(err) {
              console.log(err);
            });
          },
        },
      ],
      {cancelable: false},
    );
  }
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
