import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import rgba from 'hex-to-rgba';
import Icon from 'react-native-vector-icons/FontAwesome';
import Follow from '../components/Notifications/Follow';
import Notification from '../components/Notification';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {Block, Badge, Card, Text, Input} from '../components';
import {styles as blockStyles} from '../components/Block';
import {styles as cardStyles} from '../components/Card';
import {theme, mocks, time} from '../constants';
import firebase from 'react-native-firebase';
import {
  StreamApp,
  FlatFeed,
  Activity,
  LikeButton,
  StatusUpdateForm,
  NotificationFeed,
  ReactionIcon,
} from 'react-native-activity-feed';
const {width} = Dimensions.get('window');

import CategoriesIcon from '../assets/icons/categories.png';
import PostIcon from '../assets/icons/post.png';
import ReplyIcon from '../assets/icons/reply.png';

export default Notifications = props => {
  const _renderGroup = ({activityGroup, styles, ...props}: any) => {
    let verb = activityGroup.activities[0].verb;
    if (verb === 'follow') {
      return <Follow activities={activityGroup.activities} styles={styles} />;
    } else if (verb === 'heart' || verb === 'repost') {
      return (
        <Notification activities={activityGroup.activities} styles={styles} />
      );
    } else {
      let activity = activityGroup.activities[0];
      return (
        <Activity
          activity={activity}
          {...props}
          Footer={
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <LikeButton activity={activity} {...props} />

              <ReactionIcon
                icon={ReplyIcon}
                labelSingle="comment"
                labelPlural="comments"
                counts={activityGroup.activities.reaction_counts}
                kind="comment"
              />
            </View>
          }
        />
      );
    }
  };
  //  _navListener: NavigationEventSubscription;
  const {navigation} = props.navigation;
  return (
    <View style={{flex: 1,paddingTop:"10%"}}>
      <StreamApp
        apiKey="27ynt5dv5wtm"
        appId="65297"
        token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoidXNlci1vbmUifQ.tBnzNBolwyioz7nLEgh6VOGI9T1HLssgGjmf6lMmcsQ">
        <NotificationFeed Group={_renderGroup} navigation={navigation} notify />
      </StreamApp>
    </View>
  );
};

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
  }
});
