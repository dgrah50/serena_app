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
} from 'react-native';
import {RNChipView} from 'react-native-chip-view';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import qs from 'qs';
import Voice from 'react-native-voice';
import {Block, Card, Text, AnimatedCircularProgress} from '../components';
import {theme, time, emotions} from '../constants';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
import LinearGradient from 'react-native-linear-gradient';
import SliderEntry from '../components/SliderEntry';
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
    headerLeft: (
      <Block left style={{paddingLeft: 10}}>
        <Text gray style={theme.fonts.title}>
          {time.DateNow.weekday}
          {', '}
          <Text style={theme.fonts.title}>
            {time.DateNow.month} {time.DateNow.date}
          </Text>
        </Text>
      </Block>
    ),
    headerRight: (
      <TouchableOpacity>
        <Block flex={false}>
          <Image
            resizeMode="contain"
            source={require('../assets/images/Icon/Menu.png')}
            style={{width: 45, height: 18, paddingRight: 40}}
          />
        </Block>
      </TouchableOpacity>
    ),
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
                height: '10%',
                top: 0,
                right: 30,
                zIndex: 1,
              }}
              onPress={() => this.props.navigation.navigate('Favourites')}>
              <Icon name="cog" size={25} color={theme.colors.white}></Icon>
            </TouchableOpacity>
            <View
              style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                height: '10%',
                top: 0,
                position: 'absolute',
              }}>
              <Image
                resizeMode="contain"
                source={require('../assets/images/whiteicon.png')}
                style={{width: 45, height: 45, top: 0, paddingRight: 40}}
              />
            </View>

            {this.state.showMicButton && (
              <Animatable.View animation={'fadeIn'}>
                <Text h2 white>
                  {' '}
                  What's on your mind?{' '}
                </Text>
              </Animatable.View>
            )}
            {this._renderMicRing()}
            {this.state.showMicButton && this._renderEmotionChips()}
            {this.state.showMicButton && this._renderKeyboardButton()}
            {!this.state.showMicButton && this._renderTypedPrayerInput()}
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
              <Block  style={{padding: 5}} key={topic}>
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
      <View center style={{height: '15%', marginTop: '5%'}}>
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
              style={{justifyContent: 'flex-start', alignItems: 'center'}}>
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
      <React.Fragment>
        <Animatable.View
          ref={this.handleViewRef}
          center
          middle
          flex={false}
          style={{marginBottom: '10%'}}>
          <AnimatedCircularProgress
            onAnimationComplete={() => {
              // console.log('animation done');
            }}
            ref={ref => (this.circularProgress = ref)}
            tintColor={this.state.ringVisible ? '#5692D0' : 'rgba(0,0,0,0)'}>
            {fill => this._renderMicButton()}
          </AnimatedCircularProgress>
        </Animatable.View>
      </React.Fragment>
    );
  }
  _renderMicButton() {
    return (
        <TouchableOpacity
          hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
          onPressIn={this.setRingOn.bind(this)}
          onPressOut={this.stopListen.bind(this)}>
          <View style={[styles.buttonStyle, theme.shadow]}>
            <Icon name={'microphone'} size={60} color={theme.colors.primary} />
          </View>
        </TouchableOpacity>
    );
  }
  _renderKeyboardButton() {
    return (
      <TouchableOpacity
        hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
        onPress={this.hideMic.bind(this)}>
        <Block row flex={false} justifyContent={"flex-start"} style={[styles.searchBox]} >
          <Icon name={'search'} size={20} style={{marginLeft:15,marginRight:10}} color={theme.colors.white} />
          <Text white h3>Search</Text>
        </Block>
      </TouchableOpacity>
    );
  }
  _renderTypedPrayerInput() {
    return (
      <Animatable.View animation={'fadeIn'}>
        <AutoGrowingTextInput
          style={[
            styles.searchBox,
            theme.fonts.h3,
            {paddingHorizontal: 15, paddingBottom:5, color: theme.colors.white},
            this.state.showMicButton ? {marginBottom: 100} : {marginBottom: 0},
          ]}
          placeholder={'What\'s on your mind?'}
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
    console.log('calling api');
    this.setState({fetched: false});
    axios
      .post(
        'https://serenaengine333.co.uk/api/verses',
        // 'http://localhost:8000/api/verses',
        qs.stringify({content: query}),
      )
      .then(response => {
        this.setState({
          fetched: true,
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
  onSpeechResults(e) {
    console.log(e.value);
    this.setState({
      results: e.value,
      typedText: Platform.OS === 'ios' ? e.value.join() : e.value[0],
    });
  }
  stopListen() {
    try {
      Voice.cancel();
      this.circularProgress.stopAnimate();
    } catch (e) {
      console.log(e);
    }
    if (this.state.typedText != '') {
      this.apiCall(this.state.typedText);
    }
    this.setState({
      typedText: '',
      listening: false,
      ringVisible: false,
    });
  }
  setRingOn() {
    this.setState({ringVisible: true}, () => this.startListen());
  }
  async startListen(e) {
    this.circularProgress.reAnimate(0, 100, 8000, Easing.quad);
    this.setState({
      results: [],
      typedText: '',
      listening: true,
    });
    try {
      await Voice.start('en-US');
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
    backgroundColor: "rgba(240, 240, 247, 0.66)",
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBox: {
    width: WIDTH * 0.8,
    height: 40,
    borderRadius: theme.sizes.border,
    backgroundColor: "rgba(240, 240, 247, 0.66)",
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
