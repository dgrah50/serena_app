import React, {useState, useEffect, useRef} from 'react';
import {Platform, StatusBar, StyleSheet, View} from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import firebase from 'react-native-firebase';
import TrackPlayer, {
  useProgress,
  State,
  usePlaybackState,
} from 'react-native-track-player';

const mocksong = {
  title: ` `,
  mp3link: null,
  speakerimg: null,
  date_uploaded: null,
  duration: null,
  author: null,
  plays: null,
};

export default function App(props) {
  const [currentSongData, setCurrentSong] = useState(mocksong);
  const [tabBarVisible, showTabBar] = useState(false);
  const didMountRef = useRef(false);

  useEffect(() => {
    if (currentSongData.mp3link) {
      TrackPlayer.setupPlayer().then(async () => {
        // Adds a track to the queue
        let url = currentSongData.mp3link;
        url = url.replace(
          '//mp3.sermonaudio.com/download/',
          'https://mp3.sermonaudio.com/filearea/',
        );

        await TrackPlayer.add({
          id: '1',
          url: url,
          title: currentSongData.title,
          artist: currentSongData.author,
        });
      });
    }
  });

  useEffect(() => {
    if (didMountRef.current) {
      TrackPlayer.reset().then(() => {
        TrackPlayer.play();
      });
    } else {
      didMountRef.current = true;
    }
  }, [currentSongData]);

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
    // .then(() => {
    //   TrackPlayer.reset();
    // })
    // .then(() => {
    //   let url = currentSongData.mp3link;
    //   url = url.replace(
    //     '//mp3.sermonaudio.com/download/',
    //     'https://mp3.sermonaudio.com/filearea/',
    //   );
    //   TrackPlayer.add({
    //     id: '1',
    //     url: url,
    //     title: currentSongData.title,
    //     artist: currentSongData.author,
    //   });
    // })
    // .then(() => {
    //   TrackPlayer.play();
    // });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
