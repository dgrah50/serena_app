import React, {Component, useRef, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {Text, Block} from '../components';
import {theme} from '../constants';
import {
  StreamApp,
  LikeButton,
  Activity,
  ReactionIcon,
  CommentList,
  CommentItem,
  RepostList,
  ReactionList,
  CommentBox,
  SinglePost,
  LikeList,
} from 'react-native-activity-feed';
const ReplyIcon = require('../assets/icons/chat.png');
const {height, width} = Dimensions.get('window');
import firebase from 'react-native-firebase';
export default function SinglePostScreen(props) {
  console.log(props);
  const activity = props.navigation.getParam('activity');
  const feedGroup = props.navigation.getParam('feedGroup');
  console.log(activity);

  const CustomActivity = props => {
    return (
      <React.Fragment>
        <Activity
          {...props}
          Footer={
            <View>
              
              <LikeList
                activityId={props.activity.id}
                reactions={props.activity.latest_reactions}
              />
              <CommentList
                activityId={props.activity.id}
                reactions={props.activity.latest_reactions}
              />
            </View>
          }
        />
        <View style={{backgroundColor: theme.colors.gray3, height: 10}}></View>
      </React.Fragment>
    );
  };

  return (
    <SafeAreaView style={styles.welcome}>
      <StreamApp
        apiKey="zgrr2ez3h3yz"
        appId="65075"
        token={props.screenProps.StreamToken}>
        <SinglePost
          activity={activity}
          Activity={CustomActivity}
          feedGroup="groups"
          userId="Serena"
        />
      </StreamApp>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  welcome: {
    flex: 1,
    height: 500,
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
