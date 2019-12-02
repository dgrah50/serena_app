import React, {Component} from 'react';
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
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-snap-carousel';
import {Block, Badge, Card, Text} from '../components';
import {styles as blockStyles} from '../components/Block';
import {styles as cardStyles} from '../components/Card';
import {theme, mocks, time} from '../constants';
import {Bars} from 'react-native-loader';
import axios from 'axios';

const {width} = Dimensions.get('window');

export default class OneVerse extends Component {
  static navigationOptions = {
    headerLeft: (
      <Block left style={{paddingLeft: 10}}>
        <Text gray style={theme.fonts.title}>
          {time.DateNow.weekday}
          {', '}
          <Text style={theme.fonts.title}>
            {time.DateNow.month} {time.DateNow.date}
          </Text>
        </Text>
      </Block>
    ),
    headerRight: (
      <TouchableOpacity>
        <Block flex={false}>
          <Image
            resizeMode="contain"
            source={require('../assets/images/Icon/Menu.png')}
            style={{width: 45, height: 18, paddingRight: 40}}
          />
        </Block>
      </TouchableOpacity>
    ),
  };

  constructor(props) {
    super(props);
    this.state = {
      sermons: undefined,
    };
  }

  componentDidMount() {
    let query = this.props.navigation.getParam('response').keyword;
    this.setState({
      sermons: this.props.navigation.getParam('response').sermons,
    });
    console.log(this.props.navigation.getParam('response'));
  }

  render() {
    return (
      <React.Fragment>
        <ScrollView style={styles.welcome} showsVerticalScrollIndicator={false}>
          {this._renderVerseCard()}
          <Block color="gray3" style={styles.hLine} />
          {this.state.sermons ? this._renderSermons() : this._renderSpinner()}
        </ScrollView>
      </React.Fragment>
    );
  }

  //****** SUB COMPONENTS SECTION
  _renderVerseCard() {
    let navprop = this.props.navigation.getParam('response').verses;
    let verses = [
      {
        verse:
          'You will seek Me and find Me when you search for Me with all your heart.',
        bookname: 'Jeremiah 29:13',
      },
    ];
    if (navprop.length != 0) {
      verses = navprop;
    }

    return (
      <Card shadow>
        <Block>
          <Block center>
            <Text h2 style={{marginVertical: 8}}>
              {verses[0].verse}
            </Text>
          </Block>
          <Block center>
            <Text h3 style={{marginVertical: 8}}>
              {verses[0].bookname}
            </Text>
          </Block>
        </Block>
        <Block row middle space={'between'}>
          <TouchableOpacity>
            <Icon.Button name="heart" backgroundColor={theme.colors.accent}>
              Like
            </Icon.Button>
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon.Button name="share-alt" backgroundColor={theme.colors.share}>
              Share
            </Icon.Button>
          </TouchableOpacity>
        </Block>
      </Card>
    );
  }
  _renderItem(item,idx) {
    console.log(item);
    let uri = item.speakerimg;
    let speakerName = item.author;
    let duration = item.duration;

    // if (item.speaker) {
    //   uri = item.speaker.albumArtURL
    //     .replace('{size}', 80)
    //     .replace('{size}', 80);
    //   speakerName = item.speaker.displayName;
    // } else {
    //   uri = 'https://via.placeholder.com/50';
    // }

    return (
      <TouchableOpacity
        key={idx}
        onPress={() => {
          this.props.navigation.navigate('Player', {
            sermon: item,
          });
        }}>
        <Card shadow center middle style={{height: 100}}>
          <Block middle center row>
            <Image
              style={{
                width: 80,
                height: 80,
                borderRadius: 10,
                marginRight: 10,
              }}
              source={{
                uri: uri,
              }}
            />
            <Block middle>
              <Text title numberOfLines={1}>
                {item.title}
              </Text>
              <Text caption secondary>
                {speakerName}
              </Text>
              <Text right h3 light>
                {duration}
              </Text>
            </Block>
          </Block>
        </Card>
      </TouchableOpacity>
    );
  }
  _renderSermons() {
    return (
      <Block>
        <Text h3 spacing={1} style={{marginVertical: 8}}>
          Related Sermons
        </Text>
        {this.state.sermons.map((sermon,idx) => {
          return this._renderItem(sermon,idx);
        })}
      </Block>
    );
  }
  _renderSpinner() {
    return (
      <Block center middle>
        <Bars size={25} color="#000" />
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    paddingTop: 2 * theme.sizes.padding,
    paddingHorizontal: theme.sizes.padding,
    backgroundColor: theme.colors.gray4,
  },
  // horizontal line
  hLine: {
    marginVertical: theme.sizes.base * 2,
    marginHorizontal: theme.sizes.base * 2,
    height: 1,
  },
});
