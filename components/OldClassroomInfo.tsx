import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from "react-native";
import {
  ClassroomType,
  InstrumentType,
  Mode,
  OccupiedState,
  QueueState,
  QueueType,
  UserTypeColors,
  UserTypes,
  UserTypesUa
} from "../models/models";
import {
  ActivityIndicator,
  Appbar,
  Banner,
  Button,
  Chip,
  Divider,
  Paragraph,
  ProgressBar,
  Surface
} from "react-native-paper";
import InstrumentItem from "./InstrumentItem";
import {useNavigation} from "@react-navigation/native";
import {useQuery} from "@apollo/client";
import {fullName, getTimeHHMM, isNotFree, isOwnClassroom, isPendingForMe} from "../helpers/helpers";
import UserInfo from "./UserInfo";
import {useLocal} from "../hooks/useLocal";
import getInLine from "../helpers/queue/getInLine";
import {client} from "../api/client";
import {ADD_USER_TO_QUEUE} from "../api/operations/mutations/addUserToQueue";
import useTimeLeft from "../hooks/useTimeLeft";
import colors from "../constants/Colors";
import {GET_CLASSROOM} from "../api/operations/queries/classroom";
import {GET_USER_BY_ID} from "../api/operations/queries/users";

interface PropTypes {
  route: any;
}

