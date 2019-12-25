import React from 'react';
import {Dimensions, StyleSheet, View, SafeAreaView} from 'react-native';
import {Text, Block} from '../components';
import {theme} from '../constants';
import {
  StreamApp,
  Activity,
  CommentList,
  SinglePost,
  LikeList,
  LikeButton,
  CommentBox,
  CommentItem,
} from 'react-native-activity-feed';
const {height, width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';

export default function SinglePostScreen(props) {
  const activity = props.navigation.getParam('activity');
  const feedGroup = props.navigation.getParam('feedGroup');

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
                CommentItem={({comment}) => (
                  <React.Fragment>
                    <CommentItem
                      comment={comment}
                      Footer={<LikeButton reaction={comment} {...props} />}
                    />
                  </React.Fragment>
                )}
              />
              <CommentBox
                onSubmit={text =>
                  props.onAddReaction('comment', activity, {text: text})
                }
                avatarProps={{
                  source: (userData: UserResponse) =>
                    userData.data.profileImage,
                }}
                styles={{container: {height: 78}}}
              />
            </View>
          }
        />
      </React.Fragment>
    );
  };

  return (
    <SafeAreaView style={styles.welcome}>
      <StreamApp
        apiKey="zgrr2ez3h3yz"
        appId="65075"
        style={styles.welcome}
        token={props.screenProps.StreamToken}>
        <Block center row middle flex={false} style={{height: height * 0.15}}>
          <Icon
            onPress={() => {
              props.navigation.goBack();
            }}
            style={{position: 'absolute', left: 20}}
            hitSlo
            name="chevron-left"
            size={25}
            color="black"
          />

          <Text center middle h2 black>
            Comments
          </Text>
        </Block>
        <SinglePost
          activity={activity}
          Activity={CustomActivity}
          feedGroup="groups"
          userId={feedGroup}
        />
      </StreamApp>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  welcome: {
    flex: 1,
    height: 500,
    backgroundColor: theme.colors.gray3,
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
