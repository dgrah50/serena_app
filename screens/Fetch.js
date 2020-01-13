import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Easing,
} from 'react-native';
import {RNChipView} from 'react-native-chip-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import qs from 'qs';
import Voice from 'react-native-voice';
import {Block, Card, Text, AnimatedCircularProgress} from '../components';
import {theme, time, emotions} from '../constants';
import firebase from 'react-native-firebase';
import LinearGradient from 'react-native-linear-gradient';



const {width} = Dimensions.get('window');

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
      <LinearGradient
        colors={['rgba(76, 102, 159, 0.4)', 'rgba(76, 102, 159, 0.8)']}
        style={{
          width: '100%',
          flex: 1,
        }}>
        <ScrollView style={styles.welcome} showsVerticalScrollIndicator={false}>
          {this._renderMicRing()}
          {this._renderTopicChips()}
          {this._renderEmotionChips()}
        </ScrollView>
      </LinearGradient>
    );
  }

  //****** SUB COMPONENTS SECTION
  _renderTopicChips() {
    return (
      <Card shadow>
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
      </Card>
    );
  }
  //To be implemented. Each emoji needs to map to a sub emotion
  //List of sub emotions is given in emotions.emotions
  _renderEmotionChips() {
    return (
      <Card shadow>
        <Block center middle>
          <Text h3> How are you feeling? </Text>
          {this.state.EmojiEmotion ? (
            <React.Fragment>
              <ScrollView horizontal={true}>
                {emotions.emotions[this.state.EmojiEmotion].map(
                  (topic, idx) => {
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
                  },
                )}
              </ScrollView>
              <Icon
                name={'times-circle'}
                size={30}
                color={theme.colors.gray2}
                onPress={() => {
                  this.setState({EmojiEmotion: null});
                }}
              />
            </React.Fragment>
          ) : (
            <ScrollView horizontal={true}>
              {['😀', '😡', '😔', '😨'].map((topic, idx) => {
                return (
                  <Block style={{padding: 5}} key={topic}>
                    <RNChipView
                      onPress={() => {
                        this.setState({
                          EmojiEmotion: Object.keys(emotions.emotions)[idx],
                        });
                      }}
                      title={topic}
                      avatar={false}
                    />
                  </Block>
                );
              })}
            </ScrollView>
          )}
        </Block>
      </Card>
    );
  }
  _renderMicRing() {
    return (
      <Card shadow>
        <Block center middle>
          <Text h3>How are you feeling? Hold the mic button to speak.</Text>
          <AnimatedCircularProgress
            onAnimationComplete={() => {
              // console.log('animation done');
            }}
            ref={ref => (this.circularProgress = ref)}
            tintColor={this.state.ringVisible ? '#5692D0' : 'rgba(0,0,0,0)'}>
            {fill => this._renderMicButton()}
          </AnimatedCircularProgress>
          <Text h3>{this.state.typedText}</Text>
        </Block>
      </Card>
    );
  }
  _renderMicButton() {
    return (
      <TouchableOpacity
        hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
        onPressIn={this.setRingOn.bind(this)}
        onPressOut={this.stopListen.bind(this)}>
        <View
          style={[
            styles.buttonStyle,
            {backgroundColor: 'rgba(255, 255, 255, 0.8)'},
          ]}>
          <Icon name={'microphone'} size={60} color={'#5692D0'} />
        </View>
      </TouchableOpacity>
    );
  }

  //****** HELPER FUNCTIONS SECTION
  apiCall(query) {
    this.setState({fetched: false});
    axios
      .post(
        'http://ec2-3-133-129-208.us-east-2.compute.amazonaws.com:8000/api/verses',
        qs.stringify({content: query}),
      )
      .then(response => {
        this.setState({
          fetched: true,
        });
        this.props.navigation.navigate('OneVerse', {
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
}

const styles = StyleSheet.create({
  welcome: {
    paddingTop: 2 * theme.sizes.padding,
    paddingHorizontal: theme.sizes.padding,
  },
  // horizontal line
  hLine: {
    marginVertical: theme.sizes.base * 2,
    marginHorizontal: theme.sizes.base * 2,
    height: 1,
  },
  // vertical line
  vLine: {
    marginVertical: theme.sizes.base / 2,
    width: 1,
  },
  endTrip: {
    position: 'absolute',
    width: width,
    bottom: 0,
  },
});
