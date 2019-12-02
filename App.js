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
  title: 'The Only Peace: Part 3',
  mp3link: '//mp3.sermonaudio.com/download/11301511845/11301511845.mp3',
  speakerimg:
    'https://media.sermonaudio.com/gallery/photos/thumbnails/CouchJon-01.PNG',
  date_uploaded: 'MON 11/30/2015',
  duration: ' 26 min',
  author: 'Jon Couch',
  plays: '140+ ',
};

export default function App(props) {
  const [currentSongData, setCurrentSong] = useState(mocksong);
  const [tabBarVisible, showTabBar] = useState(false);
  const didMountRef = useRef(false);

  useEffect(() => {
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
  });

  useEffect(() => {
  if (didMountRef.current){
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
    setCurrentSong(data)
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
