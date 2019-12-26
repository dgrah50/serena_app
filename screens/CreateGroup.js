import React, {Component} from 'react';
import axios from 'axios';
import qs from 'qs';
import {
  Dimensions,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Block, Button, Text, Input} from '../components';
import {theme} from '../constants';
import firebase from 'react-native-firebase';

const {height, width} = Dimensions.get('window');

export default class CreateGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupName: null,
      groupDesc: null,
      creationResult: null,
    };
  }


  render() {
    return (
      <Block style={styles.home}>
        <Block center row middle flex={false}>
          <Icon
            onPress={() => {
              this.props.navigation.goBack();
            }}
            style={{position: 'absolute', left: 20}}
            hitSlo
            name="chevron-left"
            size={25}
            color="black"
          />

          <Text center middle h2 black>
            Create a Group
          </Text>
        </Block>
        {this._renderInputAndButtons()}
      </Block>
    );
  }

  //****** SUB COMPONENTS SECTION
  _renderInputAndButtons() {
    return (
      <Block center style={{marginTop: 44}}>
        <Input
          full
          label="Group Name"
          style={{
            marginBottom: 25,
            color: theme.colors.black,
            borderColor: theme.colors.black,
          }}
          onChangeTextHandler={this.groupNameHandler}
        />
        <Input
          full
          label="Group Description"
          multiline={true}
          style={{
            marginBottom: 25,
            color: theme.colors.black,
            borderColor: theme.colors.black,
            height: height * 0.2,
          }}
          onChangeTextHandler={this.groupDescHandler}
        />

        <Button
          shadow
          style={{
            marginBottom: 12,
            width: width * 0.4,
          }}
          onPress={() => this.createNewGroup()}>
          <Text button white>
            CREATE NEW GROUP
          </Text>
        </Button>
      </Block>
    );
  }

  //****** HELPER FUNCTIONS SECTION
  groupNameHandler = e => {
    this.setState({
      groupName: e,
    });
  };
  groupDescHandler = e => {
    this.setState({
      groupDesc: e,
    });
  };

  createNewGroup() {
    if (!this.state.groupName || !this.state.groupDesc) {
      Alert.alert('Incomplete details entered ', 'Try again!', [{text: 'OK'}], {
        cancelable: false,
      });
    }
    axios
      .post(
        'http://localhost:8000/api/groups/create',
        qs.stringify({
          userID: firebase.auth().currentUser.uid.toString(),
          groupName: this.state.groupName,
          groupDesc: this.state.groupDesc,
        }),
      )
      .then(res => {
        console.log(res);
        if (res.data == 'group already exists') {
          Alert.alert('Group already exists', 'Try again!', [{text: 'OK'}], {
            cancelable: false,
          });
        } else if (res.data == 'Success') {
          Alert.alert(
            'Group created',
            'Success',
            [
              {
                text: 'OK',
                onPress: () => {
                  this.props.navigation.navigate('Groups');
                },
              },
            ],
            {
              cancelable: false,
            },
          );
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
}
const styles = StyleSheet.create({
  home: {
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
