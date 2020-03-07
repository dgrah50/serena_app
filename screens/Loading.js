import React from 'react';
import {View, StyleSheet} from 'react-native';
import firebase from 'react-native-firebase';
import axios from 'axios';
import qs from 'qs';
export default class Loading extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        user
          .getIdToken()
          .then(function(idToken) {
            axios.defaults.headers.common[
              'Authorization'
            ] = `Bearer ${idToken}`;
          })
          .then(() => {
            this.props.navigation.navigate('Discover');
          });
      } else {
        this.props.navigation.navigate('Auth');
      }
    });
  }

  render() {
    return <View style={styles.container}></View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
