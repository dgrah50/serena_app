import React, {Component} from 'react';
import {Dimensions, StyleSheet, Alert} from 'react-native';
import {Text} from '../components';
import {theme} from '../constants';
import firebase from 'react-native-firebase';
import moment from 'moment';
const stream = require('getstream');
const {height, width} = Dimensions.get('window');
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import DateTimePicker from 'react-native-modal-datetime-picker';
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
      enableNotification: true,
      isDateTimePickerVisible: false,
      notificationTime: null,
    };
  }

  componentDidMount() {
    client = stream.connect(
      'zgrr2ez3h3yz',
      this.props.screenProps.StreamToken,
      '65075',
    );
    client
      .user(firebase.auth().currentUser.uid)
      .get()
      .then(StreamUser => {
        console.log(StreamUser.data);
        if (StreamUser.data.name == 'Unknown') {
          Alert.alert(
            'Please enter your name before you use Groups.',
            ' ',
            [{text: 'OK'}],
            {
              cancelable: false,
            },
          );
        }
        this.setState({
          name: StreamUser.data.name,
          bio: StreamUser.data.bio,
          profileImage: StreamUser.data.profileImage,
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  setNameAndBio() {
    if (!this.state.name || !this.state.bio) {
      Alert.alert('Incomplete details entered ', 'Try again!', [{text: 'OK'}], {
        cancelable: false,
      });
    } else {
      client.user(firebase.auth().currentUser.uid).update({
        name: this.state.name,
        bio: this.state.bio,
        profileImage: this.state.profileImage,
      });
    }
  }

  nameHandler = e => {
    this.setState({name: e});
  };
  bioHandler = e => {
    this.setState({bio: e});
  };

  uploadImageToFirebase = (uri, mime = 'image/jpeg', fileName) =>
    new Promise((resolve, reject) => {
      const imageRef = firebase
        .storage()
        .ref(`/${firebase.auth().currentUser.uid}`);
      imageRef
        .put(uri, {contentType: mime, name: fileName})
        .then(() => {
          return imageRef.getDownloadURL();
        })
        .then(url => {
          resolve(url);
        })
        .catch(error => {
          reject(error);
        });
    });

  uploadPhotoFromGallery = () =>
    new Promise((resolve, reject) => {
      ImagePicker.launchImageLibrary(
        {
          noData: true,
        },
        photo => {
          if (photo.uri) {
            resolve(photo);
          }

          reject(photo.error);
        },
      );
    });

  uploadPhoto = () => {
    this.uploadPhotoFromGallery()
      .then(photo => {
        return ImageResizer.createResizedImage(photo.uri, 400, 400, 'JPEG', 50);
      })
      .then(photo => {
        return this.uploadImageToFirebase(photo.uri, 'image/jpeg', photo.name);
      })
      .then(resultURL => {
        console.log(resultURL);
        client.user(firebase.auth().currentUser.uid).update({
          name: this.state.name,
          bio: this.state.bio,
          profileImage: resultURL,
        });
        this.setState({
          profileImage: resultURL,
        });
      })
      .catch(error => console.log(error));
  };

  enableNotification = value => {
    this.setState({
      enableNotification: value,
    });
  };
  showDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: true});
  };
  hideDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: false});
  };
  handleDatePicked = date => {
    this.hideDateTimePicker();
    this.setState({
      notificationTime: moment(date),
    });
  };

  render() {
    return (
      // <View style={styles.welcome}>
      <>
        <Content>
          <ListItem icon>
            <Left>
              <Button style={{backgroundColor: '#FF9501'}}>
                <Icon active name="ios-clock" />
              </Button>
            </Left>
            <Body>
              <Text>Daily Notification</Text>
            </Body>
            <Right>
              <Switch value={false} />
            </Right>
          </ListItem>
          <ListItem
            icon
            onPress={() => {
              console.log('tes');
              this.setState({isDateTimePickerVisible: true});
            }}>
            <Left>
              <Button style={{backgroundColor: '#007AFF'}}>
                <Icon active name="wifi" />
              </Button>
            </Left>
            <Body>
              <Text>Notification Time</Text>
            </Body>
            <Right>
              <Text>
                {this.state.notificationTime &&
                  moment(this.state.notificationTime).format('LT')}
              </Text>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem icon>
            <Left>
              <Button style={{backgroundColor: '#007AFF'}}>
                <Icon active name="bluetooth" />
              </Button>
            </Left>
            <Body>
              <Text>About</Text>
            </Body>
            <Right>
              <Text>On</Text>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem icon>
            <Left>
              <Button style={{backgroundColor: '#007AFF'}}>
                <Icon active name="bluetooth" />
              </Button>
            </Left>
            <Body>
              <Text>Sign Out</Text>
            </Body>
            <Right>
              <Text>On</Text>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
        </Content>

        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
          mode="time" // show only time picker
          is24Hour={false}
          date={new Date(this.state.notificationTime)}
          titleIOS="Pick your Notification time"
        />
      </>

      //   {this._renderLogoutButton()}
      // </View>
    );
  }
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
