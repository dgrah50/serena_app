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
    <React.Fragment>
      <Activity
        {...props}
        Footer={props => {
          return (
            <CommentBox
              onSubmit={text =>
                props.onAddReaction('comment', props.activity, {text: text})
              }
              avatarProps={{
                source: userData => userData.data.profileImage,
              }}
              styles={{container: {height: 78}}}
            />
          );
        }}
      />
      <CommentList
        CommentItem={({comment}) => <CommentItem comment={comment} />}
        activityId={props.activity.id}
        reactions={props.activity.latest_reactions}
      />
    </React.Fragment>
  );
};

export default class Groups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      token: null,
      groups: [],
    };

    const response = null;
  }

  componentDidMount() {
    firebase
      .auth()
      .currentUser.getIdToken()
      .then(idToken => {
        axios
          .post(
            'http://localhost:8000/api/users/token',
            qs.stringify({content: idToken}),
          )
          .then(res => {
            this.setState({
              loading: false,
              token: res.data,
            });
          });
      })
      .catch(error => {
        console.log(error);
      });

    let firestoreref = firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('Info')
      .doc('groups');
    firestoreref.get().then(res => {
      this.setState({
        groups: res.data().subscribed,
      });
    });
  }

  _renderGroup = (item,idx )=> {
    return (
      <TouchableOpacity
        key={idx}
        onPress={() => {
          this.props.navigation.navigate('GroupFeed', {
            groupID: item,
          });
        }}>
        <Card
          center
          row
          flex={false}
          shadow
          space={'between'}
          style={{paddingHorizontal: '5%', marginVertical: 0}}>
          <Block style={{paddingLeft: 20}}>
            <Text h3 bold>
              {item}
            </Text>
          </Block>
          <Block flex={false}>
            <Icon color={theme.colors.primary} name="chevron-right" size={20} />
          </Block>
        </Card>
      </TouchableOpacity>
    );
  };

  _renderGroups = () => {
    return (
      <React.Fragment>
        <Card flex={false}>
          <Input label={'Search for groups'} />
        </Card>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{paddingTop: 20, marginHorizontal: width*0.05} }>
          {this.state.groups.map((currElement, index) => {
            return this._renderGroup(currElement, index);
          })}
          <TouchableOpacity
          onPress={() =>   this.props.navigation.navigate('CreateGroup')}
          >
            <Card
              center
              middle
              shadow
              flex={false}
              row
              style={{marginHorizontal: '20%'}}>
              <Icon
                color={theme.colors.black}
                name="plus"
                size={20}
                style={{marginHorizontal: 10}}
              />
              <Text h3>Create a new group</Text>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              firebase.auth().signOut();
            }}>
            <Card
              center
              middle
              shadow
              flex={false}
              row
              style={{marginHorizontal: '20%'}}>
              <Icon
                color={theme.colors.black}
                name="plus"
                size={20}
                style={{marginHorizontal: 10}}
              />
              <Text h3>SIGN OUT</Text>
            </Card>
          </TouchableOpacity>
        </ScrollView>
      </React.Fragment>
    );
  };

  _renderSpecificFeed() {
    return (
      <View style={{flex: 1, paddingTop: '10%'}}>
        {!this.state.loading && (
          <StreamApp
            apiKey="zgrr2ez3h3yz"
            appId="65075"
            token={this.state.token}>
            <FlatFeed
              feedGroup="user"
              userId="testUserID"
              Activity={CustomActivity}
              notify
            />
            <StatusUpdateForm feedGroup="user" userId="testUserID" />
          </StreamApp>
        )}
      </View>
    );
  }

  render() {
    return (
      <View style={{flex: 1, paddingTop: '10%'}}>{this._renderGroups()}</View>
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
