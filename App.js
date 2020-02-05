import React, {useState, useEffect, useRef} from 'react';
import {Platform, StatusBar, StyleSheet, View} from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import firebase from 'react-native-firebase';
import TrackPlayer from 'react-native-track-player';
import axios from 'axios';
import qs from 'qs';
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
  const [authTokenSet, setAuthTokenStatus] = useState(false);
  const [StreamToken, setStreamToken] = useState(null);
  const [tabBarVisible, showTabBar] = useState(false);
  const [recommendedVerses, setRecs] = useState({verses:null,sermons:{current:null}});
  const didMountRef = useRef(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        user.getIdToken().then(function(idToken) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
          setAuthTokenStatus(true);
        });
      }
    });
  });

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

  useEffect(() => {
    if (authTokenSet) {
      axios
        .post(
          'https://serenaengine333.co.uk/api/users/token',
          qs.stringify({
            content: firebase.auth().currentUser.uid,
          }),
        )
        .then(res => {
          setStreamToken(res.data);
        });
    }
  }, [authTokenSet]);



  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
      <AppNavigator
        screenProps={{
          currentSongData,
          StreamToken,
          changeSong: setCurrentSong,
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
