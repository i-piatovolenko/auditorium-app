import {View, StyleSheet, Text, ScrollView, Dimensions} from "react-native";
import React from "react";

export default function Log({data}: any) {
  return JSON.stringify(data).length > 2 ?
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.text}>
          {typeof data === 'object' ? JSON.stringify(data) : data}
        </Text>
      </ScrollView>
    </View>
    : <></>
}

const styles = StyleSheet.create({
  container: {
    width: '50%',
    backgroundColor: '#00000099',
    position: 'absolute',
    zIndex: 99999999,
    top: 70,
    elevation: 1000,
    right: 16,
    padding: 16,
    maxHeight: (Dimensions.get('window').height / 100) * 85
  },
  text: {
    color: '#00ff65'
  }
});