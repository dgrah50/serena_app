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
  base: 16,
  font: 14,
  border: 10,
  padding: 25,
  // font sizes
  h1: 39,
  h2: 29,
  h3: 19,
  verse: 24,
  title: 16,
  header: 24,
  body: 14,
  caption: 12,
  small: 8,
};

const shadow = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 3,
  },
  shadowOpacity: 0.2,
  shadowRadius: 4.65,

  elevation: 7,
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
    fontFamily: 'Rubik-Bold',
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
};

export {colors, sizes, fonts, shadow,randomImages};
