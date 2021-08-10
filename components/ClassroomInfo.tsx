import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from "react-native";
import {
  InstrumentType, Mode, OccupiedInfo, OccupiedState, QueueState, QueueType,
  ScheduleUnitType, User,
  UserTypeColors,
  UserTypes,
  UserTypesUa
} from "../models/models";
import {
  ActivityIndicator,
  Appbar, Banner,
  Button,
  Chip,
  Divider,
  Paragraph,
  ProgressBar,
  Surface
} from "react-native-paper";
import InstrumentItem from "./InstrumentItem";
import {useNavigation} from "@react-navigation/native";
import ScheduleItem from "./ScheduleItem";
import {useQuery} from "@apollo/client";
import {GET_SCHEDULE_UNIT} from "../api/operations/queries/schedule";
import {
  fullName,
  getTimeHHMM,
  isOccupiedOnSchedule,
  ISODateString,
  isOwnClassroom,
  isPendingForMe
} from "../helpers/helpers";
import UserInfo from "./UserInfo";
import {useLocal} from "../hooks/useLocal";
import getInLine from "../helpers/queue/getInLine";
import addToFilteredList from "../helpers/queue/addToFilteredList";
import {GET_ME} from "../api/operations/queries/me";
import {client} from "../api/client";
import {ADD_USER_TO_QUEUE} from "../api/operations/mutations/addUserToQueue";
import useTimeLeft from "../hooks/useTimeLeft";
import colors from "../constants/Colors";
import {GET_USERS_SKIPS} from "../api/operations/queries/usersSkips";

interface PropTypes {
  route: any;
}

