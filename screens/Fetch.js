import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Easing,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import {RNChipView} from 'react-native-chip-view';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import qs from 'qs';
import Voice from 'react-native-voice';
import {Block, RippleAnim, Text, AnimatedCircularProgress} from '../components';
import {theme, time, emotions} from '../constants';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
import LinearGradient from 'react-native-linear-gradient';
import SliderEntry from '../components/SliderEntry';
import firebase from 'react-native-firebase';
import * as Animatable from 'react-native-animatable';

const {width: WIDTH, height: HEIGHT} = Dimensions.get('window');

export default class Fetch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typedText: '',
      showMicButton: true,
      listening: false,
      ringVisible: false,
      toggleText: false,
      results: [],
      EmojiEmotion: null,
    };
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechError = this.onSpeechError.bind(this);
    // firebase.auth().onAuthStateChanged(function(user) {
    //   if (user) {
    //     user.getIdToken().then(function(idToken) {
    //       console.log(idToken)
    //       axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
    //       return idToken;
    //     });
    //   }
    // });
  }

  handleViewRef = ref => (this.view = ref);

  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <TouchableWithoutFeedback
        style={{width: '100%', flex: 1}}
        onPress={() => {
          if (!this.state.showMicButton) {
            this.showMic();
          }
        }}>
        <LinearGradient
          colors={[theme.colors.primary, '#2474A8']}
          style={styles.welcome}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}>
            <TouchableOpacity
              style={{
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                height: '7%',
                top: 0,
                right: 30,
                zIndex: 1,
              }}
              onPress={() => this.props.navigation.navigate('Profile')}>
              <Icon name="cog" size={25} color={theme.colors.white}></Icon>
            </TouchableOpacity>
            <View
              style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                height: '7%',
                top: 0,
                position: 'absolute',
              }}>
              <Image
                resizeMode="contain"
                source={require('../assets/images/whiteicon.png')}
                style={{
                  width: 45,
                  height: 45,
                  top: 0,
                  paddingRight: 40,
                }}
              />
            </View>
            <View
              style={{
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '50%',
              }}>
              {this.state.showMicButton && !this.state.listening && (
                <Animatable.View
                  animation={'fadeIn'}
                  style={{
                    width: '100%',
                    alignItems: 'center',
                    height: '15%',
                  }}>
                  <Text h2 white>
                    {' '}
                    What's on your mind?{' '}
                  </Text>
                </Animatable.View>
              )}
              {this._renderMicRing()}
              {this.state.showMicButton &&
                !this.state.listening &&
                this._renderEmotionChips()}
            </View>
            {this.state.showMicButton &&
              !this.state.listening &&
              this._renderKeyboardButton()}

            {!this.state.showMicButton &&
              !this.state.listening &&
              this._renderTypedPrayerInput()}
          </View>
        </LinearGradient>
      </TouchableWithoutFeedback>
    );
  }

  //****** SUB COMPONENTS SECTION
  _renderTopicChips() {
    return (
      <Block center middle>
        <Text h3> What does the Bible say about... </Text>
        <ScrollView horizontal={true}>
          {emotions.topicList.map(topic => {
            return (
              <Block style={{padding: 5}} key={topic}>
                <RNChipView
                  onPress={() => {
                    this.apiCall(topic);
                  }}
                  title={topic}
                  avatar={false}
                />
              </Block>
            );
          })}
        </ScrollView>
      </Block>
    );
  }
  _renderEmotionChips() {
    return (
      <View
        center
        style={{
          width: '100%',
          alignItems: 'center',
        }}>
        {this.state.EmojiEmotion ? (
          <React.Fragment>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {emotions.emotions[this.state.EmojiEmotion].map((topic, idx) => {
                return (
                  <Animatable.View
                    animation={'fadeInRight'}
                    style={{paddingHorizontal: 5}}
                    key={topic}>
                    <RNChipView
                      onPress={() => {
                        this.apiCall(topic);
                      }}
                      title={topic}
                      avatar={false}
                    />
                  </Animatable.View>
                );
              })}
            </ScrollView>
            <Animatable.View
              animation={'fadeIn'}
              style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              <Icon
                name={'times-circle'}
                size={30}
                color={'rgba(240, 240, 247, 0.66)'}
                onPress={() => {
                  this.setState({EmojiEmotion: null});
                }}
              />
            </Animatable.View>
          </React.Fragment>
        ) : (
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {['😀', '😡', '😔', '😨'].map((topic, idx) => {
              return (
                <Animatable.View
                  style={{padding: 5}}
                  key={topic}
                  animation={'fadeInLeft'}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        EmojiEmotion: Object.keys(emotions.emotions)[idx],
                      });
                    }}>
                    <Text h1 style={{paddingHorizontal: 10}}>
                      {topic}
                    </Text>
                  </TouchableOpacity>
                </Animatable.View>
              );
            })}
          </ScrollView>
        )}
      </View>
    );
  }
  _renderMicRing() {
    return (
      <Animatable.View
        ref={this.handleViewRef}
        style={{justifyContent: 'center', alignItems: 'center'}}
        // style={{marginBottom: '10%'}}
      >
        {this.state.listening && <RippleAnim />}
        <AnimatedCircularProgress
          onAnimationComplete={() => {
            console.log('animation done');
            this.circularProgress.reAnimate(0, 0, Easing.quad);
            this.stopListen();
          }}
          ref={ref => (this.circularProgress = ref)}
          tintColor={
            this.state.ringVisible ? theme.colors.white : 'rgba(0,0,0,0)'
          }>
          {fill => this._renderMicButton()}
        </AnimatedCircularProgress>
        {this.state.listening && (
          <Block
            style={{
              position: 'absolute',
              bottom: HEIGHT * -0.2,
              marginHorizontal: WIDTH * 0.1,
              height: HEIGHT * 0.2,
            }}>
            <Text h2 white>
              {this.state.typedText}
            </Text>
          </Block>
        )}
      </Animatable.View>
    );
  }
  _renderMicButton() {
    return (
      <TouchableOpacity
        hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
        onPressIn={this.setRingOn.bind(this)}
        // onPressOut={this.stopListen.bind(this)}
      >
        <View
          style={[styles.buttonStyle, Platform.OS === 'ios' && theme.shadow]}>
          <Icon name={'microphone'} size={60} color={theme.colors.white} />
        </View>
      </TouchableOpacity>
    );
  }
  _renderKeyboardButton() {
    return (
      <TouchableOpacity
        hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
        style={[styles.searchBox, {marginTop: 100}]}
        onPress={this.hideMic.bind(this)}>
        <Block
          row
          flex={false}
          justifyContent={'flex-start'}
          style={{
            width: WIDTH * 0.8,
            height: 40,
            borderRadius: theme.sizes.border,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon
            name={'search'}
            size={20}
            style={{marginLeft: 15, marginRight: 10}}
            color={theme.colors.white}
          />
          <Text white h3>
            Search
          </Text>
        </Block>
      </TouchableOpacity>
    );
  }
  _renderTypedPrayerInput() {
    return (
      <Animatable.View animation={'fadeIn'} style={{position: 'absolute'}}>
        <AutoGrowingTextInput
          style={[
            styles.searchBox,
            theme.fonts.h3,
            Platform.OS === 'ios' && theme.shadow,
            {
              paddingHorizontal: 15,
              paddingBottom: 5,
              color: theme.colors.white,
            },
          ]}
          placeholder={"What's on your mind?"}
          placeholderTextColor={'rgba(255, 255, 255, 0.8)'}
          ref={typedText => {
            this.prayInputField = typedText;
          }}
          selectTextOnFocus={false}
          autoFocus={true}
          multiline={true}
          blurOnSubmit={false}
          minHeight={45}
          underlineColorAndroid="transparent"
          onKeyPress={this.onKeyPress.bind(this)}
          onChangeText={typedText => this.setState({typedText})}
          value={this.state.typedText}
          onFocus={this.hideMic.bind(this)}
          onEndEditing={this.showMic.bind(this)}
          onSubmitEditing={this.showMic.bind(this)}
        />
      </Animatable.View>
    );
  }
  _renderItem({item, index}) {
    return (
      <SliderEntry
        data={item}
        even={(index + 1) % 2 === 0}
        navigation={this.props.navigation}
      />
    );
  }

  //****** HELPER FUNCTIONS SECTION
  apiCall(query) {
    this.setState({fetched: false});
    axios
      .post(
        'https://serenaengine333.co.uk/api/verses',
        // 'http://localhost:8000/api/verses',
        qs.stringify({
          content: query,
          userID: firebase.auth().currentUser.uid.toString(),
        }),
      )
      .then(response => {
        this.setState({
          fetched: true,
          typedText: '',
          listening: false,
          ringVisible: false,
        });
        this.props.navigation.navigate('HomeFeed', {
          response: response.data,
        });
      })
      .catch(error => {
        this.setState({
          fetched: true,
          verse: {
            verseText:
              "Oops! We couldn't find a result for that one, could you rephrase that?",
          },
        });
        console.log(error);
      });
  }
  onSpeechError(e) {
    console.log(e);
  }
  onSpeechResults(e) {
    console.log(e.value);
    this.setState({
      results: e.value,
      typedText: Platform.OS === 'ios' ? e.value.join() : e.value[0],
    });
  }
  stopListen() {
    console.log('stopping');
    try {
      Voice.stop();
      // this.circularProgress.stopAnimate();
    } catch (e) {
      console.log(e);
    }
    if (this.state.typedText != '') {
      this.apiCall(this.state.typedText);
    } else {
      this.setState({
        typedText: '',
        listening: false,
        ringVisible: false,
      });
    }
  }
  setRingOn() {
    if (!this.state.listening) {
      this.setState({ringVisible: true}, () => this.startListen());
    }
  }
  async startListen(e) {
    try {
      await Voice.start('en-US');
      console.log('voice started');
      this.circularProgress.animate(100, 8000, Easing.quad);
      this.setState({
        results: [],
        typedText: '',
        listening: true,
      });
    } catch (e) {
      console.error(e);
    }
  }
  hideMic() {
    this.view.animate({
      0: {
        opacity: 1,
        // scale: 1,
      },
      0.5: {
        opacity: 0.5,
        // scale: 0.3,
        height: 50,
      },
      1: {
        opacity: 0,
        // scale: 0,
        height: 0,
      },
    });
    this.setState({
      showMicButton: false,
      typedText: '',
    });
  }
  showMic() {
    this.view.animate({
      0: {
        opacity: 0,
        height: 0,
      },
      0.5: {
        opacity: 0.5,
        // scale: 0.3,
        height: 50,
      },
      1: {
        opacity: 1,
        // scale: 0,
        height: 125,
      },
    });
    Keyboard.dismiss;
    this.setState({
      showMicButton: true,
    });
    if (this.state.typedText != '') {
      this.apiCall(this.state.typedText);
    }
  }
  onKeyPress = ({nativeEvent}) => {
    if (nativeEvent.key === 'Enter') {
      this.showMic();
    }
  };
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
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(240, 240, 247, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBox: {
    width: WIDTH * 0.8,
    height: 40,
    borderRadius: theme.sizes.border,
    backgroundColor: 'rgba(240, 240, 247, 0.3)',
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
