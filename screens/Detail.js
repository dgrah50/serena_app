import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Block, Text} from '../components';
import {theme} from '../constants';
import {Transition} from 'react-navigation-fluid-transitions';

const {width: WIDTH, height: HEIGHT} = Dimensions.get('window');

export default class Detail extends Component {
  constructor(props) {
    super(props);
    console.log();
  }

  render() {
    let verse = this.props.navigation.getParam('verse');
    return (
      <Transition shared="hands">
        <ImageBackground
          style={{width: '100%'}}
          source={require('../assets/images/hand.jpg')}>
          <Block
            flex={false}
            center
            middle
            style={{padding: 10, height: '100%'}}>
            <Block flex={false}>
              <Block flex={false} center>
                <Transition shared="versetext">
                  <Text h2 white style={{marginVertical: 8}}>
                    {verse.verse}
                  </Text>
                </Transition>
              </Block>
              <Block flex={false} center>
                <Transition shared="booktext">
                  <Text h3 white style={{marginVertical: 8}}>
                    {verse.bookname}
                  </Text>
                </Transition>
              </Block>
            </Block>
            <Block flex={false} row middle space={'between'}>
              <Transition shared="likebutton">
                <TouchableOpacity>
                  <Icon.Button
                    name="heart"
                    backgroundColor={theme.colors.accent}
                    onPress={() =>
                      this.addToFavourites(
                        verse.verse,
                        verse.bookname,
                        verse.osis,
                      )
                    }>
                    Like
                  </Icon.Button>
                </TouchableOpacity>
              </Transition>
              <Transition shared="sharebutton">
                <TouchableOpacity>
                  <Icon.Button
                    name="share-alt"
                    backgroundColor={theme.colors.share}
                    onPress={() =>
                      this.onShare(verse.verse + ' ' + verse.bookname)
                    }>
                    Share
                  </Icon.Button>
                </TouchableOpacity>
              </Transition>
            </Block>
          </Block>
        </ImageBackground>
      </Transition>
    );
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
