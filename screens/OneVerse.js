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
let ENTRIES1 = [
  {
    title: 'Favourites',
    illustration:
      'https://cdn.dribbble.com/users/288987/screenshots/2416384/exodus.png',
    // illustration: require('../../assets/piusLBG.png')
  },
  {
    title: 'Love',
    illustration:
      'https://cdn.dribbble.com/users/288987/screenshots/2275389/journey.jpg',
  },
  {
    title: 'Strength',
    illustration:
      'https://cdn.dribbble.com/users/288987/screenshots/2757996/rhinos3.jpg',
  },
  {
    title: 'Fear',
    illustration:
      'https://cdn.dribbble.com/users/288987/screenshots/2154354/elephant.jpg',
  },
  {
    title: 'Anxiety',
    illustration:
      'https://cdn.dribbble.com/users/288987/screenshots/2416384/exodus.png',
  },
  {
    title: 'Faith',
    illustration:
      'https://cdn.dribbble.com/users/288987/screenshots/2275389/journey.jpg',
  },
  {
    title: 'Healing',
    illustration:
      'https://cdn.dribbble.com/users/288987/screenshots/2757996/rhinos3.jpg',
  },
  {
    title: 'Hope',
    illustration:
      'https://cdn.dribbble.com/users/288987/screenshots/2416384/exodus.png',
  },
  {
    title: 'Marriage',
    illustration:
      'https://cdn.dribbble.com/users/288987/screenshots/2275389/journey.jpg',
  },
  {
    title: 'More Soon...',
    illustration:
      'https://cdn.dribbble.com/users/288987/screenshots/3342177/fox-tale.jpg',
  },
];
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

  renderVerseCard() {
    return (
      <Card shadow>
        <Block>
          <Block center>
            <Text h2 style={{marginVertical: 8}}>
              For God so loved the world, that he gave his only begotten Son,
              that whosoever believed in him should not perish, but have
              everlasting life{' '}
            </Text>
          </Block>
          <Block center>
            <Text h3 style={{marginVertical: 8}}>
              Isaiah 54:17
            </Text>
          </Block>
        </Block>
      </Card>
    );
  }

  _renderItem({item, index}) {
    return (
      <Card shadow style={{margin: 10}}>
        <Image
          source={{
            uri:
              'https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg',
          }}
        />
      </Card>
    );
  }

  renderPodcasts() {
    return (
      <Block>
        <Text h3 spacing={1} style={{marginVertical: 8}}>
          Recommendations
        </Text>
        <Block style={{height: 180}}>
          <Carousel
            data={ENTRIES1}
            renderItem={this._renderItem.bind(this)}
            sliderWidth={width * 0.9}
            itemWidth={width * 0.4}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
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
      <Block center middle style={styles.endTrip}>
        <Card
          shadow
          row
          style={{
            width: '90%',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Welcome')}>
            <Icon name="square" size={62 / 2.5} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Welcome')}>
            <Icon name="square" size={62 / 2.5} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Welcome')}>
            <Icon name="square" size={62 / 2.5} color="black" />
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
          {this.renderPodcasts()}
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