export default function ClassroomInfo({route: {params: {classroom}}}: PropTypes) {
  const {
    name, id, isWing, isOperaStudio, chair, description, special, floor, instruments,
    schedule, occupied
  } = classroom;
  const navigation = useNavigation();
  const {data, loading, error} = useQuery(GET_SCHEDULE_UNIT, {
    variables: {
      classroomName: name,
      date: ISODateString(new Date()),
    },
  });
  const {data: {me}} = useQuery(GET_ME);
  const userFullName = occupied?.user.nameTemp === null ? fullName(occupied?.user) :
    occupied?.user.nameTemp;
  const occupiedOnSchedule = isOccupiedOnSchedule(schedule);
  const [visible, setVisible] = useState(false);
  const {data: {mode}} = useLocal('mode');
  const {data: {isMinimalSetup}} = useLocal('isMinimalSetup');
  const {data: {desirableClassroomIds}} = useLocal('desirableClassroomIds');
  const {data: {minimalClassroomIds}} = useLocal('minimalClassroomIds');
  const occupiedTotalTime = occupied?.state === OccupiedState.OCCUPIED ? 180 : 2;
  const [timeLeft, timeLeftInPer] = useTimeLeft(occupied as OccupiedInfo, occupiedTotalTime);
  const [visibleBanner, setVisibleBanner] = useState(true);
  const [skips, setSkips] = useState(0);

  const getUsersSkips = async () => {
    try {
      const data: any = await client.query({
        query: GET_USERS_SKIPS,
        variables: {
          where: {
            id: me.id
          }
        }
      });
      setSkips(data.data.user.queueInfo.skips)
    } catch (e) {
      alert(JSON.stringify(e));
    }
  };

  useEffect(() => {
    setVisibleBanner(true);
  }, [])

  useEffect(() => {
    me && getUsersSkips();
  }, [me]);

  const showModal = () => setVisible(true);

  const hideModal = () => setVisible(false);

  const goBack = () => navigation.goBack();

  const isAlreadyFilteredClassroom = (classroomId: number) => {
    if (isMinimalSetup) {
      return minimalClassroomIds.includes(classroomId);
    } else {
      return desirableClassroomIds.includes(classroomId);
    }
  };

  const handleAddToLine = () => {
    addToFilteredList(id, isMinimalSetup, minimalClassroomIds, desirableClassroomIds);
    isAlreadyFilteredClassroom(id);
    goBack();
  };

  const addOneClassroomToQueue = async (isMinimal: boolean) => {
    try {
      await client.mutate({
        mutation: ADD_USER_TO_QUEUE,
        variables: {
          input: [{
            userId: me.id,
            classroomId: id,
            state: QueueState.ACTIVE,
            type: isMinimal ? QueueType.MINIMAL : QueueType.DESIRED
          }]
        }
      });
      addToFilteredList(id, isMinimal, minimalClassroomIds, desirableClassroomIds);
      goBack();
    } catch (e) {
      alert(JSON.stringify(e));
    }
  };

  const removeOneClassroomFromQueue = (isMinimal: boolean) => {
    //TODO remove classroom from queue mutation
  };

  return <View style={styles.container}>
    <Appbar style={styles.top}>
      <Appbar.BackAction onPress={goBack}/>
      <Appbar.Content
        title={`${isOwnClassroom(occupied, me) ? 'Моя аудиторія' : 'Аудиторія'} ${name}`}
        subtitle={chair ? chair.name : ''}
      />
    </Appbar>
    <View style={styles.wrapper}>
      {(isWing || isOperaStudio || special) && <>
          <View style={styles.tags}>
            {isWing && <Chip selected selectedColor='#00f' mode='outlined'
                             style={styles.tag}>Флігель</Chip>}
            {isOperaStudio && <Chip selected selectedColor='#00f' mode='outlined'
                                    style={styles.tag}>Оперна студія</Chip>}
            {special && <Chip selected selectedColor='#00f' mode='outlined'
                              style={styles.tag}>Спеціалізована</Chip>}
          </View>
          <Divider style={styles.divider}/>
      </>}
      <Text style={styles.description}>
        {description}
      </Text>
      <Divider style={styles.divider}/>
      <Text style={styles.description}>
        Поверх: {floor}
      </Text>
      <Divider style={styles.divider}/>
      <View>
        {!!instruments.length && <>
          {instruments?.map((instrument: InstrumentType) => <InstrumentItem
            key={instrument.id} instrument={instrument} expanded/>)}
            <Divider style={styles.divider}/>
        </>}
      </View>
      <Text style={styles.scheduleHeader}>Розклад на сьогодні</Text>
      {!loading && !error ? data.schedule
          ?.map((scheduleUnit: ScheduleUnitType) => (
            <ScheduleItem scheduleUnit={scheduleUnit} key={scheduleUnit.id}/>
          )) :
        <ActivityIndicator animating={true} color='#2e287c'/>}
      <Divider style={styles.divider}/>
      {!occupied
        ? <Text style={styles.freeText}>{occupiedOnSchedule ? 'Зайнято за розкладом' : 'Вільно'}</Text>
        : !isPendingForMe(occupied, me as User, mode) && (
        <Surface style={[{elevation: visible ? 0 : 4}, styles.occupationInfo]}
                 onTouchEnd={showModal}
        >
          <Text style={styles.occupantName}>{userFullName}</Text>
          <Text style={[{
            backgroundColor: UserTypeColors[occupied.user.type as UserTypes]},
            styles.occupantType
          ]}
          >
            {UserTypesUa[occupied.user.type as UserTypes]}
          </Text>
          {isOwnClassroom(occupied, me) ? (
            timeLeftInPer > 0 && <View style={{marginTop: 30}}>
                <Paragraph>
                    Часу на заняття залишилось: {timeLeft}
                </Paragraph>
                <ProgressBar progress={timeLeftInPer as number / 100} visible color={colors.red}
                             style={styles.progressBar}
                />
            </View>
          ) : (
            <Text style={styles.occupiedUntil}>Зайнято до {getTimeHHMM(new Date(occupied.until))}</Text>
          )}
          <UserInfo userId={occupied.user.id} hideModal={hideModal} visible={visible}/>
        </Surface>
      )}
      <View style={styles.queueSetupButtons}>
        {mode === Mode.INLINE && occupied && occupied.user.id !== me.id && <>
          {minimalClassroomIds.includes(id) ? (
            <Button mode='contained' style={{marginBottom: 8}}>
              Видалити з черги (мінімальні)
            </Button>
          ) : (
            <Button mode='contained' style={{marginBottom: 8}}
                    onPress={() => addOneClassroomToQueue(true)}
            >
              Додати до черги (мінімальні)
            </Button>
          )}
          {desirableClassroomIds.includes(id) ? (
            <Button mode='contained'>
              Видалити з черги (бажані)
            </Button>
          ) : (
            <Button mode='contained'
                    onPress={() => addOneClassroomToQueue(false)}
            >
              Додати до черги (бажані)
            </Button>
          )}
        </>}
        {!occupied && <Button mode='contained'>
            Взяти аудиторію
        </Button>}
        {mode === Mode.PRIMARY && !me.occupiedClassroom && (
          occupied && (
            <Button mode='contained'
                    onPress={() => getInLine([id], [])}
            >Стати в чергу за цією аудиторією</Button>
          )
        )}
        {mode === Mode.QUEUE_SETUP && !me.occupiedClassroom && (
          occupied && (
            <Button mode='contained' onPress={handleAddToLine}>
              {isAlreadyFilteredClassroom(id) ? 'Видалити з черги' : 'Додати до черги'}
            </Button>
          )
        )}
        {occupied && occupied.state === OccupiedState.RESERVED &&
        occupied.user.id === me.id && mode === Mode.INLINE && (
          <>
            {timeLeftInPer > 0 && <View style={styles.spaceBottom30}>
                <Banner visible={visibleBanner} actions={[{
                  label: 'Зрозуміло',
                  onPress: () => setVisibleBanner(false)
                }]}
                        style={styles.spaceBottom30}
                >Заберіть ключі від аудиторії в учбовій частині. Максимальний час знаходження в аудиторії - 3 години.
                </Banner>
                <Paragraph>
                    Часу на прийняття рішення залишилось: {timeLeft}
                </Paragraph>
                <ProgressBar progress={timeLeftInPer as number / 100} visible color={colors.red}
                             style={styles.progressBar}
                />
            </View>}
          </>
        )}
        {occupied && occupied.state === OccupiedState.PENDING &&
        occupied.user.id === me.id && mode === Mode.INLINE && (
          <>
            {timeLeftInPer > 0 && <View style={styles.spaceBottom30}>
                <Banner visible={visibleBanner} actions={[{
                  label: 'Зрозуміло',
                  onPress: () => setVisibleBanner(false)
                }]}
                        style={styles.spaceBottom30}
                >
                  {
                    `Ви можете відхилити аудиторію ${skips} раз${skips === 2 || skips === 3 || skips === 4 ? 'и.' : '.'
                    } Якщо аудиторія не буде підтверджена на протязі визначеного часу, вона буде відхилена автоматично. Якщо показник допустимих відхилень дорівнює нулю і Ви не підтверджуєте та не відхиляєте аудиторію, вона автоматично відхиляється і Ви вибуваєте з черги.`
                  }
                </Banner>
                <Paragraph>
                    Часу на прийняття рішення залишилось: {timeLeft}
                </Paragraph>
                <ProgressBar progress={timeLeftInPer as number / 100} visible color={colors.red}
                             style={styles.progressBar}
                />
            </View>}
            <View>
              <Button mode='contained' style={{marginBottom: 8}} color='#f91354'>
                Відхилити аудиторію
              </Button>
              <Button mode='contained'>Підтвердити аудиторію</Button>
            </View>
          </>
        )}
      </View>
    </View>
  </View>
};

