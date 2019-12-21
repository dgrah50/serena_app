import React, {Component} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
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

export default class GroupFeed extends Component {
  constructor(props) {
    super(props);
    console.log(props.screenProps.StreamToken);

    this.state = {
      token: props.screenProps.StreamToken,
    };
  }

  render() {
    return (
      <View style={styles.welcome}>
        <StreamApp
          apiKey="zgrr2ez3h3yz"
          appId="65075"
          token={this.props.screenProps.StreamToken}>
          <Block center middle flex={false} style={{height: height * 0.15}}>
            <Text center middle h2 black>
              {this.props.navigation.getParam('groupID')}
            </Text>
          </Block>
          <View>
            <StatusUpdateForm
              feedGroup="groups"
              userId={this.props.navigation.getParam('groupID')}
            />
          </View>

          <FlatFeed
            feedGroup="groups"
            userId={this.props.navigation.getParam('groupID')}
            Activity={CustomActivity}
            notify
          />
        </StreamApp>
      </View>
    );
  }
}

const CustomActivity = props => {
  return (
    <React.Fragment>
      <Activity
        {...props}
        Footer={
          <View style={{paddingBottom: 15, paddingLeft: 15, paddingRight: 15}}>
            <Block row center space={'between'}>
              <LikeButton reactionKind="like" {...props} />
              <ReactionIcon
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
