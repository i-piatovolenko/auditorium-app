import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Text, ScrollView, Dimensions} from "react-native";
import {ActivityIndicator, Appbar, TextInput} from "react-native-paper";
import {ClassroomType} from "../models/models";
import {GET_SCHEDULE} from "../api/operations/queries/schedule";
import {useQuery} from "@apollo/client";
import moment from "moment";
import sortAB from "../helpers/sortAB";
import ScheduleUnit from "../components/ScheduleUnit";
import ScheduleInfo from "../components/ScheduleInfo";
import ChooseDayModal from "../components/ChooseDayModal";
import {fullName} from "../helpers/helpers";
import {DrawerActions} from "@react-navigation/native";
import {globalErrorVar} from "../api/localClient";

const windowWidth = Dimensions.get('window').width;

const timeline = ['', 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
const hour = (windowWidth - 40) / (timeline.length - 1);

const daysHeader = ['неділю', 'понеділок', 'вівторок', 'середу', 'четвер', 'п\'ятницю', 'суботу'];

const Schedule = ({navigation}: any) => {
  const [chosenDay, setChosenDay] = useState(moment().weekday());
  const [showDaysModal, setShowDaysModal] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [searchedText, setSearchedText] = useState('');
  const {data, loading, refetch} = useQuery(GET_SCHEDULE, {
    variables: {
      date: moment().set('day', chosenDay).endOf('day').toISOString(),
    },
  });

  const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());

  useEffect(() => {
    try {
      refetch();
    } catch (e: any) {
      globalErrorVar(e.message);
    }
  }, [chosenDay]);

  const toggleSearchedMode = () => {
    setSearchMode(prev => !prev);
    setSearchedText('');
  };

  const [chosenUnit, setChosenUnit] = useState(null);

  const hideModal = () => setChosenUnit(null);

  const filterSearched = (classroom: ClassroomType) => {
    const unitUsers = classroom.schedule.map(unit => fullName(unit.user)).join(' ').toLowerCase();
    return unitUsers.includes(searchedText.toLowerCase());
  }

  return <>
    <Appbar style={styles.top}>
      <Appbar.Action icon="menu" onPress={openDrawer}/>
      <Appbar.Content title={`Розклад на ${daysHeader[chosenDay]}`}
      />
      <Appbar.Action
        icon={searchMode ? "close-circle" : "account-search"}
        onPress={toggleSearchedMode}
      />
      <Appbar.Action icon="calendar-range" onPress={() => setShowDaysModal(true)}/>
    </Appbar>
    <View style={styles.container}>
      <View style={styles.timeline} pointerEvents='none'>
        {timeline.slice(1).map(item => (
          <View style={[{width: hour}, styles.hour]}>
            <Text>
              {item}
            </Text>
          </View>
        ))}
      </View>
      <ScrollView style={styles.schedule}>
        {searchMode && (
          <TextInput
            style={styles.searchInput}
            placeholder='Введіть П.І.Б. викладача'
            value={searchedText}
            onChangeText={text => setSearchedText(text)}
          />
        )}
        {loading && <ActivityIndicator style={styles.loader}/>}
        {(data?.classrooms as ClassroomType[])?.filter(({schedule}) => schedule.length)
          .filter(filterSearched)
          .slice().sort(sortAB as any).map(({schedule, name, id}) => {
            return <View style={styles.row} key={id}>
              <Text style={{width: '10%', textAlign: 'center'}}>{name}</Text>
              {schedule.slice().sort(sortAB as any).map(unit => (
                <ScheduleUnit unit={unit} setChosenUnit={setChosenUnit} key={unit.id}/>
              ))}
            </View>
          })}
      </ScrollView>
    </View>
    <ChooseDayModal
      chosenDay={chosenDay}
      setChosenDay={setChosenDay}
      hideModal={() => setShowDaysModal(false)} visible={showDaysModal}
    />
    {chosenUnit && <ScheduleInfo unit={chosenUnit} hideModal={hideModal} visible={chosenUnit}/>}
  </>
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  },
  timeline: {
    marginTop: 90,
    height: '100%',
    marginLeft: '10%',
    flexDirection: 'row',
    position: 'absolute',
    elevation: 4,
    shadowColor: 'transparent'
  },
  hour: {
    borderLeftColor: '#cccccc33',
    borderLeftWidth: 1,
    height: '100%',
  },
  schedule: {
    marginTop: 120,
    backgroundColor: '#fff',
  },
  row: {
    position: 'relative',
    width: '100%',
    borderBottomColor: 'rgba(221 ,221 ,221, .5)',
    borderBottomWidth: 1,
    alignItems: 'flex-start',
  },
  gap: {
    height: 40,
  },
  item: {
    borderRadius: 4,
    elevation: 4,
    margin: 1,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 8,
    flexWrap: 'nowrap'
  },
  top: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    paddingTop: 26,
    height: 80,
    backgroundColor: '#2e287c',
    zIndex: 1
  },
  loader: {
    paddingTop: 16,
  },
  closeButton: {
    width: 24,
    height: 24,
  },
  searchInput: {
    borderRadius: 0,
  }
});

export default Schedule;
