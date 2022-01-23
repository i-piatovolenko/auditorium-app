import {Dimensions, Platform} from 'react-native';
import {Platforms} from "../models/models";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const cellWidth = Platform.OS === Platforms.WEB ? width / 8 : ((width - 10) / 3);

export default {
  window: {
    width,
    height,
  },
  cellWidth,
  isSmallDevice: width < 375,
};
