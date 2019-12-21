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

const {width} = Dimensions.get('window');

export default class Groups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      groups: [],
    };
  }

  componentDidMount() {
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

  render() {
    return (
      <View style={{flex: 1, paddingTop: '10%'}}>{this._renderGroups()}</View>
    );
  }

  _renderGroup = (item, idx) => {
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
          style={{
            paddingTop: 20,
            marginHorizontal: width * 0.05,
          }}>
          {this.state.groups.map((currElement, index) => {
            return this._renderGroup(currElement, index);
          })}
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

  _renderLogoutButton = () => {
    return (
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
          <Text h3>SIGN OUT</Text>
        </Card>
      </TouchableOpacity>
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
  },
  endTrip: {
    position: 'absolute',
    width: width,
    bottom: 0,
  },
});
