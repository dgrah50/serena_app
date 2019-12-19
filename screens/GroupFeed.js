import React, {Component} from 'react';
import axios from 'axios';
import qs from 'qs';
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
import firebase from 'react-native-firebase';
import {
  StreamApp,
  FlatFeed,
  StatusUpdateForm,
  LikeButton,
  Activity,
  CommentBox,
  CommentList,
  ReactionIcon,
  ReactionToggleIcon,
  ReactionIconBar
} from 'react-native-activity-feed';
var stream = require('getstream');
const HeartIcon = require('../assets/icons/heart.png');
const HeartIconOutline = require('../assets/icons/heart-outline.png');
const ReplyIcon = require('../assets/icons/reply.png');

const {width} = Dimensions.get('window');

const CustomActivity = props => {
  console.log(props)
    _onPress = () => {
      const {
        activity,
        reaction,
        reactionKind,
        onToggleReaction,
        onToggleChildReaction,
      } = this.props;

      if (reaction && onToggleChildReaction) {
        return onToggleChildReaction(reactionKind, reaction, {}, {});
      }
      return onToggleReaction(reactionKind, activity, {}, {});
    };
  return (
    <Activity
      {...props}
      Footer={
        <View style={{paddingBottom: 15, paddingLeft: 15, paddingRight: 15}}>
          <ReactionIconBar>
            <ReactionToggleIcon
              {...props}
              activeIcon={HeartIcon}
              inactiveIcon={HeartIconOutline}
              kind={'like'}
              counts={props.activity.reaction_counts}
              width={24}
              height={24}
              labelSingle="like"
              labelPlural="likes"
              onPress={this._onPress}
            />
            <ReactionIcon
              icon={ReplyIcon}
              counts={props.activity.reaction_counts}
              kind={'comment'}
              width={24}
              height={24}
            />
          </ReactionIconBar>
        </View>
      }
    />
  );
};

export default class GroupFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      token: null,
    };
    firebase
      .auth()
      .currentUser.getIdToken()
      .then(idToken => {
        console.log(idToken);
      })
      .catch(error => {
        console.log(error);
      });
    const response = null;
  }

  componentDidMount() {
    axios
      .post(
        'http://localhost:8000/api/users/token',
        qs.stringify({content: 'testUserID'}),
      )
      .then(res => {
        this.setState({
          loading: false,
          token: res.data,
        });
      });
  }

  render() {
    return (
      <View style={styles.welcome}>
        {!this.state.loading && (
          <StreamApp
            apiKey="zgrr2ez3h3yz"
            appId="65075"
            token={this.state.token}>
            <FlatFeed
              feedGroup="groups"
              userId={this.props.navigation.getParam('groupID')}
              Activity={CustomActivity}
              notify
            />
            <StatusUpdateForm
              feedGroup="groups"
              userId={this.props.navigation.getParam('groupID')}
            />
          </StreamApp>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    paddingTop: 2 * theme.sizes.padding,
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
