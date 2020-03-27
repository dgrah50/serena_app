import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
} from 'react-native';
import firebase from 'react-native-firebase';
import {Block, Text} from '../components';
import {theme} from '../constants';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import * as Animatable from 'react-native-animatable';
AnimatedShimmer = Animatable.createAnimatableComponent(ShimmerPlaceHolder);
import {
  VerseCard,
  _renderSermon,
  _renderPodcast,
} from '../components/VerseSermonCards';
const {width: WIDTH, height: HEIGHT} = Dimensions.get('window');
import _ from 'underscore';
import {Header, Left, Body, Right} from 'native-base';

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
            <TouchableOpacity
              hitSlop={{
                bottom: 30,
                left: 30,
                right: 30,
                top: 30,
              }}
              onPress={() => {
                this.props.navigation.goBack(null);
              }}>
              <Icon
                name="arrow-left"
                size={25}
                style={{paddingLeft: 10}}
                color={theme.colors.black}
              />
            </TouchableOpacity>
          </Left>
          <Body>
            <Text title bold>
              Favourites
            </Text>
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
        <AnimatedShimmer
          animation="fadeInLeft"
          delay={300}
          autoRun={true}
          style={{
            width: WIDTH * 0.9,
            height: WIDTH * 0.7,
            marginBottom: WIDTH * 0.05,
            borderRadius: theme.sizes.border,
          }}
        />
        <AnimatedShimmer
          animation="fadeInLeft"
          delay={600}
          autoRun={true}
          style={{
            width: WIDTH * 0.9,
            height: WIDTH * 0.4,
            borderRadius: theme.sizes.border,
          }}
        />
        <View style={styles.hLine} />
        <AnimatedShimmer
          animation="fadeInLeft"
          delay={900}
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