const styles = StyleSheet.create({
  top: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    paddingTop: 26,
    height: 80,
    backgroundColor: '#2e287c',
  },
  container: {
    backgroundColor: '#ffffff'
  },
  wrapper: {
    marginTop: 100,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#fff',
    height: '100%'
  },
  divider: {
    marginTop: 16,
    marginBottom: 16
  },
  department: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center'
  },
  tags: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  tag: {
    marginRight: 8
  },
  description: {
    fontSize: 16,
  },
  scheduleHeader: {
    textAlign: 'center',
    marginBottom: 16,
  },
  occupationInfo: {
    borderRadius: 8,
    padding: 16
  },
  freeText: {
    textAlign: 'center',
    fontSize: 20,
    borderColor: '#ddd',
    borderWidth: 1,
    borderStyle: 'solid',
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 32,
    color: '#bbb'
  },
  occupantName: {
    textAlign: 'center',
    fontSize: 16,
  },
  occupantType: {
    color: '#fff',
    textAlign: 'center',
    alignSelf: 'center',
    paddingVertical: 2,
    paddingHorizontal: 4,
    marginTop: 8,
    borderRadius: 4,
  },
  occupiedUntil: {
    textAlign: 'center',
    marginTop: 8
  },
  queueSetupButtons: {
    marginTop: 32,
    backgroundColor: '#ffffff'
  },
  progressBar: {
    height: 24,
    borderRadius: 6,
  },
  spaceBottom30: {
    marginBottom: 30,
    backgroundColor: '#ffffff'
  }
});