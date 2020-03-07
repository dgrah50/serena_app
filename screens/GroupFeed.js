import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, View, Alert, ViewComponent} from 'react-native';
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
  GroupFeed.navigationOptions = {
    title: props.navigation.getParam('groupID'),
    headerStyle: {
      backgroundColor: theme.colors.gray3,
    },
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };
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

  const joinGroup = () => {
    Alert.alert(
      'Do you want to join this the group?',
      '',
      [
        {
          text: 'Join',
          onPress: () => {
            joinGroupLogic();
          },
        },
        {
          text: 'Cancel',
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  const leaveGroup = () => {
    Alert.alert(
      'Do you want to leave the group?',
      '',
      [
        {
          text: 'Leave',
          onPress: () => {
            leaveGroupLogic();
          },
        },
        {
          text: 'Cancel',
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  const joinGroupLogic = () => {
    let firestoreref = firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('Info')
      .doc('groups');
    firestoreref
      .update({
        subscribed: firebase.firestore.FieldValue.arrayUnion(
          props.navigation.getParam('groupID'),
        ),
      })
      .then(() => {
        props.navigation.navigate('Groups');
      });
  };
  const leaveGroupLogic = () => {
    let firestoreref = firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('Info')
      .doc('groups');
    firestoreref
      .update({
        subscribed: firebase.firestore.FieldValue.arrayRemove(
          props.navigation.getParam('groupID'),
        ),
      })
      .then(() => {
        props.navigation.navigate('Groups');
      });
  };

  const [bio, setBio] = useState(null);
  const [inGroup, setInGroup] = useState(null);

  useEffect(() => {
    let firestoreref = firebase
      .firestore()
      .collection('groups')
      .doc(props.navigation.getParam('groupID'));
    firestoreref
      .get()
      .then(res => {
        setBio(res.data().bio);
      })
      .catch(err => {
        console.log(err);
      });

    let firestoreref2 = firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('Info')
      .doc('groups');
    firestoreref2.get().then(res => {
      setInGroup(
        res.data().subscribed.includes(props.navigation.getParam('groupID')),
      );
    });
  }, []);

  return (
    <View style={styles.welcome}>
      <StreamApp
        apiKey="zgrr2ez3h3yz"
        appId="65075"
        token={props.screenProps.StreamToken}>
        <View style={{paddingVertical: 20}}>
          <Block center middle flex={false} style={{padding: 5}}>
            <Text bold h3>
              {bio}
            </Text>

            {inGroup ? (
              <Icon
                onPress={() => {
                  leaveGroup();
                }}
                style={{position: 'absolute', right: 20}}
                name="sign-out"
                size={25}
                color="black"
              />
            ) : (
              <Icon
                onPress={() => {
                  joinGroup();
                }}
                style={{position: 'absolute', right: 20}}
                name="user-plus"
                size={25}
                color="black"
              />
            )}
          </Block>

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
  }
});
