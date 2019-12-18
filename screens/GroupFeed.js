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
} from 'react-native-activity-feed';
var stream = require('getstream');

const {width} = Dimensions.get('window');


const CustomActivity = props => {
  return (
    
      <Activity
        {...props}
        Footer={props => {
          return (
            <React.Fragment>
              <CommentBox
                onSubmit={text =>
                  props.onAddReaction('comment', props.activity, {text: text})
                }
                avatarProps={{
                  source: userData => userData.data.profileImage,
                }}
                styles={{container: {height: 78}}}
              />
              <CommentList
                CommentItem={({comment}) => <CommentItem comment={comment} />}
                activityId={activity.id}
                reactions={activity.latest_reactions}
              />
            </React.Fragment>
          );
        }}
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
      <View style={{flex: 1, paddingTop: '10%'}}>
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
