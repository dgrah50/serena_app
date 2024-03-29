import React, {useState, useEffect, useRef} from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  AsyncStorage,
} from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import firebase from 'react-native-firebase';
import TrackPlayer, {
  Capability,
  useTrackPlayerEvents,
  Event,
  State,
  usePlaybackState,
} from 'react-native-track-player';
import axios from 'axios';
import OneSignal from 'react-native-onesignal';
const mocksong = {
  title: ` `,
  mp3link: null,
  speakerimg: null,
  date_uploaded: null,
  duration: null,
  author: null,
  plays: null,
};

export default function Container(props) {
  const [currentSongData, setCurrentSong] = useState(mocksong);

  const [tabBarVisible, showTabBar] = useState(false);
  const playbackState = usePlaybackState();

  const didMountRef = useRef(false);
  const events = [
    Event.PlaybackError,
    Event.RemotePause,
    Event.RemoteNext,
    Event.RemotePlay,
    Event.RemotePause,
    Event.RemoteStop,
  ];
  useTrackPlayerEvents(events, event => {
    if (event.type === Event.PlaybackError) {
      console.warn('An error occured while playing the current track.', event);
    }
    if (event.type === Event.RemoteNext) {
      TrackPlayer.skipToNext();
    }
    if (event.type === Event.RemotePrevious) {
      TrackPlayer.skipToPrevious();
    }
    if (event.type === Event.RemotePlay) {
      console.log('play');
      if (State[playbackState] != 'Playing') {
        TrackPlayer.play();
      }
    }
    if (event.type === Event.RemotePause) {
      console.log('pause');
      if (State[playbackState] == 'Playing') {
        TrackPlayer.pause();
      }
    }
    if (event.type === Event.RemoteStop) {
      if (State[playbackState] == 'Playing') {
        TrackPlayer.stop();
      }
    }
  });

  useEffect(() => {
    //If you are logged in, attach the authorisation token to all API requests
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        user.getIdToken().then(function(idToken) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
        });
      }
    });
  });

//Initialise the audio player when the audio source changes
  useEffect(() => {
    if (currentSongData.mp3link) {
      //Initialises Trackplayer - the audio playing module
      TrackPlayer.setupPlayer().then(()=> TrackPlayer.reset()).then(async () => {
        // Adds a track to the queue
        let url = currentSongData.mp3link;
        //Little hack to scrape sermonaudio data
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
      TrackPlayer.updateOptions({
        stopWithApp: false,
        jumpInterval: 15,
        capabilities: [Capability.Play, Capability.Pause],
        notificationCapabilities: [Capability.Play, Capability.Pause],
        compactCapabilities: [Capability.Play, Capability.Pause],
      });
    }
  },[currentSongData]);

//intialise the capabilty to receive notifications
  useEffect(() => {
    AsyncStorage.getItem('notifsEnabled');
    OneSignal.setLogLevel(6, 0);
    OneSignal.init('5e8397b0-56ae-422c-98e4-fbba0d7f6fbb'); // set kOSSettingsKeyAutoPrompt to false prompting manually on iOS
    AsyncStorage.getItem('notifsEnabled').then(value => {
      if (value !== null) {
        OneSignal.setSubscription(value == 1);
      } else {
        OneSignal.setSubscription(true);
      }
    });

    OneSignal.inFocusDisplaying(2);
    OneSignal.addEventListener('received', onReceived);
    OneSignal.addEventListener('opened', onOpened);
    OneSignal.addEventListener('ids', onIds);
    return function cleanup() {
      OneSignal.removeEventListener('received', onReceived);
      OneSignal.removeEventListener('opened', onOpened);
      OneSignal.removeEventListener('ids', onIds);
    };
  },[]);
  const onReceived = notification => {
    console.log('Notification received: ', notification);
  };
  const onOpened = openResult => {
    // console.log('Message: ', openResult.notification.payload.body);
    // console.log('Data: ', openResult.notification.payload.additionalData);
    // console.log('isActive: ', openResult.notification.isAppInFocus);
    // console.log('openResult: ', openResult);
  };
  const onIds = device => {
    // console.log('Device info: ', device);
  };

  //Return the main app
  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
      <AppNavigator
        screenProps={{
          currentSongData,
          changeSong: setCurrentSong,
          setToggleTabBar: setToggleTabBar,
        }}
      />
    </View>
  );

  //****** HELPER FUNCTIONS SECTION
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
