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

const {width} = Dimensions.get('window');

export default class Overview extends Component {
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
    headerTitle: <Image 
    style={{width:30,height:30}}
    source={require('../assets/images/icon.png')} />,
    headerRight: (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Streak')}>
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

  renderVerseCard() {
    return (
      <Card shadow>
        <Block>
          <Block center>
            <Text h3 style={{marginVertical: 8}}>
              Good evening, Dayan. How are you feeling today?
            </Text>
          </Block>
          <Block row right>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Welcome')}>
              <Icon name="quote-right" size={42} color="black" />
            </TouchableOpacity>
          </Block>
        </Block>
      </Card>
    );
  }

  _renderSermon({item, index}) {
    return (
      <Card
        shadow
        style={{
          margin: 10,
          width: 150,
          height: 150,
          padding: 0,
        }}>
        <Image
          style={{
            width: '100%',
            height: '100%',
            borderRadius: theme.sizes.border,
          }}
          resizeMode="cover"
          source={{
            uri: item.speaker.albumArtURL
              .replace('{size}', 200)
              .replace('{size}', 200),
          }}
        />
        <Block
          center
          middle
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: '25%',
            paddingHorizontal: '10%',
            backgroundColor: 'white',
            borderBottomLeftRadius: theme.sizes.border,
            borderBottomRightRadius: theme.sizes.border,
          }}>
          <Text black center caption>
            {item.fullTitle}
          </Text>
        </Block>
      </Card>
    );
  }

  _renderVOD({item, index}) {
    console.log(item);
    return (
      <Card
        shadow
        style={{
          margin: 10,
          width: 150,
          height: 150,
          padding: 5,
        }}>
        <Block center>
          <Text black title center middle>
            {item.verse}
            {'\n'}
          </Text>
          <Text center gray numberOfLines={4}>
            {item.verseText}
          </Text>
        </Block>

        <Block
          center
          middle
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: '25%',
            backgroundColor: 'white',
            borderBottomLeftRadius: theme.sizes.border,
            borderBottomRightRadius: theme.sizes.border,
          }}>
          <Text caption>{item.date}</Text>
        </Block>
      </Card>
    );
  }

  renderRecommendations() {
    return (
      <Block>
        <Text h3 spacing={1} style={{marginVertical: 8}}>
          Recommended Sermons
        </Text>
        <Block style={{height: 180}}>
          <Carousel
            data={mocks.sermons}
            renderItem={this._renderSermon.bind(this)}
            sliderWidth={width}
            itemWidth={width * 0.4}
            inactiveSlideScale={1}
            inactiveSlideOpacity={0.8}
            enableMomentum={true}
            activeSlideAlignment={'start'}
            activeAnimationType={'spring'}
            activeAnimationOptions={{
              friction: 4,
              tension: 40,
            }}
          />
        </Block>
      </Block>
    );
  }

  renderVODHistory() {
    return (
      <Block>
        <Text h3 spacing={1} style={{marginVertical: 8}}>
          Your Verses of The Day
        </Text>
        <Block style={{height: 180}}>
          <Carousel
            data={mocks.versesOfTheDay}
            renderItem={this._renderVOD.bind(this)}
            sliderWidth={width}
            itemWidth={width * 0.4}
            inactiveSlideScale={1}
            inactiveSlideOpacity={0.8}
            enableMomentum={true}
            activeSlideAlignment={'start'}
            activeAnimationType={'spring'}
            activeAnimationOptions={{
              friction: 4,
              tension: 40,
            }}
          />
        </Block>
      </Block>
    );
  }

  renderNavBar() {
    const {navigation} = this.props;

    return (
      <Block center middle style={styles.navbar}>
        <Card
          shadow
          row
          style={{
            width: '60%',
            justifyContent: 'space-between',
            paddingHorizontal: '5%',
          }}>
          {/* <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Player')}>
            <Icon name="square" size={62 / 2.5} color="black" />
          </TouchableOpacity> */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Streak')}>
            <Icon name="bolt" size={62 / 2.5} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Fetch')}>
            <Icon name="search" size={62 / 2.5} color="black" />
          </TouchableOpacity>
        </Card>
      </Block>
    );
  }

  render() {
    return (
      <React.Fragment>
        <ScrollView style={styles.welcome} showsVerticalScrollIndicator={false}>
          {this.renderVerseCard()}
          <Block color="gray3" style={styles.hLine} />
          {this.renderRecommendations()}
          {this.renderVODHistory()}
        </ScrollView>
        {this.renderNavBar()}
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    paddingVertical: theme.sizes.padding,
    paddingHorizontal: theme.sizes.padding,
    backgroundColor: theme.colors.gray4,
  },
  // horizontal line
  hLine: {
    marginVertical: theme.sizes.base,
    marginHorizontal: theme.sizes.base * 2,
    height: 1,
  },
  // vertical line
  vLine: {
    marginVertical: theme.sizes.base / 2,
    width: 1,
  },
  navbar: {
    position: 'absolute',
    width: width,
    bottom: '5%',
  },
});
