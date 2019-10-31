import React, { Component } from 'react'
import { StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import * as theme from '../constants/theme';

const { width } = Dimensions.get('window');

export default class Button extends Component {
  render() {
    const { style, full, opacity, children,shadow, ...props } = this.props;
    const buttonStyles = [
      styles.button,
      shadow && styles.shadow,
      full && styles.full,
      style,
    ];

    return (
      <TouchableOpacity
        style={buttonStyles}
        activeOpacity={opacity || 0.8}
        {...props}
      >
        {children}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.blue,
    borderRadius: 4,
    height: 55,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  full: {
    width: width - 50,
  },
  shadow: {
    shadowColor: theme.colors.black,
    shadowOpacity: 0.11,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 13,
  },
});
