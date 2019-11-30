import React from 'react';
import {Platform, StatusBar, StyleSheet, View} from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import firebase from 'react-native-firebase';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSongData: {
        album: 'Swimming',
        artist: 'Mac Miller',
        image: 'swimming',
        length: 312,
        title: 'So It Goes',
        downloadURL:
          'https://mp3.sermonaudio.com/filearea/9131918851854/9131918851854.mp3',
        albumArtURL:
          'https://vps.sermonaudio.com/resize_image/sources/podcast/{size}/{size}/lamplighter-01.jpg'
      },
      isLoading: true,
      toggleTabBar: false,
    };

    this.changeSong = this.changeSong.bind(this);
    this.setToggleTabBar = this.setToggleTabBar.bind(this);
  }

  async componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('user is logged in');
      } else {
        console.log('user is not logged in ');
      }
    });
  }

  setToggleTabBar() {
    this.setState(({toggleTabBar}) => ({
      toggleTabBar: !toggleTabBar,
    }));
  }

  changeSong(data) {
    this.setState({
      currentSongData: data,
    });
  }

  render() {
    const {currentSongData, isLoading, toggleTabBar} = this.state;
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <AppNavigator
          screenProps={{
            currentSongData,
            changeSong: this.changeSong,
            setToggleTabBar: this.setToggleTabBar,
            toggleTabBarState: toggleTabBar,
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
