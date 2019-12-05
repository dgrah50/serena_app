import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import rgba from 'hex-to-rgba';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {Block, Badge, Card, Text, Input} from '../components';
import {styles as blockStyles} from '../components/Block';
import {styles as cardStyles} from '../components/Card';
import {theme, mocks, time} from '../constants';
import {GiftedChat} from 'react-native-gifted-chat';

const {width} = Dimensions.get('window');

export default class Chats extends Component {
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

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
  }
  componentWillMount() {
    const avatarImg = this.props.navigation.getParam('imageURL')

    this.setState({
      messages: [
        {
          _id: 1,
          text:
            'This is a group in which you can share your verses of the day.',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Serena',
            avatar: avatarImg,
          },
        },
        {
          _id: 2,
          text: 'Welcome to Serena.',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: avatarImg,
          },
        },
      ],
    });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  render() {
    return (
      <Block style={styles.welcome} flex={false}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    paddingTop: 2 * theme.sizes.padding,
    paddingBottom: theme.sizes.padding,
    paddingHorizontal: theme.sizes.padding,
    backgroundColor: theme.colors.gray4,
    alignContent: 'center',
    flex: 1,
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
