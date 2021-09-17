import React from 'react';
import { View } from 'react-native';

type PropTypes = {
  height: number | string;
  width?: number | string;
}

const Space: React.FC<PropTypes> = ({height, width = '100%'}) => {
  return (
    <View style={{width, height}} />
  );
}

export default Space;