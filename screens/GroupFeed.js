import React, {Component, useRef, useState} from 'react';
import {Dimensions, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text, Block} from '../components';
import {theme} from '../constants';
import {
  StreamApp,
  FlatFeed,
  StatusUpdateForm,
  LikeButton,
  Activity,
  ReactionIcon,
} from 'react-native-activity-feed';
const ReplyIcon = require('../assets/icons/chat.png');
const {height, width} = Dimensions.get('window');

export default function GroupFeed(props) {
  const onpresscomment = (id, act) => {
    props.navigation.navigate('SinglePostScreen', {
      activity: act,
      feedGroup: act.feedGroup,
    });
  };
  const CustomActivity = props => {
    return (
      <React.Fragment>
        <Activity
          {...props}
          Footer={
            <View
              style={{paddingBottom: 15, paddingLeft: 15, paddingRight: 15}}>
              <Block row center space={'between'}>
                <LikeButton reactionKind="like" {...props} />
                <ReactionIcon
                  onPress={() => {
                    onpresscomment(props.activity.id, props.activity);
                  }}
                  icon={ReplyIcon}
                  counts={props.activity.reaction_counts}
                  kind={'comment'}
                  labelSingle={'comment'}
                  labelPlural={'comments'}
                  width={20}
                  height={20}
                />
              </Block>
            </View>
          }
        />
        <View style={{backgroundColor: theme.colors.gray3, height: 10}}></View>
      </React.Fragment>
    );
  };

  return (
    <View style={styles.welcome}>
      <StreamApp
        apiKey="zgrr2ez3h3yz"
        appId="65075"
        token={props.screenProps.StreamToken}>
        <Block center middle flex={false} style={{height: height * 0.15}}>
          <Text center middle h2 black>
            {props.navigation.getParam('groupID')}
          </Text>
        </Block>
        <View>
          <StatusUpdateForm
            feedGroup="groups"
            userId={props.navigation.getParam('groupID')}
          />
        </View>

        <FlatFeed
          feedGroup="groups"
          userId={props.navigation.getParam('groupID')}
          Activity={CustomActivity}
          notify
        />
      </StreamApp>
    </View>
  );
}

const styles = StyleSheet.create({
  welcome: {
    flex: 1,
    justifyContent: 'flex-start',
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
