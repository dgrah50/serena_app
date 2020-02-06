import React, {Component} from 'react';
import {ScrollView, StyleSheet, Dimensions, View} from 'react-native';
import axios from 'axios';
import qs from 'qs';
import firebase from 'react-native-firebase';
import {Block, Text} from '../components';
import {theme, time} from '../constants';
import {DOMParser} from 'xmldom';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import {
  VerseCard,
  _renderSermon,
  _renderPodcast,
} from '../components/VerseSermonCards';
const {width: WIDTH, height: HEIGHT} = Dimensions.get('window');
import _ from 'underscore';

export default class Favourites extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favourites: false,
      likedosis: [],
    };
  }

  componentDidMount() {
    this.fetchLikes();
  }

  render() {
    console.log(this.state.favourites);
    return this.state.favourites ? (
      <View style={styles.welcome}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text
            h2
            black
            spacing={1}
            style={{
              marginVertical: 8,
              paddingHorizontal: theme.sizes.padding,
            }}>
            Favourites
          </Text>
          {this.state.favourites.map((verse, idx) => {
            return (
              <VerseCard
                imageIndex={Math.floor(
                  Math.random() * theme.randomImages.length,
                )}
                verses={[verse]}
                likedosis={this.state.likedosis}
                index={idx}
                key={idx}
                scroller={false}
                props={this.props}
              />
            );
          })}
        </ScrollView>
      </View>
    ) : (
      this._renderLoadingPlaceHolder()
    );
  }

  //****** SUB COMPONENTS SECTION
  _renderLoadingPlaceHolder() {
    return (
      <Block center style={styles.welcome}>
        <ShimmerPlaceHolder
          autoRun={true}
          style={{
            width: WIDTH * 0.9,
            height: WIDTH * 0.7,
            marginBottom: WIDTH * 0.05,
            borderRadius: theme.sizes.border,
          }}
        />
        <ShimmerPlaceHolder
          autoRun={true}
          style={{
            width: WIDTH * 0.9,
            height: WIDTH * 0.4,
            borderRadius: theme.sizes.border,
          }}
        />
        <View style={styles.hLine} />
        <ShimmerPlaceHolder
          autoRun={true}
          style={{
            width: WIDTH * 0.9,
            height: WIDTH * 0.7,
            marginBottom: WIDTH * 0.05,
            borderRadius: theme.sizes.border,
          }}
        />
      </Block>
    );
  }

  //****** HELPER FUNCTIONS SECTION

  fetchLikes() {
    let firestoreref = firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('likes')
      .get()
      .then(snapshot => {
        let likedosis = snapshot._docs.map(doc => doc.id);
        this.setState({
          likedosis: likedosis,
          favourites: snapshot._docs.map(doc => {
            return {
              verse: doc._data.verseText,
              bookname: doc._data.bookText,
              osis: doc.id,
            };
          }),
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }
}

const styles = StyleSheet.create({
  welcome: {
    paddingTop: 2 * theme.sizes.padding,
    backgroundColor: theme.colors.bg,
    // paddingHorizontal: theme.sizes.padding,
    flex: 1,
  },
  // horizontal line
  hLine: {
    marginBottom: theme.sizes.base,
    marginHorizontal: WIDTH * 0.1,
    marginVertical: 3,
    height: 1,
    backgroundColor: theme.colors.gray,
  },
});
