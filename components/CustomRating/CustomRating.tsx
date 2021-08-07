import React from 'react'
import {StyleSheet, View, TouchableOpacity, Image} from 'react-native'
import {Dialog, Paragraph, Portal, ProgressBar} from "react-native-paper";

type PropTypes = {
  size: number;
  count: number;
  setCount: (count: number) => void;
  visible: boolean;
  hideDialog: () => void;
}

export default function CustomRating({size = 5, count, setCount, visible, hideDialog}: PropTypes) {
  const stars = new Array(size).fill(null);

  const handleRate = (value: number) => {
    setCount(value);
    hideDialog();
  };


  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title style={{textAlign: 'center'}}>Виберіть мінімальний рейтинг</Dialog.Title>
        <Dialog.Content>
          <View style={styles.rate}>
            {stars.map((value, index) => (
              <TouchableOpacity key={index} onPress={() => handleRate(index + 1)}>
                <Image source={require('../../assets/images/star.png')}
                       style={{...styles.star, opacity: index < count ? 1 : .3}}
                />
              </TouchableOpacity>
            ))}
          </View>
        </Dialog.Content>
      </Dialog>
    </Portal>
  )
}

const styles = StyleSheet.create({
  rate: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  star: {
    width: 20,
    height: 20
  },
})