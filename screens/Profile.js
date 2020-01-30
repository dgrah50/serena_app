import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Text, Card, Input, Button} from '../components';
import {theme} from '../constants';
import firebase from 'react-native-firebase';

const stream = require('getstream');
const {height, width} = Dimensions.get('window');
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import {ThemeColors} from 'react-navigation';

export default class Profile extends Component {
  static navigationOptions = {
    title: 'Edit Profile',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerTransparent: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      bio: null,
      name: null,
      profileImage: null,
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

  render() {
    return (
      <View style={styles.welcome}>
        <TouchableOpacity
          style={{
            alignItems: 'center',
          }}
          onPress={this.uploadPhoto}>
          {this.state.profileImage ? (
            <Image
              source={{
                uri: this.state.profileImage,
              }}
              style={{
                height: height * 0.2,
                width: height * 0.2,
                borderRadius: height * 0.1,
              }}
            />
          ) : (
            <Image
              source={require('../assets/images/avatar.jpeg')}
              style={{
                height: height * 0.2,
                width: height * 0.2,
                borderRadius: height * 0.1,
              }}
            />
          )}
          <Button
          onPress={this.uploadPhoto}
            shadow
            style={{
              marginVertical: 12,
              width: width * 0.5,
            }}>
            <Text button white>
              CHANGE PROFILE PICTURE
            </Text>
          </Button>
        </TouchableOpacity>

        <Input
          full
          label="Name"
          defaultValue={this.state.name != 'Unknown' ? this.state.name : null}
          style={{
            backgroundColor: theme.colors.white,
            marginBottom: 25,
            color: theme.colors.black,
            borderColor: theme.colors.white,
          }}
          onChangeTextHandler={this.nameHandler}
        />
        <Input
          full
          label="Bio"
          defaultValue={this.state.bio}
          multiline={true}
          style={{
            marginBottom: 25,
            backgroundColor: theme.colors.white,
            color: theme.colors.black,
            borderColor: theme.colors.white,
            height: height * 0.1,
          }}
          onChangeTextHandler={this.bioHandler}
        />
        <Button
          shadow
          style={{
            marginBottom: 12,
            width: width * 0.5,
          }}
          onPress={() => this.setNameAndBio()}>
          <Text button white>
            UPDATE PROFILE
          </Text>
        </Button>

        {this._renderLogoutButton()}
      </View>
    );
  }
  _renderLogoutButton = () => {
    return (
      <Button
        center
        middle
        shadow
        flex={false}
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
    backgroundColor: theme.colors.bg
  },
});
