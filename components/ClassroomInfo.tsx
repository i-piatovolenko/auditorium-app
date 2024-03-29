import React, {useEffect, useState} from 'react';
import {Dimensions, Platform, ScrollView, StyleSheet, Text, View} from "react-native";
import {
  ClassroomType,
  DisabledState,
  InstrumentType,
  Mode,
  OccupiedState,
  Platforms,
  UserQueueState
} from "../models/models";
import {ActivityIndicator, Appbar, Button, Chip, Divider, Title} from "react-native-paper";
import {useNavigation} from "@react-navigation/native";
import {useQuery} from "@apollo/client";
import {
  isEnabledForCurrentDepartment,
  isOccupiedOrPendingByCurrentUser
} from "../helpers/helpers";
import {client} from "../api/client";
import Colors from "../constants/Colors";
import {GET_CLASSROOM} from "../api/operations/queries/classroom";
import {GET_USER_BY_ID} from "../api/operations/queries/users";
import moment from "moment";
import InstrumentItem from "./InstrumentItem";
import OccupantInfo from "./OccupantInfo";
import ClassroomQueueControlButtons from "./ClassroomQueueControlButtons";
import {RESERVE_FREE_CLASSROOM} from "../api/operations/mutations/reserveFreeClassroom";
import {getDistance} from "../helpers/getDistance";
import {UNIVERSITY_LOCATION} from "../constants/constants";
import * as Location from "expo-location";
import ErrorDialog from "./ErrorDialog";
import WaitDialog from "./WaitDialog";
import {useLocal} from "../hooks/useLocal";
import {GET_SCHEDULE_UNITS} from "../api/operations/queries/scheduleUnits";
import ClassroomScheduleInfo from "./ClassroomScheduleInfo";
import {globalErrorVar, modeVar} from "../api/localClient";

interface PropTypes {
  route: any;
}

const windowHeight = Dimensions.get("window").height;