export default function ClassroomInfo({route: {params: {classroomId, currentUserId}}}: PropTypes) {
  const navigation = useNavigation();
  const [classroom, setClassroom] = useState<ClassroomType | null>(null);
  const {
    data: userData,
    loading: userLoading,
    error: userError,
    subscribeToMore: subscribeToMoreUser
  } = useQuery(GET_USER_BY_ID, {
    variables: {
      where: {
        id: currentUserId
      }
    }
  });
  if (!classroom && !userLoading && !userError) return <ActivityIndicator animating color='#fff' size={64}/>;
  const userFullName = isNotFree(classroom?.occupied) ? fullName(classroom?.occupied.user) : '';
  // const occupiedOnSchedule = isOccupiedOnSchedule(schedule);
  const [visible, setVisible] = useState(false);
  const {data: {mode}} = useLocal('mode');
  const {data: {isMinimalSetup}} = useLocal('isMinimalSetup');
  const {data: {desirableClassroomIds}} = useLocal('desirableClassroomIds');
  const {data: {minimalClassroomIds}} = useLocal('minimalClassroomIds');
  const occupiedTotalTime = classroom?.occupied.state === OccupiedState.OCCUPIED ? 180 : 2;
  const [timeLeft, timeLeftInPer] = useTimeLeft(classroom?.occupied, occupiedTotalTime);
  const [visibleBanner, setVisibleBanner] = useState(true);
  const [skips, setSkips] = useState(0);

  useEffect(() => {
    try {
      setVisibleBanner(true);
      client.query({
        query: GET_CLASSROOM,
        variables: {
          where: {
            id: classroomId
          }
        }
      }).then(({data}: any) => {
        setClassroom(data.classroom);
      });
    } catch (e) {
      alert(JSON.stringify(e));
    }
  }, []);

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

  const handleAddToQueueSetup = () => {
  };

  const addOneClassroomToQueue = async (isMinimal: boolean) => {
    try {
      await client.mutate({
        mutation: ADD_USER_TO_QUEUE,
        variables: {
          input: [{
            userId: currentUserId.id,
            classroomId: classroomId,
            state: QueueState.ACTIVE,
            type: isMinimal ? QueueType.MINIMAL : QueueType.DESIRED
          }]
        }
      });
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
        title={`${isOwnClassroom(classroom.occupied, userData.user) ? 'Моя аудиторія' : 'Аудиторія'} ${name}`}
        subtitle={classroom.chair ? classroom.chair.name : ''}
      />
    </Appbar>
    <View style={styles.wrapper}>
      {(classroom.isWing || classroom.isOperaStudio || classroom.special) && <>
          <View style={styles.tags}>
            {classroom.isWing && <Chip selected selectedColor='#00f' mode='outlined'
                                       style={styles.tag}>Флігель</Chip>}
            {classroom.isOperaStudio && <Chip selected selectedColor='#00f' mode='outlined'
                                              style={styles.tag}>Оперна студія</Chip>}
            {classroom.special && <Chip selected selectedColor='#00f' mode='outlined'
                                        style={styles.tag}>Спеціалізована</Chip>}
          </View>
          <Divider style={styles.divider}/>
      </>}
      <Text style={styles.description}>
        {classroom.description}
      </Text>
      <Divider style={styles.divider}/>
      <Text style={styles.description}>
        Поверх: {classroom.floor}
      </Text>
      <Divider style={styles.divider}/>
      <View>
        {!!classroom.instruments.length && <>
          {classroom.instruments?.map((instrument: InstrumentType) => <InstrumentItem
            key={instrument.id} instrument={instrument} expanded/>)}
            <Divider style={styles.divider}/>
        </>}
      </View>
      {/*<Text style={styles.scheduleHeader}>Розклад на сьогодні</Text>*/}
      {/*{!loading && !error ? data.schedule*/}
      {/*    ?.map((scheduleUnit: ScheduleUnitType) => (*/}
      {/*      <ScheduleItem scheduleUnit={scheduleUnit} key={scheduleUnit.id}/>*/}
      {/*    )) :*/}
      {/*  <ActivityIndicator animating={true} color='#2e287c'/>}*/}
      <Divider style={styles.divider}/>
      {!isNotFree(classroom.occupied)
        ? <Text style={styles.freeText}>Вільно</Text>
        : !isPendingForMe(classroom.occupied, userData.user, mode) && (
        <Surface style={[{elevation: visible ? 0 : 4}, styles.occupationInfo]}
                 onTouchEnd={showModal}
        >
          <Text style={styles.occupantName}>{userFullName}</Text>
          <Text style={[{
            backgroundColor: UserTypeColors[classroom.occupied.user.type as UserTypes]
          },
            styles.occupantType
          ]}
          >
            {UserTypesUa[classroom.occupied.user.type as UserTypes]}
          </Text>
          {isOwnClassroom(classroom.occupied, userData.user) ? (
            timeLeftInPer > 0 && <View style={{marginTop: 30}}>
                <Paragraph>
                    Часу на заняття залишилось: {timeLeft}
                </Paragraph>
                <ProgressBar progress={timeLeftInPer as number / 100} visible color={colors.red}
                             style={styles.progressBar}
                />
            </View>
          ) : (
            <Text style={styles.occupiedUntil}>Зайнято до {getTimeHHMM(new Date(classroom.occupied.until))}</Text>
          )}
          <UserInfo userId={classroom.occupied.user.id} hideModal={hideModal} visible={visible}/>
        </Surface>
      )}
      <View style={styles.queueSetupButtons}>
        {mode === Mode.INLINE
        && isNotFree(classroom.occupied)
        && classroom.occupied.user.id !== currentUserId
        && <>
          {minimalClassroomIds.includes(classroom.id) ? (
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
          {desirableClassroomIds.includes(classroom.id) ? (
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
        {!isNotFree(classroom.occupied) && <Button mode='contained'>
            Взяти аудиторію
        </Button>}
        {/*TODO occupiedClassrooms*/}
        {mode === Mode.PRIMARY && classroom.occupied.state !== OccupiedState.FREE
        && currentUserId !== classroom.occupied.user.id && (
          <Button mode='contained'
                  onPress={() => getInLine([classroomId], [])}
          >Стати в чергу за цією аудиторією</Button>
        )}
        {/*TODO occupiedClassrooms*/}

        {mode === Mode.QUEUE_SETUP && !userData.user.occupiedClassrooms.find(({occupied}: ClassroomType) => {
          return occupied.state === OccupiedState.OCCUPIED
        }) && (
          isNotFree(classroom.occupied) && (
            <Button mode='contained' onPress={handleAddToQueueSetup}>
              {isAlreadyFilteredClassroom(classroomId) ? 'Видалити з черги' : 'Додати до черги'}
            </Button>
          )
        )}
        {classroom.occupied.state === OccupiedState.RESERVED &&
        classroom.occupied.user.id === currentUserId && mode === Mode.INLINE && (
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
        {classroom.occupied.state === OccupiedState.PENDING &&
        classroom.occupied.user.id === currentUserId && mode === Mode.INLINE && (
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