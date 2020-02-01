import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Block, Text} from '../components';
import {theme} from '../constants';
import {Transition} from 'react-navigation-fluid-transitions';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const {width: WIDTH, height: HEIGHT} = Dimensions.get('window');

export default class Detail extends Component {
  constructor(props) {
    super(props);
    console.log();
  }

  render() {
    let verse = this.props.navigation.getParam('verse');
    let index = this.props.navigation.getParam('index');
    let imageIndex = this.props.navigation.getParam('imageIndex');
    let alreadyLiked = this.props.navigation.getParam('alreadyLiked');
    return (
      <TouchableWithoutFeedback onPress={this.props.navigation.goBack}>
        <Transition shared={'image' + index}>
          <ImageBackground
            style={{width: '100%'}}
            source={theme.randomImages[imageIndex]}>
            <Transition shared={'filter' + index}>
              <Block
                flex={false}
                center
                middle
                style={{
                  padding: 10,
                  height: '100%',
                  backgroundColor: 'rgba(0, 0, 0, .3)',
                  borderRadius: theme.sizes.border,
                }}>
                <Block flex={false}>
                  <Block flex={false} center>
                    <Transition shared={'versetext' + index}>
                      <Text h2 white style={{marginVertical: 8}}>
                        {verse.verse}
                      </Text>
                    </Transition>
                  </Block>
                  <Block flex={false} center>
                    <Transition shared={'booktext' + index}>
                      <Text h3 white style={{marginVertical: 8}}>
                        {verse.bookname}
                      </Text>
                    </Transition>
                  </Block>
                </Block>
                <Block
                  flex={false}
                  row
                  middle
                  style={{width: '100%'}}
                  space={'between'}>
                  <Transition shared={'likebutton' + index}>
                    <TouchableOpacity>
                      <Icon
                        name="heart"
                        solid={alreadyLiked}
                        size={40}
                        color={theme.colors.white}
                        style={{marginHorizontal: 10}}
                        onPress={() =>
                          this.addToFavourites(
                            verses[0].verse,
                            verses[0].bookname,
                            verses[0].osis,
                          )
                        }></Icon>
                    </TouchableOpacity>
                  </Transition>
                  <Transition shared={'sharebutton' + index}>
                    <TouchableOpacity>
                      <Icon
                        name="paper-plane"
                        size={40}
                        color={theme.colors.white}
                        onPress={() =>
                          this.onShare(
                            verses[0].verse + ' ' + verses[0].bookname,
                          )
                        }></Icon>
                    </TouchableOpacity>
                  </Transition>
                </Block>
              </Block>
            </Transition>
          </ImageBackground>
        </Transition>
      </TouchableWithoutFeedback>
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
