import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
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
    headerTitle: (
      <Image
        style={{width: 30, height: 30}}
        source={require('../assets/images/icon.png')}
      />
    ),
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

  render() {
    return (
      <ScrollView style={styles.home} showsVerticalScrollIndicator={false}>
        {this._renderVerseCard()}
        <Block color="gray3" style={styles.hLine} />
        {this._renderRecommendations()}
        {/* {this.renderFavourites()} */}
        {this._renderVODHistory()}
      </ScrollView>
    );
  }

  //****** SUB COMPONENTS SECTION
  _renderVerseCard() {
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
  _renderFavourites() {
    return (
      <Block>
        <Text h3 spacing={1} style={{marginVertical: 8}}>
          Your Favourites
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
  _renderRecommendations() {
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
  _renderVODHistory() {
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
}

const styles = StyleSheet.create({
  home: {
    paddingTop: 2 * theme.sizes.padding,
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
