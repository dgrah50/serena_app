import React from 'react';
import PropTypes from 'prop-types';
import {Animated, AppState, Easing, View, ViewPropTypes} from 'react-native';
import CircularProgress from './CircularProgress';
const AnimatedProgress = Animated.createAnimatedComponent(CircularProgress);

export default class AnimatedCircularProgress extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fillAnimation: new Animated.Value(props.prefill),
      earlystop: false,
    };
  }

  componentDidMount() {
    this.animate();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.fill !== this.props.fill) {
      this.animate();
    }
  }

  reAnimate(prefill, toVal, dur, ease) {
    let finished = false;
    this.setState(
      {
        fillAnimation: new Animated.Value(prefill),
      },
      () => (this.finished = this.animate(toVal, dur, ease)),
    );
    this.props.onAnimationComplete;
    return finished;
  }

  animate(toVal, dur, ease) {
    const toValue = toVal || this.props.fill;
    const duration = dur || this.props.duration;
    const easing = ease || this.props.easing;

    const anim = Animated.timing(this.state.fillAnimation, {
      toValue,
      easing,
      duration,
    });

    anim.start(x => {
      if (x['finished']) {
        this.props.onAnimationComplete();
      }
    });
    return true;
  }

  stopAnimate() {
    this.animate(this.state.fillAnimation, 0, Easing.quad);
    return true;
  }

  render() {
    const {fill, prefill, ...other} = this.props;

    return <AnimatedProgress {...other} fill={this.state.fillAnimation} />;
  }
}

AnimatedCircularProgress.propTypes = {
  ...CircularProgress.propTypes,
  prefill: PropTypes.number,
  duration: PropTypes.number,
  easing: PropTypes.func,
  onAnimationComplete: PropTypes.func,
};

AnimatedCircularProgress.defaultProps = {
  duration: 500,
  easing: Easing.out(Easing.ease),
  prefill: 0,
  size: 180,
  width: 12,
  fill: 0,
  backgroundColor: 'rgba(0, 0, 0, 0)',
};
