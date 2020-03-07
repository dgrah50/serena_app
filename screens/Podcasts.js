import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';

import {Block, Card, Text, Input} from '../components';
import {theme} from '../constants';
import firebase from 'react-native-firebase';
const {width} = Dimensions.get('window');

export default class Podcasts extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Podcasts',
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
      results: [],
    };
  }

  createiTunesLink(searchQuery, results = 25) {
    return (
      'https://itunes.apple.com/search?term=' +
      encodeURIComponent(searchQuery) +
      '&entity=podcast&genreId=1314&limit=' +
      results
      // '&entity=podcast&genreId=1314&attribute=titleTerm&limit=' +
      // results
    );
  }

  searchPodcastHandler = e => {
    iTunesLink = this.createiTunesLink(e);
    fetch(iTunesLink)
      .then(response => {
        return response.json();
      })
      .then(jsonData => {
        this.setState(oldState => {
          return {
            results: jsonData['results'],
          };
        });
      });
  };

  render() {
    return (
      <Block
        style={{
          width: '100%',
          backgroundColor: theme.colors.bg,
        }}>
        <Block style={{paddingHorizontal: '5%', paddingTop: '5%'}} flex={false}>
          <Input
            label={'Search for Podcasts'}
            onFocus={() => this.setState({searching: true})}
            rightLabel={
              <TouchableOpacity
                onPress={() => {
                  this.setState({results: []});
                }}>
                <Text style={{color: 'red'}}>Cancel</Text>
              </TouchableOpacity>
            }
            onChangeTextHandler={this.searchPodcastHandler}
          />
        </Block>

        {/* <Text h3 left>
            Podcasts
          </Text> */}
        <FlatList
          style={styles.welcome}
          numColumns={2}
          data={this.state.results}
          renderItem={({item}) => {
            return this._renderPodcastTile(item);
          }}></FlatList>
      </Block>
    );
  }
  _renderPodcastTile(item) {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('SinglePodcast', {
            podcastDetail: item,
          });
        }}>
        <Block
          style={{width: width * 0.5, height: width * 0.6, marginVertical: 10}}
          center>
          <Image
            style={{
              width: width * 0.4,
              height: width * 0.4,
              borderRadius: theme.sizes.border,
            }}
            source={{
              uri: item.artworkUrl100,
            }}
          />
          <Text
            bold
            caption
            center
            numberOfLines={2}
            style={{paddingHorizontal: width * 0.05}}>
            {item.collectionName}
          </Text>
          <Text
            caption
            center
            numberOfLines={1}
            style={{paddingHorizontal: width * 0.05}}>
            {item.artistName}
          </Text>
        </Block>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    alignContent: 'center',
    height: '100%',
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
  }
});
