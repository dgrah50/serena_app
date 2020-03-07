import React, {Component} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Block, Card, Text, Input} from '../components';
import {theme} from '../constants';
import firebase from 'react-native-firebase';
import LinearGradient from 'react-native-linear-gradient';
const Fuse = require('fuse.js');
const {width} = Dimensions.get('window');
const stream = require('getstream');

export default class Groups extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Groups',
      headerTransparent: true,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Profile');
          }}>
          <Block center middle style={{paddingRight: 20}}>
            <Icon color={'black'} name="bars" size={30} />
          </Block>
        </TouchableOpacity>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      subscribedGroups: [],
      nonFollowedGroups: [],
      groupSearch: '',
      fuse: null,
      searching: false,
      filteredGroups: null,
    };
    this.fuse = null;
  }

  componentDidMount() {
    this.willFocusListener = this.props.navigation.addListener(
      'willFocus',
      () => {
        this.fetchGroups();
      },
    );
  }

  fetchGroups() {
    let firestoreref = firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('Info')
      .doc('groups');
    firestoreref
      .get()
      .then(res => {
        this.setState({
          subscribedGroups: res.data().subscribed,
        });
      })
      .then(() => {
        console.log(this.state.subscribedGroups);
        let firestoreref2 = firebase.firestore().collection('groups');
        firestoreref2.get().then(snapshot => {
          let nonFollowedGroups = snapshot.docs
            .map(doc => doc.id)
            .filter(x => !this.state.subscribedGroups.includes(x));
          this.setState(
            {
              nonFollowedGroups: nonFollowedGroups,
            },
            () => {
              var options = {
                shouldSort: true,
                threshold: 0.6,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 1,
                keys: ['title'],
              };
              this.fuse = new Fuse(this.state.nonFollowedGroups, options);
            },
          );
        });
      });
  }
  componentWillUnmount() {
    this.willFocusListener.remove();
  }

  render() {
    return (
      <View
        style={{
          width: '100%',
          flex: 1,
          paddingTop: '20%',
          backgroundColor: theme.colors.bg,
        }}>
        {this._renderGroups()}
      </View>
    );
  }

  _renderGroup = (item, idx) => {
    return (
      <TouchableOpacity
        key={idx}
        onPress={() => {
          client = stream.connect(
            'zgrr2ez3h3yz',
            this.props.screenProps.StreamToken,
            '65075',
          );
          client
            .user(firebase.auth().currentUser.uid)
            .get()
            .then(StreamUser => {
              if (StreamUser.data.name == 'Unknown') {
                this.props.navigation.navigate('Profile');
              } else {
                this.props.navigation.navigate('GroupFeed', {
                  groupID: item,
                });
              }
            })
            .catch(err => {
              console.log(err);
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

  _renderSearchResults = () => {
    if (this.state.filteredGroups) {
      return this.state.filteredGroups.map((currElement, index) => {
        return this._renderGroup(currElement, index);
      });
    }
    return null;
  };

  _renderRegularResults = () => {
    if (this.state.subscribedGroups) {
      return this.state.subscribedGroups.map((currElement, index) => {
        return this._renderGroup(currElement, index);
      });
    }
    return null;
  };

  _renderGroups = () => {
    return (
      <React.Fragment>
        <Card style style={{backgroundColor: 'rgba(0,0,0,0)'}} flex={false}>
          <Input
            label={'Search for groups'}
            onFocus={() => this.setState({searching: true})}
            rightLabel={
              <TouchableOpacity
                onPress={() => this.setState({searching: false})}>
                <Text style={{color: 'red'}}>Cancel</Text>
              </TouchableOpacity>
            }
            // onEndEditing={() => this.setState({searching: false})}
            onChangeTextHandler={this.searchGroupHandler}
          />
        </Card>
        <Block flex={false} white style={{paddingLeft: 20, paddingBottom: 20}}>
          <Text h3 white>
            Your Serena Groups
          </Text>
        </Block>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            marginHorizontal: width * 0.05,
          }}>
          {this.state.searching
            ? this._renderSearchResults()
            : this._renderRegularResults()}
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('CreateGroup')}>
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
        </ScrollView>
      </React.Fragment>
    );
  };

  searchGroupHandler = e => {
    if (!this.state.searching) {
      this.setState({searching: true});
    }
    this.setState(
      {
        groupSearch: e,
      },
      () => {
        this.setState({
          filteredGroups: this.fuse
            .search(this.state.groupSearch)
            .map(idx => this.state.nonFollowedGroups[idx]),
        });
      },
    );
  };
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
  }
});