export default function ClassroomInfo({route: {params: {classroomId, currentUserId}}}: PropTypes) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const {data: {maxDistance}} = useLocal('maxDistance');
  const [classroom, setClassroom] = useState<ClassroomType | null>(null);
  const [disableStatus, setDisableStatus] = useState(null);
  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery(GET_USER_BY_ID, {
    variables: {
      where: {
        id: currentUserId
      }
    }
  });
  const {data: scheduleData} = useQuery(GET_SCHEDULE_UNITS, {
    variables: {
      where: {
        AND: [{
          classroomId: {
            equals: classroomId
          }
        }, {
          dayOfWeek: {
            equals: moment().endOf('day').weekday()
          }
        }]
      }
    }
  });

  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (classroom && userData) {
      const isEnabledForCurrentUser = isEnabledForCurrentDepartment(classroom, userData.user);
      const isDisabled = classroom.disabled.state === DisabledState.DISABLED || !isEnabledForCurrentUser;

      isDisabled ? !isEnabledForCurrentUser ?
          !classroom.queueInfo.queuePolicy.queueAllowedDepartments.length ?
            Platform.OS === Platforms.WEB ? setDisableStatus('Недоступно')
              : setDisableStatus('Недоступно для студентів')
            : Platform.OS === Platforms.WEB ? setDisableStatus('Недоступно') :
              setDisableStatus('Тільки ' + classroom.queueInfo.queuePolicy
                .queueAllowedDepartments.map(({department: {name}}) => name.toLowerCase()).join(', '))
          : Platform.OS === Platforms.WEB ? setDisableStatus(classroom.disabled?.comment)
            : setDisableStatus(classroom.disabled?.comment + ' до ' + moment(classroom.disabled.until).format('DD-MM-YYYY HH:mm'))
        : setDisableStatus(null)
    }
  }, [classroom, classroom?.queueInfo.queuePolicy, userData, userError, userLoading]);

  const requestLocation = async () => {
    setLoading(true);
    let {status} = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Щоб взяти аудиторію або стати в чергу, потрібно надати дозвіл на геолокацію.');
    } else {
      setErrorMsg(null);
    }
  };

  const getIsNear = async () => {
    let isNear;
    let location;
    await requestLocation();
    try {
      location = await Location.getCurrentPositionAsync({});
    } catch (e) {
      setLoading(false);
    }
    if (location) {
      const distance = getDistance(location.coords.latitude, location.coords.longitude,
        UNIVERSITY_LOCATION.lat, UNIVERSITY_LOCATION.long, 'K');
      if (distance <= maxDistance) {
        isNear = true;
      } else {
        isNear = false
        setErrorMsg(`Щоб взяти аудиторію або стати в чергу, Ви маєте знаходитись від академії на відстані, що не перебільшує ${maxDistance * 1000} м. Ваша відстань: ${
          (distance * 1000).toFixed(0)
        } м.`)
      }
    }
    return isNear;
  };

  useEffect(() => {
    setLoading(true);
    try {
      client.query({
        query: GET_CLASSROOM,
        variables: {
          where: {
            id: classroomId
          }
        },
      }).then(({data}: any) => {
        setClassroom(data.classroom);
      });
    } catch (e: any) {
      globalErrorVar(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const goBack = () => navigation.goBack();

  const getReservedClassroom = async () => {
    setLoading(true);
    const isNear = await getIsNear();
    if (isNear) {
      try {
        await client.mutate({
          mutation: RESERVE_FREE_CLASSROOM,
          variables: {
            input: {
              classroomName: classroom.name
            }
          }
        });
        modeVar(Mode.PRIMARY);
        goBack();
      } catch (e: any) {
        globalErrorVar(e.message);
      } finally {
        setLoading(false);
      }
    }
    setLoading(false);
  };

  return <View style={styles.container}>
    <Appbar style={styles.top}>
      <Appbar.BackAction onPress={goBack}/>
      {classroom && userData && (
        <Appbar.Content
          title={`Аудиторія ${classroom.name}`}
          subtitle={classroom.chair ? classroom.chair.name : ''}
        />
      )}
    </Appbar>
    <View style={styles.wrapper}>
      {(userLoading || !classroom) ? <ActivityIndicator animating color='#fff' size={64}/> : (
        <ScrollView>
          {disableStatus && (
            <View style={styles.warning}>
              <Title style={styles.warningText}>{disableStatus}</Title>
            </View>
          )}
          {classroom.isHidden && (
            <View style={styles.warning}>
              <Title style={styles.warningText}>Аудиторія недоступна</Title>
            </View>
          )}
          {classroom.isWing || classroom.isOperaStudio || !!classroom.special && (
            <>
              <View style={styles.tags}>
                {classroom.isWing && <Chip selected selectedColor='#00f' mode='outlined'
                                           style={styles.tag}>Флігель</Chip>}
                {classroom.isOperaStudio && <Chip selected selectedColor='#00f' mode='outlined'
                                                  style={styles.tag}>Оперна студія</Chip>}
                {!!classroom.special && <Chip selected selectedColor='#00f' mode='outlined'
                                              style={styles.tag}>Спеціалізована</Chip>}
              </View>
              <Divider style={styles.divider}/>
            </>
          )}
          {!!classroom.description && (
            <>
              <View>
                <Text style={{textAlign: 'center'}}>{classroom.description}</Text>
              </View>
              <Divider style={styles.divider}/>
            </>
          )}
          {scheduleData && <ClassroomScheduleInfo units={scheduleData.scheduleUnits}/>}
          <View>
            <Text style={{textAlign: 'center'}}>Поверх: {classroom.floor}</Text>
          </View>
          <Divider style={styles.divider}/>
          <View>
            {!!classroom.instruments.length && (
              <>
                {classroom.instruments?.map((instrument: InstrumentType) => (
                  <InstrumentItem key={instrument.id} instrument={instrument} expanded/>
                ))}
                <Divider style={styles.divider}/>
              </>
            )}
          </View>
          <OccupantInfo classroom={classroom} user={userData.user} navigation={navigation}/>
          {classroom.occupied.state !== OccupiedState.FREE || classroom.disabled.state === DisabledState.DISABLED
          && !isOccupiedOrPendingByCurrentUser(classroom.occupied, userData.user)
          && <ClassroomQueueControlButtons classroom={classroom} currentUser={userData.user}/>
          }
          {classroom.disabled.state !== DisabledState.DISABLED
          && classroom.occupied.state === OccupiedState.FREE
          && isEnabledForCurrentDepartment(classroom, userData.user)
          && userData.user?.queueInfo.currentSession?.state !== UserQueueState.OCCUPYING
          && userData.user?.queueInfo.currentSession?.state !== UserQueueState.IN_QUEUE_DESIRED_AND_OCCUPYING
          && (
            <>
              <Divider style={styles.divider}/>
              <Button mode='contained' onPress={getReservedClassroom} disabled={!classroom || loading}>
                <Text>Взяти аудиторію</Text>
              </Button>
            </>
          )}
        </ScrollView>
      )}
      <ErrorDialog visible={!!errorMsg} hideDialog={() => setErrorMsg(null)}
                   message={errorMsg}
      />
      <WaitDialog visible={loading}/>
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
    backgroundColor: '#ffffff',
    height: windowHeight
  },
  wrapper: {
    marginTop: 100,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#fff',
  },
  warning: {
    backgroundColor: '#f9135411',
    borderColor: Colors.red,
    borderWidth: 2,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16
  },
  warningText: {
    fontWeight: "bold",
    color: Colors.red,
    textAlign: "center"
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
  },
});
