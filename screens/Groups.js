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
import {Block, Badge, Card, Text, Input} from '../components';
import {styles as blockStyles} from '../components/Block';
import {styles as cardStyles} from '../components/Card';
import {theme, mocks, time} from '../constants';
import firebase from 'react-native-firebase';

const {width} = Dimensions.get('window');

const mockMessages = [
  {
    groupname: 'Serena Community',
    message: 'Welcome to the app!',
    imageURL:
      'https://scontent-lhr3-1.xx.fbcdn.net/v/t1.0-9/p960x960/78941335_112769923535574_2271841299319488512_o.jpg?_nc_cat=104&_nc_ohc=d8wUMTvCISgAQlP2eSaGoO6ymrxjEOhNBRLhNHrjA-Hui43zoBs_7hwHQ&_nc_ht=scontent-lhr3-1.xx&oh=42b1f813c1020d4f727b7a147b5936b1&oe=5E715D4B',
  },
  {
    groupname: 'Inspiration Group',
    message: 'Isaiah 54:16',
    imageURL: 'https://apprecs.org/ios/images/app-icons/256/ca/565301194.jpg',
  },
  {
    groupname: 'Marriage Support Group',
    message: 'Isaiah 54:16',
    imageURL:
      'https://viviamaridi.com/wp-content/uploads/2019/02/01_marriage_icon.png',
  },
  {
    groupname: 'Net Church Dartford Youth Group',
    message: 'Isaiah 54:16',
    imageURL:
      'https://icon-library.net/images/church-icon-png/church-icon-png-19.jpg',
  },
];

export default class Groups extends Component {
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

  _renderGroup(item) {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Chats')}
        >
        <Card
          center
          row
          flex={false}
          shadow
          space={'between'}
          style={{paddingHorizontal: '5%', marginVertical: 0}}>
          <Block flex={false}>
            <Image
              resizeMode="contain"
              source={{
                uri: item.imageURL,
              }}
              style={{
                width: 50,
                height: 50,
                paddingHorizontal: 20,
                borderRadius: 25,
                resizeMode: 'contain',
              }}
            />
          </Block>
          <Block style={{paddingLeft: 20}}>
            <Text h3 bold>
              {item.groupname}
            </Text>
            <Text blue caption>
              {item.message}
            </Text>
          </Block>
          <Block flex={false}>
            <Icon color={theme.colors.primary} name="circle" size={20} />
          </Block>
        </Card>
      </TouchableOpacity>
    );
  }
  _renderGroups() {
    return (
      <React.Fragment>
        <Card flex={false}>
          <Input label={'Search for groups'} />
        </Card>
        <ScrollView showsVerticalScrollIndicator={false}>
          {mockMessages.map(item => {
            return this._renderGroup(item);
          })}
          <TouchableOpacity>
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
  }

  renderCalendar() {
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

  render() {
    return (
      <Block style={styles.welcome} flex={false}>
        {this._renderGroups()}
      </Block>
    );
  }
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
