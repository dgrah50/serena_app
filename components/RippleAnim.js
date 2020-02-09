import React, { Component } from "react";
import { AppRegistry, Stylesheet, View, Animated, Dimensions } from "react-native";
const {width: WIDTH, height: HEIGHT} = Dimensions.get('window');
class RippleAnim extends Component {
  state = {
    animated: new Animated.Value(0),
    opacityA: new Animated.Value(1),
    animated2: new Animated.Value(0),
    opacityA2: new Animated.Value(1)
  };
  componentDidMount() {
    const { animated, opacityA, animated2, opacityA2 } = this.state;

    Animated.stagger(1000, [
      Animated.loop(
        Animated.parallel([
          Animated.timing(animated, {
            toValue: 1.5,
            duration: 4000
          }),
          Animated.timing(opacityA, {
            toValue: 0,
            duration: 4000
          })
        ])
      ),
      Animated.loop(
        Animated.parallel([
          Animated.timing(animated2, {
            toValue: 1.5,
            duration: 4000
          }),
          Animated.timing(opacityA2, {
            toValue: 0,
            duration: 4000
          })
        ])
      )
    ]).start();
  }

  render() {
    const { animated, opacityA, animated2, opacityA2 } = this.state;
    return (
      <Animated.View
        style={{
          position: 'absolute',
          marginHorizontal: WIDTH * 0.1,
          width: WIDTH * 0.8,
          height: WIDTH * 0.8,
          borderRadius: WIDTH * 0.4,
          backgroundColor: 'rgba(255,255,255,0.8)',
          opacity: opacityA,
          transform: [
            {
              scale: animated,
            },
          ],
        }}>
        <Animated.View
          style={{
            width: WIDTH * 0.8,
            height: WIDTH * 0.8,
            borderRadius: WIDTH * 0.4,
            backgroundColor: 'rgba(255,255,255,0.8)',
            opacity: opacityA2,
            transform: [
              {
                scale: animated2,
              },
            ],
          }}></Animated.View>
      </Animated.View>
    );
  }
}

export default RippleAnim;
