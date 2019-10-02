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
import rgba from 'hex-to-rgba';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  Block,
  Badge,
  Card,
  Text,
  AnimatedCircularProgress,
} from '../components';
import {styles as blockStyles} from '../components/Block';
import {styles as cardStyles} from '../components/Card';
import {theme, mocks, time} from '../constants';

const {width} = Dimensions.get('window');

let topicList = [
  'Love',
  'Peace',
  'Faith',
  'Healing',
  'Marriage',
  'Resurrection',
  'Fear',
  'Strength',
  'Prayer',
  'Grace',
  'Wisdom',
  'Worry',
  'Anger',
  'Holy Spirit',
];

let emotions = {
  happy: [
    'Amazed',
    'Content',
    'Faithful',
    'Happy',
    'Hopeful',
    'Joyful',
    'Loved',
    'Optimistic',
    'Peaceful',
    'Thankful',
  ],
  angry: [
    'Angry',
    'Annoyed',
    'Disrespected',
    'Frustrated',
    'Hateful',
    'Hostile',
    'Irrational',
    'Jealous',
    'Rage',
  ],
  sad: [
    'Ashamed',
    'Depressed',
    'Discouraged',
    'Forgotten',
    'Hopeless',
    'Hurt',
    'Lonely',
    'Sad',
    'Sick',
    'Tired',
  ],
  shocked: [
    'Abandoned',
    'Afraid',
    'Anxious',
    'Confused',
    'Lost',
    'Nervous',
    'Overwhelmed',
    'Stressed',
    'Uncomfortable',
    'Worried',
  ],
};

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
    };
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

  renderMicRing() {
    return (
      <Card shadow>
        <Block center middle>
          <Text h3>
            How are you feeling, Dayan? Hold the mic button to speak
          </Text>
          <AnimatedCircularProgress
            onAnimationComplete={() => {
              console.log('animation done');
            }}
            ref={ref => (this.circularProgress = ref)}
            tintColor={this.state.ringVisible ? 'red' : 'rgba(0,0,0,0)'}>
            {fill => this.micButton()}
          </AnimatedCircularProgress>
        </Block>
      </Card>
    );
  }

  micButton() {
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
          <Icon name={'microphone'} size={60} color={'#5334B8'} />
        </View>
      </TouchableOpacity>
    );
  }

  stopListen() {
    try {
      this.circularProgress.stopAnimate();
    } catch (e) {
      console.log(e);
    }
    this.setState({
      typedText: '',
      listening: false,
      ringVisible: false,
    });
  }
  setRingOn() {
    this.setState({ringVisible: true}, () =>
      this.circularProgress.reAnimate(0, 100, 8000, Easing.quad),
    );
  }

  renderTopicChips() {
    return (
      <Card shadow>
        <Block center middle>
          <Text h3> What does the Bible say about... </Text> 
          <ScrollView horizontal={true}>
            {topicList.map(topic => {
              return (
                <Block style={{padding:5}}>
                  <RNChipView title={topic} avatar={false} />
                </Block>
              );
            })}
          </ScrollView>
        </Block>
      </Card>
    );
  }
  renderEmotionChips() {
    return (
      <Card shadow>
        <Block center middle>
          <Text h3> How are you feeling? </Text> 
          <ScrollView horizontal={true}>
            {["😀","😡","😔","😨"].map(topic => {
              return (
                <Block style={{padding:5}}>
                  <RNChipView title={topic} avatar={false} />
                </Block>
              );
            })}
          </ScrollView>
        </Block>
      </Card>
    );
  }

  renderNavBar() {
    const {navigation} = this.props;

    return (
      <Block center middle style={styles.endTrip}>
        <Card
          shadow
          row
          style={{
            width: '90%',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Welcome')}>
            <Icon name="square" size={62 / 2.5} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Welcome')}>
            <Icon name="square" size={62 / 2.5} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Welcome')}>
            <Icon name="square" size={62 / 2.5} color="black" />
          </TouchableOpacity>
        </Card>
      </Block>
    );
  }

  render() {
    return (
      <React.Fragment>
        <ScrollView style={styles.welcome} showsVerticalScrollIndicator={false}>
          {this.renderMicRing()}
          <Block color="gray3" style={styles.hLine} />
          {this.renderTopicChips()}
          {this.renderEmotionChips()}
        </ScrollView>
        {this.renderNavBar()}
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    paddingVertical: theme.sizes.padding,
    paddingHorizontal: theme.sizes.padding,
    backgroundColor: theme.colors.gray4,
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
