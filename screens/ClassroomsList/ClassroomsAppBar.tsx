import React, {useEffect, useState} from 'react';
import {Appbar, Button} from "react-native-paper";
import {DrawerActions, useNavigation} from "@react-navigation/native";
import {Image, StyleSheet, View, Text, TouchableOpacity} from "react-native";
import {useQuery} from "@apollo/client";
import {GENERAL_QUEUE_SIZE} from "../../api/operations/queries/generalQueueSize";
import {FOLLOW_GENERAL_QUEUE_SIZE} from "../../api/operations/subscriptions/generalQueueSize";
import {useLocal} from "../../hooks/useLocal";
import {ClassroomType, InstrumentType, Mode, User} from "../../models/models";
import SavedFilters from "./SavedFilters";
import Filters, {SpecialT} from "./Filters";
import {getClassroomsFilteredByInstruments} from "./helpers";
import {filterDisabledForQueue} from "../../helpers/filterDisabledForQueue";
import {GENERAL_QUEUE_POSITION} from "../../api/operations/queries/generalQueuePosition";
import {FOLLOW_GENERAL_QUEUE_POSITION} from "../../api/operations/subscriptions/generalQueuePosition";
import Colors from "../../constants/Colors";
import ErrorDialog from "../../components/ErrorDialog";
import {
  desirableClassroomIdsVar,
  globalErrorVar,
  isMinimalSetupVar,
  minimalClassroomIdsVar
} from "../../api/localClient";

type PropTypes = {
  freeClassroomsAmount: number;
  classrooms: ClassroomType[];
  currentUser: User;
  dispatcherActive: boolean;
}

