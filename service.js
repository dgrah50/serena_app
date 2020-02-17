/**
 * This is the code that will run tied to the player.
 *
 * The code here might keep running in the background.
 *
 * You should put everything here that should be tied to the playback but not the UI
 * such as processing media buttons or analytics
 */

import TrackPlayer, {Event} from 'react-native-track-player';

module.exports = async function() {
  // TrackPlayer.addEventListener(Event.RemotePlay, () => {
  //     console.log('=== remote play', event);
  //   TrackPlayer.play();
  // });

  // TrackPlayer.addEventListener(Event.RemotePause, () => {
  //   console.log('=== remote pause', event);
  //   TrackPlayer.pause();
  // });

  // TrackPlayer.addEventListener('remote-next', () => {
  //   TrackPlayer.skipToNext();
  // });

  // TrackPlayer.addEventListener('remote-previous', () => {
  //   TrackPlayer.skipToPrevious();
  // });

  // TrackPlayer.addEventListener(Event.RemoteStop, () => {
  //   console.log('=== remote stop', event);
  //   TrackPlayer.destroy();
  // });
};