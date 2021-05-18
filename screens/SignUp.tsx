import * as React from 'react';
import {Picker, ScrollView, StyleSheet, Image} from 'react-native';
import {View} from '../components/Themed';
import {Appbar, Banner, Button, Surface, TextInput} from 'react-native-paper';
import {useState} from "react";

export default function SignUp({navigation}: any) {
  const [selectedDepartment, setSelectedDepartment] = useState(1);
  const [selectedDegree, setSelectedDegree] = useState(1);
  const [visible, setVisible] = React.useState(true);
  const [phoneInputs, setPhoneInputs] = useState([<View style={styles.phoneRow}>
    <TextInput placeholder="Тел." style={styles.phoneInput}/>
    <Button
      color='#2e287c'
      onPress={() => addExtraPhoneNumber()}
      mode='outlined'
      style={styles.addExtraPhone}
      labelStyle={styles.addExtraPhoneLabel}
    >+</Button>
  </View>]);

  function addExtraPhoneNumber() {
    setPhoneInputs(prevState => [...prevState, prevState[prevState.length - 1]]);
  };

  return (
    <View style={styles.container}>
      <Appbar style={styles.top}>
        <Appbar.BackAction onPress={() => navigation.goBack()}/>
        <Appbar.Content title="Реєстрація"/>
      </Appbar>
      <ScrollView style={styles.scrollView}>
        <Banner
          visible={visible}
          actions={[
            {
              label: 'Зрозуміло',
              onPress: () => setVisible(false),
            }
          ]}
        >
          Реєстрація педагогів та співробітників навчального закладу відбувається за допомогою диспетчера.
        </Banner>
        <TextInput placeholder="Прізвище" style={styles.input}/>
        <TextInput placeholder="Ім'я" style={styles.input}/>
        <TextInput placeholder="По-батькові" style={styles.input}/>
        <TextInput placeholder="E-mail" style={styles.input}/>
        {phoneInputs}
        <Picker
          selectedValue={selectedDepartment}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => setSelectedDepartment(itemValue)}
        >
          <Picker.Item label="Кафедра фортепіано 1" value={1}/>
          <Picker.Item label="Кафедра фортепіано 2" value={2}/>
        </Picker>
        <Picker
          selectedValue={selectedDegree}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => setSelectedDegree(itemValue)}
        >
          <Picker.Item label="Бакалавр" value={1}/>
          <Picker.Item label="Магістр" value={2}/>
          <Picker.Item label="Асистент-стажист" value={3}/>
          <Picker.Item label="Аспірант" value={4}/>
        </Picker>
        <TextInput placeholder="Рік початку" style={styles.input}/>
      </ScrollView>
      <View style={styles.navButtons}>
        <Button onPress={() => navigation.navigate('Verification')} mode='contained' color='#f91354'
                style={styles.signUpButton}>
          Зареєструватися
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {

  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  navButtons: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    marginBottom: 16,
    marginTop: 16,
  },
  signUpButton: {
    height: 50,
    justifyContent: 'center',
    width: '90%',
  },
  scrollView: {
    width: '90%',
    marginTop: 80,
  },
  input: {
    width: '100%',
    backgroundColor: 'transparent',
    height: 50,
    fontSize: 22,
    paddingLeft: 10,
    marginTop: 16,
  },
  phoneNumbers: {
    backgroundColor: 'transparent'
  },
  phoneRow: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center'
  },
  phoneInput: {
    backgroundColor: 'transparent',
    height: 50,
    fontSize: 22,
    flex: 1,
    paddingLeft: 10,
    marginTop: 16,
    marginRight: 16,
  },
  addExtraPhone: {
    marginTop: 16,
    height: 50,
    marginRight: 2
  },
  addExtraPhoneLabel: {
    fontSize: 25,
  },
  top: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    paddingTop: 26,
    height: 80,
    backgroundColor: '#2e287c',
  },
  picker: {
    marginTop: 16,
    height: 50,
    fontSize: 22,
  }
});