const ClassroomsAppBar: React.FC<PropTypes> = (
  {
    freeClassroomsAmount, classrooms, currentUser, dispatcherActive
  }
) => {
  const navigation = useNavigation();
  const {data, loading, error, subscribeToMore} = useQuery(GENERAL_QUEUE_SIZE);
  const {
    data: dataPosition, loading: loadingPosition,
    error: errorPosition, subscribeToMore: subscribeToMorePosition
  } = useQuery(GENERAL_QUEUE_POSITION, {
    variables: {
      userId: currentUser.id
    },
    onError: (error) => globalErrorVar(error.message)
  });
  const {data: {mode}} = useLocal('mode');
  const {data: {me}} = useLocal('me');
  const {data: {isMinimalSetup}} = useLocal('isMinimalSetup');
  const [visible, setVisible] = useState(false);
  const [visibleSavedFilters, setVisibleSavedFilters] = useState(false);
  const [generalQueueSize, setGeneralQueueSize] = useState(0);
  const [generalQueuePosition, setGeneralQueuePosition] = useState(0);
  const [visibleDispatcherActiveAlert, setVisibleDispatcherActiveAlert] = useState(false);

  useEffect(() => {
    if (!loadingPosition && !errorPosition) {
      setGeneralQueuePosition(dataPosition.generalQueuePosition);
    }
  }, [dataPosition, loadingPosition, errorPosition]);

  useEffect(() => {
      const unsubscribeSize = subscribeToMore({
          document: FOLLOW_GENERAL_QUEUE_SIZE,
          updateQuery: (prev, {subscriptionData}) => {
            if (!subscriptionData.data) return prev;
            setGeneralQueueSize(subscriptionData.data.generalQueueSize);
            return subscriptionData.data.generalQueueSize
          }
        }
        )
      ;
      const unsubscribePosition = subscribeToMorePosition({
          document: FOLLOW_GENERAL_QUEUE_POSITION,
          variables: {
            userId: me.id
          },
          updateQuery: (prev, {subscriptionData}) => {
            if (!subscriptionData.data) return prev;
            setGeneralQueuePosition(subscriptionData.data.generalQueuePosition);
            return subscriptionData.data.generalQueuePosition
          }
        }
      );

      return () => {
        unsubscribeSize();
        unsubscribePosition();
      }
  }, []);

  useEffect(() => {
    if (!loading && !error) setGeneralQueueSize(data.generalQueueSize);
  }, [data, loading, error]);

  const applyGeneralFilter = (instruments: InstrumentType[], withWing: boolean,
                              operaStudioOnly: boolean, special: SpecialT) => {

    const filteredClassroomsByInstruments = instruments.length ?
      getClassroomsFilteredByInstruments(classrooms, instruments) : classrooms;

    const filteredIds = filteredClassroomsByInstruments
      .filter(classroom => filterDisabledForQueue(classroom, currentUser))
      .filter(classroom => withWing ? true : !classroom.isWing)
      .filter(classroom => operaStudioOnly ? classroom.isOperaStudio : true)
      .filter(classroom => {
        switch (special) {
          case "with":
            return true;
          case "only":
            return classroom.special;
          case "without":
            return !classroom.special;
        }
      })
      .map((classroom) => classroom.id);

    if (isMinimalSetup) {
      minimalClassroomIdsVar(filteredIds);
    } else {
      desirableClassroomIdsVar(filteredIds);
    }
  };

  const showModal = () => setVisible(true);

  const hideModal = () => setVisible(false);

  const showModalSavedFilters = () => setVisibleSavedFilters(true);

  const hideModalSavedFilters = () => setVisibleSavedFilters(false);

  const handlePressAlert = () => {
    setVisibleDispatcherActiveAlert(true);
  }

  const onCloseAlert = () => {
    setVisibleDispatcherActiveAlert(false);
  }

  return (
    <Appbar style={styles.top}>
      <Appbar.Action icon={() => <Image source={require('../../assets/images/burger.png')}
                                        style={styles.menuIcon}/>}
                     onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                     color='#fff'
      />
      {mode === Mode.INLINE && (
        <Appbar.Content title={`Ваша позиція в черзі: ${generalQueuePosition + 1}`}
                        color='#fff'
        />
      )}
      {mode === Mode.PRIMARY && (
        <>
        <Appbar.Content title={`Людей в черзі: ${generalQueueSize}`}
                        subtitle={`Доступних аудиторій: ${freeClassroomsAmount}`}
                        color='#fff'
        />
        </>
      )}
      {!dispatcherActive && mode !== Mode.QUEUE_SETUP && (
        <TouchableOpacity onPress={handlePressAlert}>
          <View style={styles.dispatcherActiveButtonWrapper}>
            <Text style={styles.dispatcherActiveButton}>!</Text>
          </View>
        </TouchableOpacity>
      )}
      {mode === Mode.QUEUE_SETUP && (
        <>
          <View style={styles.switcher}>
            <View style={styles.queueSwitcher}>
              <Button mode={isMinimalSetup ? 'contained' : 'text'}
                      style={{position: 'relative'}}
                      color='#fff'
                      onPress={() => isMinimalSetupVar(true)}
              >
                <Text style={styles.switcherText}>
                  Мінімальні
                </Text>
              </Button>
              <Button
                mode={!isMinimalSetup ? 'contained' : 'text'}
                style={{position: 'relative'}}
                color='#fff'
                onPress={() => isMinimalSetupVar(false)}
              >
                <Text style={styles.switcherText}>
                  Бажані
                </Text>
              </Button>
            </View>
          </View>
          <Appbar.Action icon="content-save" onPress={showModalSavedFilters} color='#fff'
                         style={{position: 'absolute', right: 40, top: 28}}/>
          <Appbar.Action icon="filter" onPress={showModal} color='#fff'
                         style={{position: 'absolute', right: 0, top: 28}}/>
        </>
      )}
      <SavedFilters hideModal={hideModalSavedFilters} visible={visibleSavedFilters} currentUser={currentUser}/>
      <Filters hideModal={hideModal} visible={visible} apply={applyGeneralFilter}/>
      <ErrorDialog
        visible={visibleDispatcherActiveAlert}
        hideDialog={onCloseAlert}
        title='Автономний режим'
        buttonText='Зрозуміло'
        message={'Робота диспетчера завершена. Після завершення заняття здайте ключі на охорону. Якщо ви берете на охороні аудиторію, що на сітці позначена як вільна, обов\'язково зарезервуйте її в додатку.'}
      />
    </Appbar>
  );
}

const styles = StyleSheet.create({
  top: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    paddingTop: 26,
    height: 80,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  queueSwitcher: {
    flexDirection: 'row',
    width: '76%',
    justifyContent: 'center',
    paddingHorizontal: 5,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  menuIcon: {
    marginLeft: 3,
    marginTop: 3,
    width: 20,
    height: 20,
  },
  switcher: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '88%',
    marginLeft: -20,
  },
  switcherText: {
    fontSize: 10
  },
  dispatcherActiveButtonWrapper: {
    borderRadius: 50,
    overflow: 'hidden',
    marginRight: 16,
  },
  dispatcherActiveButton: {
    color: '#fff',
    fontWeight: 'bold',
    backgroundColor: Colors.red,
    justifyContent: 'center',
    textAlign: 'center',
    width: 50,
    height: 50,
    fontSize: 28,
    lineHeight: 45,
    elevation: 8,
  },
});

export default ClassroomsAppBar;
