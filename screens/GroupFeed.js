import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, View, SafeAreaView} from 'react-native';
import {Text, Block} from '../components';
import {theme} from '../constants';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  StreamApp,
  FlatFeed,
  StatusUpdateForm,
  LikeButton,
  Activity,
  ReactionIcon,
} from 'react-native-activity-feed';
import LinearGradient from 'react-native-linear-gradient';
import firebase from 'react-native-firebase';
const ReplyIcon = require('../assets/icons/chat.png');
const {height, width} = Dimensions.get('window');

export default function GroupFeed(props) {
  const onpresscomment = (id, act) => {
    props.navigation.navigate('SinglePostScreen', {
      activity: act,
      feedGroup: props.navigation.getParam('groupID'),
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

  const [bio, setBio] = useState(null);

  useEffect(() => {
    let firestoreref = firebase
      .firestore()
      .collection('groups')
      .doc(props.navigation.getParam('groupID'));
    firestoreref.get().then(res => {
      setBio(res.data().bio);
    });
  }, []);

  return (
    <View style={styles.welcome}>
      <LinearGradient
        colors={['rgba(76, 102, 159, 0.4)', 'rgba(76, 102, 159, 0.8)']}
        style={{height: height * 0.20, justifyContent:"center",alignItems:"center"}}>
          <Icon
            onPress={() => {
              props.navigation.goBack();
            }}
            style={{position: 'absolute', left: 20}}
            name="chevron-left"
            size={25}
            color="black"
          />
          <Text center middle h2 black style={{paddingBottom: 20}}>
            {props.navigation.getParam('groupID')}
          </Text>
          <Text>{bio}</Text>
      </LinearGradient>

      <StreamApp
        apiKey="zgrr2ez3h3yz"
        appId="65075"
        token={props.screenProps.StreamToken}>
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
