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
import Carousel from 'react-native-snap-carousel';
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
    Voice.onSpeechStart = this.onSpeechStart;
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
          colors={['#7645C1', '#3023AE']}
          style={styles.welcome}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              height: '75%',
            }}>
            {this._renderMicRing()}
            {this.state.showMicButton && this._renderKeyboardButton()}
            {!this.state.showMicButton && this._renderTypedPrayerInput()}
            {this._renderEmotionChips()}
          </View>
          <Block>{this._renderPraylist()}</Block>
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
  //To be implemented. Each emoji needs to map to a sub emotion
  //List of sub emotions is given in emotions.emotions
  _renderEmotionChips() {
    return (
      <View center middle style={{height: '20%', marginTop: '5%'}}>
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
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <Icon
                name={'times-circle'}
                size={30}
                color={theme.colors.gray2}
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
                  <RNChipView
                    onPress={() => {
                      this.setState({
                        EmojiEmotion: Object.keys(emotions.emotions)[idx],
                      });
                    }}
                    title={topic}
                    avatar={false}
                  />
                </Animatable.View>
              );
            })}
          </ScrollView>
        )}
      </View>
    );
  }

  fadeIn = {
    from: {
      opacity: 1,
    },
    to: {
      opacity: 0,
    },
  };
  _renderMicRing() {
    return (
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
    );
  }
  _renderMicButton() {
    return (
      <TouchableOpacity
        hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
        onPressIn={this.setRingOn.bind(this)}
        onPressOut={this.stopListen.bind(this)}>
        <View style={[styles.buttonStyle]}>
          <Icon name={'microphone'} size={60} color={'#5334B8'} />
        </View>
      </TouchableOpacity>
    );
  }

  _renderKeyboardButton() {
    return (
      <TouchableOpacity
        hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
        onPress={this.hideMic.bind(this)}>
        <View style={[styles.buttonStyleMini]}>
          <Icon name={'keyboard'} size={30} color={'#5334B8'} />
        </View>
      </TouchableOpacity>
    );
  }

  _renderTypedPrayerInput() {
    return (
      <AutoGrowingTextInput
        style={[
          styles.growingPrayerInput,
          this.state.showMicButton ? {marginBottom: 100} : {marginBottom: 0},
        ]}
        placeholder={'Type your prayer'}
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
    );
  }

  _renderPraylist = () => {
    let ENTRIES1 = [
      {
        title: 'Favourites',
        illustration:
          'https://cdn.dribbble.com/users/288987/screenshots/2416384/exodus.png',
        // illustration: require('../../assets/piusLBG.png')
      },
      {
        title: 'Love',
        illustration:
          'https://cdn.dribbble.com/users/288987/screenshots/2275389/journey.jpg',
      },
      {
        title: 'Strength',
        illustration:
          'https://cdn.dribbble.com/users/288987/screenshots/2757996/rhinos3.jpg',
      },
      {
        title: 'Fear',
        illustration:
          'https://cdn.dribbble.com/users/288987/screenshots/2154354/elephant.jpg',
      },
      {
        title: 'Anxiety',
        illustration:
          'https://cdn.dribbble.com/users/288987/screenshots/2416384/exodus.png',
      },
      {
        title: 'Faith',
        illustration:
          'https://cdn.dribbble.com/users/288987/screenshots/2275389/journey.jpg',
      },
      {
        title: 'Healing',
        illustration:
          'https://cdn.dribbble.com/users/288987/screenshots/2757996/rhinos3.jpg',
      },
      {
        title: 'Hope',
        illustration:
          'https://cdn.dribbble.com/users/288987/screenshots/2416384/exodus.png',
      },
      {
        title: 'Marriage',
        illustration:
          'https://cdn.dribbble.com/users/288987/screenshots/2275389/journey.jpg',
      },
      {
        title: 'More Soon...',
        illustration:
          'https://cdn.dribbble.com/users/288987/screenshots/3342177/fox-tale.jpg',
      },
    ];

    return (
      <Block flex={false}>
        <Carousel
          data={ENTRIES1}
          renderItem={this._renderItem.bind(this)}
          sliderWidth={WIDTH}
          itemWidth={WIDTH * 0.4}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          enableMomentum={true}
          activeSlideAlignment={'start'}
          activeAnimationType={'spring'}
          activeAnimationOptions={{
            friction: 4,
            tension: 40,
          }}
        />
      </Block>
    );
  };

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
