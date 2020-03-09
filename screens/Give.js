import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import {Block, Text, Button} from '../components';
import {theme} from '../constants';
import {DOMParser} from 'xmldom';
const {width} = Dimensions.get('window');
import {_renderPodcast} from '../components/VerseSermonCards';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default class Give extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Give',
      // headerTransparent: true,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Profile');
          }}></TouchableOpacity>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      podcasts: [],
      podcastDetail: null,
    };
  }

  render() {
    return (
      <Block style={styles.welcome}>
        <Image
          style={{
            width: '100%',
            height:'100%',
            resizeMode: 'stretch',
          }}
          source={require('../assets/images/givemock.jpg')}
        />
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    backgroundColor: theme.colors.bg,
    alignContent: 'center',
    flex: 1,
    width: '100%',
  },
  header: {
    width: '100%',
    height: width * 0.3,
    marginBottom: 10,
  },
});
