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
            // Initially visible month. Default = Date()
            current={Date() - 7}
            // // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
            minDate={Date() - 14}
            // // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
            maxDate={Date()}
            // Handler which gets executed on day press. Default = undefined
            onDayPress={day => {
              console.log('selected day', day);
            }}
            // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
            monthFormat={'MMM yyyy'}
            // Handler which gets executed when visible month changes in calendar. Default = undefined
            onMonthChange={month => {
              console.log('month changed', month);
            }}
            // Hide month navigation arrows. Default = false
            hideArrows={false}
            // Replace default arrows with custom ones (direction can be 'left' or 'right')
            renderArrow={direction =>
              direction == 'left' ? <Text h1>⟵</Text> : <Text h1>⟶</Text>
            }
            // Do not show days of other months in month page. Default = false
            hideExtraDays={true}
            // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
            // day from another month that is visible in calendar page. Default = false
            disableMonthChange={true}
            // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
            firstDay={1}
            // Hide day names. Default = false
            hideDayNames={false}
            // Show week numbers to the left. Default = false
            showWeekNumbers={false}
            // Handler which gets executed when press arrow icon left. It receive a callback can go back month
            onPressArrowLeft={substractMonth => substractMonth()}
            // Handler which gets executed when press arrow icon left. It receive a callback can go next month
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
                // An error happened.
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
      <React.Fragment>
        <ScrollView style={styles.welcome} showsVerticalScrollIndicator={false}>
          {this.renderStreak()}
          <Block color="gray3" style={styles.hLine} />
          {this.renderCalendar()}
          <Block color="gray3" style={styles.hLine} />
          {this.renderSettings()}
        </ScrollView>
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
