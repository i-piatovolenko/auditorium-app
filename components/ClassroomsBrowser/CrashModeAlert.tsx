import React from 'react';
import {View, Text, StyleSheet} from "react-native";
import Colors from "../../constants/Colors";
import moment from "moment";

type PropTypes = {
  comment: string;
  until: string;
}

const CrashModeAlert: React.FC<PropTypes> = ({comment, until}) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.headerText}>Упс! Додаток працює в режимі невідповідності даних.</Text>
      <Text style={styles.text}>Інформація про аудиторії може не відповідати дійсності. Подробиці можна дізнатись у диспетчера.</Text>
      {comment && <Text style={styles.text}>Причина: {comment}</Text>}
      {until && <Text style={styles.text}>До: {moment(until).format('DD-MM-YYYY HH:mm')}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 6,
    borderColor: Colors.red,
    backgroundColor: Colors.red + '77',
    borderWidth: 2,
    padding: 8,
    marginBottom: 8,
    width: '95%'
  },
  headerText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: "600",
    paddingBottom: 8,
    textAlign: 'center',
  },
  text: {
    color: '#fff',
    paddingBottom: 4,
    textAlign: 'center',
  }
})

export default CrashModeAlert;