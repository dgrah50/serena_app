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

const mockMessages = [
  {
    groupname: 'Serena Community',
    groupID: 'Serena',
    bio: 'The home of the Serena App',
    message: 'Welcome to the app!',
    imageURL:
      'https://scontent-lhr3-1.xx.fbcdn.net/v/t1.0-9/p960x960/78941335_112769923535574_2271841299319488512_o.jpg?_nc_cat=104&_nc_ohc=d8wUMTvCISgAQlP2eSaGoO6ymrxjEOhNBRLhNHrjA-Hui43zoBs_7hwHQ&_nc_ht=scontent-lhr3-1.xx&oh=42b1f813c1020d4f727b7a147b5936b1&oe=5E715D4B',
  },
  {
    groupname: 'Inspiration Group',
    message: 'Isaiah 54:16',
    imageURL: 'https://apprecs.org/ios/images/app-icons/256/ca/565301194.jpg',
  },
  {
    groupname: 'Marriage Support Group',
    message: 'Isaiah 54:16',
    imageURL:
      'https://viviamaridi.com/wp-content/uploads/2019/02/01_marriage_icon.png',
  },
  {
    groupname: 'Net Church Dartford Youth Group',
    message: 'Isaiah 54:16',
    imageURL:
      'https://icon-library.net/images/church-icon-png/church-icon-png-19.jpg',
  },
];

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

  _renderGroup = item => {
    return (
      <TouchableOpacity
        onPress={() => {
          
          this.props.navigation.navigate('GroupFeed', {
            groupID: item.groupID,
          });
        }}>
        <Card
          center
          row
          flex={false}
          shadow
          space={'between'}
          style={{paddingHorizontal: '5%', marginVertical: 0}}>
          <Block flex={false}>
            <Image
              resizeMode="contain"
              source={{
                uri: item.imageURL,
              }}
              style={{
                width: 50,
                height: 50,
                paddingHorizontal: 20,
                borderRadius: 25,
                resizeMode: 'contain',
              }}
            />
          </Block>
          <Block style={{paddingLeft: 20}}>
            <Text h3 bold>
              {item.groupname}
            </Text>
            <Text blue caption>
              {item.message}
            </Text>
          </Block>
          <Block flex={false}>
            <Icon color={theme.colors.primary} name="circle" size={20} />
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
        <ScrollView showsVerticalScrollIndicator={false}>
          {mockMessages.map(item => {
            return this._renderGroup(item);
          })}
          <TouchableOpacity>
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
          <TouchableOpacity onPress={ () =>{ 
            firebase.auth().signOut()
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
    return <View style={{flex: 1, paddingTop: '10%'}}>{this._renderGroups()}</View>;
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
