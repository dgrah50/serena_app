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
    // const options = {
    //   headers: {'x-api-key': '9A6AF52A-CB55-47C1-9082-296BBF6BED1E'},
    // };
    // axios
    //   .get(
    //     'https://api.sermonaudio.com/v2/node/sermons?sortBy=downloads&searchKeyword=' +
    //       query,
    //     options,
    //   )
    //   .then(response => {
    //     this.setState({
    //       sermons: response.data.results,
    //     });
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
  }

  renderVerseCard() {
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

  _renderItem(item) {
    let uri = undefined;
    let speakerName = undefined;
    let duration = item.media.audio[0].duration;
    var measuredTime = new Date(null);
    measuredTime.setSeconds(duration); // specify value of SECONDS
    var MHSTime = measuredTime.toISOString().substr(11, 8);

    if (item.speaker) {
      uri = item.speaker.albumArtURL
        .replace('{size}', 80)
        .replace('{size}', 80);
      speakerName = item.speaker.displayName;
    } else {
      uri = 'https://via.placeholder.com/50';
    }

    return (
      <TouchableOpacity
        key={item.sermonID}
        onPress={() => {
          this.props.navigation.navigate('Player', {
            sermon: item,
          });
        }}>
        <Card shadow center middle style={{height: 100}}>
          <Block middle center row>
            <Image
              style={{width: 80, height: 80, borderRadius: 10, marginRight: 10}}
              source={{
                uri: uri,
              }}
            />
            <Block middle>
              <Text title numberOfLines={1}>
                {item.fullTitle}
              </Text>
              <Text caption secondary>
                {speakerName}
              </Text>
              <Text right h3 light>
                {MHSTime}
              </Text>
            </Block>
          </Block>
        </Card>
      </TouchableOpacity>
    );
  }

  renderSermons() {
    return (
      <Block>
        <Text h3 spacing={1} style={{marginVertical: 8}}>
          Related Sermons
        </Text>
        {this.state.sermons.map(sermon => {
          return this._renderItem(sermon);
        })}
      </Block>
    );
  }

  renderSpinner() {
    return (
      <Block center middle>
        <Bars size={25} color="#000" />
      </Block>
    );
  }

  render() {
    return (
      <React.Fragment>
        <ScrollView style={styles.welcome} showsVerticalScrollIndicator={false}>
          {this.renderVerseCard()}
          <Block color="gray3" style={styles.hLine} />
          {this.state.sermons
            ? {
                /* this.renderSermons() */
              }
            : this.renderSpinner()}
        </ScrollView>
      </React.Fragment>
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
