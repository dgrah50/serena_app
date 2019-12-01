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
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {Block, Badge, Card, Text} from '../components';
import {styles as blockStyles} from '../components/Block';
import {styles as cardStyles} from '../components/Card';
import {theme, mocks, time} from '../constants';
import firebase from 'react-native-firebase';

const {width} = Dimensions.get('window');

export default class Streak extends Component {
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

  renderStreak() {
    return (
      <Block center middle>
        <Icon name="bolt" size={62} color="black" />
        <Text h2>You're on a 17 day streak!</Text>
      </Block>
    );
  }
  
  renderCalendar(){
      return (
        <Card shadow>
          <Calendar
            current={Date() - 7}
            minDate={Date() - 14}
            maxDate={Date()}
            onDayPress={day => {
              console.log('selected day', day);
            }}
            monthFormat={'MMM yyyy'}

            hideArrows={false}
            renderArrow={direction =>
              direction == 'left' ? <Text h1>⟵</Text> : <Text h1>⟶</Text>
            }
            firstDay={1}
            hideDayNames={false}
            showWeekNumbers={false}
            onPressArrowLeft={substractMonth => substractMonth()}
            onPressArrowRight={addMonth => addMonth()}
          />
        </Card>
      );
  }
  
  renderSettings(){
    return (
      <TouchableOpacity
        onPress={() => {
          firebase
            .auth()
            .signOut()
            .then(
              () => {
                this.props.navigation.navigate('Login');
              },
              function(error) {
              },
            );
        }}>
        <Card shadow>
          <Text center h2>
            Log out
          </Text>
        </Card>
      </TouchableOpacity>
    );
  }

  render() {
    return (
        <ScrollView style={styles.welcome} showsVerticalScrollIndicator={false}>
          {this.renderStreak()}
          <Block color="gray3" style={styles.hLine} />
          {this.renderCalendar()}
          <Block color="gray3" style={styles.hLine} />
          {this.renderSettings()}
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    paddingTop: 2 * theme.sizes.padding,
    paddingHorizontal: theme.sizes.padding,
    backgroundColor: theme.colors.gray4,
    flex: 1
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
