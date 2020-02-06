import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Share
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Block, Text} from '../components';
import {theme} from '../constants';
import {Transition} from 'react-navigation-fluid-transitions';
import firebase from 'react-native-firebase';
const {width: WIDTH, height: HEIGHT} = Dimensions.get('window');

export default class Detail extends Component {
  constructor(props) {
    super(props);
    console.log();
    this.state = {
      alreadyLiked: false,
    };
    
  }

  componentDidMount(props) {
    if (this.props.navigation.getParam('alreadyLiked')) {
      this.setState({alreadyLiked: true});
    }
  }

  render() {
    let verse = this.props.navigation.getParam('verse');
    let index = this.props.navigation.getParam('index');
    let imageIndex = this.props.navigation.getParam('imageIndex');
    return (
      <Transition shared={'image' + index}>
        <ImageBackground
          style={{width: '100%'}}
          source={theme.randomImages[imageIndex]}>
          <Block
            flex={false}
            center
            middle
            style={{
              padding: 10,
              height: '100%',
              borderRadius: theme.sizes.border,
            }}>
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 50,
                left: 30,
              }}>
              <Icon
                name="arrow-left"
                size={35}
                color={theme.colors.white}
                onPress={() =>
                  {this.props.navigation.goBack();
                   this.props.navigation.state.params.cardToggle(this.state.alreadyLiked)}
                }></Icon>
            </TouchableOpacity>
            <Block flex={false}>
              <Block flex={false} center>
                <Transition shared={'versetext' + index}>
                  <Text h2 white center style={{marginVertical: 8}}>
                    {verse.verse}
                  </Text>
                </Transition>
              </Block>
              <Block flex={false} center>
                <Transition shared={'booktext' + index}>
                  <Text h3 white center style={{marginVertical: 8}}>
                    {verse.bookname}
                  </Text>
                </Transition>
              </Block>
            </Block>
            <Block
              flex={false}
              row
              middle
              style={{
                width: '100%',
                position: 'absolute',
                bottom: 25,
              }}
              space={'between'}>
              <Transition shared={'likebutton' + index}>
                <TouchableOpacity
                  onPress={() =>
                    this.toggleFavourites(
                      verse.verse,
                      verse.bookname,
                      verse.osis,
                    )
                  }>
                  <Icon
                    name="heart"
                    solid={this.state.alreadyLiked}
                    size={40}
                    color={theme.colors.white}
                    style={{marginLeft: 10}}></Icon>
                </TouchableOpacity>
              </Transition>
              <Transition shared={'sharebutton' + index}>
                <TouchableOpacity>
                  <Icon
                    name="paper-plane"
                    size={40}
                    color={theme.colors.white}
                    style={{marginRight: 10}}
                    onPress={() =>
                      this.onShare(verse.verse + ' ' + verse.bookname)
                    }></Icon>
                </TouchableOpacity>
              </Transition>
            </Block>
          </Block>
        </ImageBackground>
      </Transition>
    );
  }

  async toggleFavourites(verseText, bookText, osis) {
    
    osis = osis.toString();
    if (osis.length == 7) {
      osis = '0' + osis.toString();
    }
    let firestoreref = firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('likes');
    if (!this.state.alreadyLiked) {
      try {
        firestoreref.doc(osis).set({
          verseText: verseText,
          bookText: bookText,
          time: firebase.firestore.FieldValue.serverTimestamp(),
        });
        this.setState({
          alreadyLiked: true,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        firestoreref.doc(osis).delete();
        this.setState({
          alreadyLiked: false,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  async  onShare(message) {
  try {
    const result = await Share.share({
      message: message,
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    alert(error.message);
  }
}
}

const styles = StyleSheet.create({
  welcome: {
    paddingTop: 2 * theme.sizes.padding,
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  buttonStyle: {
    width: 125,
    height: 125,
    borderRadius: 62.5,
    backgroundColor: theme.colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyleMini: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  growingPrayerInput: {
    width: '90%',
    fontSize: 20,
    zIndex: 2,
    textAlign: 'center',
    position: Platform.OS === 'ios' ? 'relative' : 'absolute',
    color: 'rgba(255, 255, 255, 1)',
    bottom: 0,
    alignSelf: 'center',
    textAlignVertical: 'bottom',
  },
});
