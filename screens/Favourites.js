import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  View,
} from 'react-native';
import firebase from 'react-native-firebase';
import {Block} from '../components';
import {theme} from '../constants';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import {
  VerseCard,
  _renderSermon,
  _renderPodcast,
} from '../components/VerseSermonCards';
const {width: WIDTH, height: HEIGHT} = Dimensions.get('window');
import _ from 'underscore';
import {
  Header,
  Left,
  Body,
  Right,
  Title,
} from 'native-base';

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
    return this.state.favourites ? (
      <View style={styles.welcome}>
        <Header>
          <Left>
            <Icon
              name="chevron-left"
              size={25}
              style={{paddingLeft: 10}}
              color={theme.colors.black}
              onPress={() => {
                this.props.navigation.goBack(null);
              }}
            />
          </Left>
          <Body>
            <Title>Favourites</Title>
          </Body>
          <Right />
        </Header>
        <ScrollView showsVerticalScrollIndicator={false}>
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
          favourites: snapshot._docs
            .map(doc => {
              return {
                verse: doc._data.verseText,
                bookname: doc._data.bookText,
                osis: doc.id,
              };
            })
            .reverse(),
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }
}

const styles = StyleSheet.create({
  welcome: {
    backgroundColor: theme.colors.bg,
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
