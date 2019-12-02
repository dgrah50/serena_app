import React, {useState, useEffect} from 'react';
import {Platform, StatusBar, StyleSheet, View} from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import firebase from 'react-native-firebase';
import TrackPlayer, {
  useProgress,
  State,
  usePlaybackState,
} from 'react-native-track-player';

const mocksong = {
  album: 'Swimming',
  artist: 'Mac Miller',
  image: 'swimming',
  length: 312,
  title: 'So It Goes',
  downloadURL:
    'https://mp3.sermonaudio.com/filearea/9131918851854/9131918851854.mp3',
  albumArtURL:
    'https://vps.sermonaudio.com/resize_image/sources/podcast/{size}/{size}/lamplighter-01.jpg',
};

export default function App(props) {
  const [currentSongData, setCurrentSong] = useState(mocksong);
  const [tabBarVisible, showTabBar] = useState(false);

  useEffect(() => {
    TrackPlayer.setupPlayer().then(async () => {
      // Adds a track to the queue
      await TrackPlayer.add({
        id: '1',
        url: currentSongData.downloadURL,
        title: currentSongData.title,
        artist: currentSongData.artist,
      });
    });
  });

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
      <AppNavigator
        screenProps={{
          currentSongData,
          changeSong: changeSong,
          setToggleTabBar: setToggleTabBar,
        }}
      />
    </View>
  );

  //****** HELPER FUNCTONS SECTION
  function setToggleTabBar() {
    if (tabBarVisible) {
      showTabBar(false);
    } else {
      showTabBar(true);
    }
  }

  function changeSong(data) {
    setCurrentSong(data);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
