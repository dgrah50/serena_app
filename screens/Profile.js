import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Text, Block, Input,Button} from '../components';
import {theme} from '../constants';
import firebase from 'react-native-firebase';
import RNFetchBlob from 'rn-fetch-blob';
const stream = require('getstream');
const {height, width} = Dimensions.get('window');
import ImagePicker from 'react-native-image-picker';
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = RNFetchBlob.polyfill.Blob;
window.fetch = new RNFetchBlob.polyfill.Fetch({
  auto: true,
  binaryContentTypes: ['image/', 'video/', 'audio/', 'foo/'],
}).build();
export default class Profile extends Component {
  static navigationOptions = {
    title: 'Edit Profile',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerStyle: {
      backgroundColor: theme.colors.gray3,
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      bio: null,
      name: null,
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
        this.setState({
          name: StreamUser.data.name,
          bio: StreamUser.data.bio,
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
      .then(photo =>
        this.uploadImageToFirebase(photo.uri, 'image/jpeg', photo.fileName),
      )
      .then(resultURL =>
        firebase.auth().currentUser.updateProfile({
          photoURL: resultURL,
        }),
      )
      .then(() => {
        this.setState({
          photoURL: firebase.auth().currentUser.photoURL,
        });
      })
      .catch(console.error);
  };

  render() {
    return (
      <Block center style={styles.welcome}>
        <Image
          source={require('../assets/images/avatar.jpeg')}
          style={{
            height: height * 0.2,
            width: height * 0.2,
            borderRadius: height * 0.1,
          }}
        />
        <TouchableOpacity onPress={this.uploadPhoto}>
          <Text h3 blue>
            Change Profile Picture
          </Text>
        </TouchableOpacity>

        <Input
          full
          label="Name"
          defaultValue={this.state.name != 'Unknown' ? this.state.name : null}
          style={{
            marginBottom: 25,
            color: theme.colors.black,
            borderColor: theme.colors.black,
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
            color: theme.colors.black,
            borderColor: theme.colors.black,
            height: height * 0.2,
          }}
          onChangeTextHandler={this.bioHandler}
        />
        <Button
          shadow
          style={{
            marginBottom: 12,
            width: width * 0.4,
          }}
          onPress={() => this.setNameAndBio()}>
          <Text button white>
            UPDATE PROFILE
          </Text>
        </Button>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    flex: 1,
    height: 500,
    backgroundColor: theme.colors.gray3,
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
