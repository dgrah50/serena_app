import {Dimensions, Platform, PixelRatio} from 'react-native';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;

export function normalize(size) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}


const colors = {
  accent: '#449CD6',
  primary: '#449CD6',
  secondary: '#4DA1FF',
  tertiary: '#FFE358',
  black: '#2F2F2F',
  white: '#FFFFFF',
  gray: '#58595B',
  gray2: '#F0F0F7',
  gray3: '#F0F0F0',
  gray4: '#F7F8FA',
  blue: '#24a0ed',
  bg: '#EFEFF4',
};

const sizes = {
  // global sizes

  base: normalize(16),
  font: normalize(14),
  border: normalize(10),
  padding: normalize(25),
  // font sizes
  h1: normalize(36),
  h2: normalize(29),
  h3: normalize(19),
  verse: normalize(24),
  title: normalize(16),
  header: normalize(24),
  body: normalize(14),
  caption: normalize(12),
  button: normalize(12),
  small: normalize(10)
};

const shadow = {
  // shadowColor: '#000',
  // shadowOffset: {
  //   width: 0,
  //   height: 3,
  // },
  // shadowOpacity: 0.2,
  // shadowRadius: 4.65,

  // elevation: 7,
};

const randomImages = [
  require('../assets/images/versebgs/image1.jpg'),
  require('../assets/images/versebgs/image2.jpg'),
  require('../assets/images/versebgs/image3.jpg'),
  require('../assets/images/versebgs/image4.jpg'),
  require('../assets/images/versebgs/image5.jpg'),
  require('../assets/images/versebgs/image6.jpg'),
  require('../assets/images/versebgs/image7.jpg'),
  require('../assets/images/versebgs/image8.jpg'),
  require('../assets/images/versebgs/image9.jpg'),
  require('../assets/images/versebgs/image10.jpg'),
  require('../assets/images/versebgs/image11.jpg'),
  require('../assets/images/versebgs/image12.jpg'),
  require('../assets/images/versebgs/image13.jpg'),
  require('../assets/images/versebgs/image14.jpg'),
  require('../assets/images/versebgs/image15.jpg'),
  require('../assets/images/versebgs/image16.jpg'),
  require('../assets/images/versebgs/image17.jpg'),
  require('../assets/images/versebgs/image18.jpg'),
  require('../assets/images/versebgs/image19.jpg'),
  require('../assets/images/versebgs/image20.jpg'),
  require('../assets/images/versebgs/image21.jpg'),
  require('../assets/images/versebgs/image22.jpg'),
  require('../assets/images/versebgs/image23.jpg'),
  require('../assets/images/versebgs/image24.jpg'),
  require('../assets/images/versebgs/image25.jpg'),
  require('../assets/images/versebgs/image26.jpg'),
  require('../assets/images/versebgs/image27.jpg'),
  require('../assets/images/versebgs/image28.jpg'),
  require('../assets/images/versebgs/image29.jpg'),
  require('../assets/images/versebgs/image30.jpg'),
  require('../assets/images/versebgs/image31.jpg'),
  require('../assets/images/versebgs/image32.jpg'),
  require('../assets/images/versebgs/image33.jpg'),
  require('../assets/images/versebgs/image34.jpg'),
  require('../assets/images/versebgs/image35.jpg'),
];

const fonts = {
  h1: {
    fontFamily: 'Rubik-Light',
    fontSize: sizes.h1,
  },
  h2: {
    fontFamily: 'Rubik-Medium',
    fontSize: sizes.h2,
  },
  h3: {
    fontFamily: 'Rubik-Regular',
    fontSize: sizes.h3,
  },
  header: {
    fontFamily: 'Rubik-Light',
    fontSize: sizes.header,
  },
  title: {
    fontFamily: 'Rubik-Regular',
    fontSize: sizes.title,
  },
  body: {
    fontSize: sizes.body,
  },
  caption: {
    fontSize: sizes.caption,
  },
  small: {
    fontSize: sizes.small,
  },
  button: {
    fontSize: sizes.button,
  },
};

export {colors, sizes, fonts, shadow,randomImages};
