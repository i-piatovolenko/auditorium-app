import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text} from "react-native";
import {
  ClassroomType,
  DisabledState,
  InstrumentType,
  OccupiedState,
  QueueState,
  QueueType, UserQueueState
} from "../models/models";
import {ActivityIndicator, Appbar, Button, Chip, Divider, Subheading, Title} from "react-native-paper";
import {useNavigation} from "@react-navigation/native";
import {useQuery} from "@apollo/client";
import {isEnabledForCurrentDepartment, isOccupiedOrPendingByCurrentUser} from "../helpers/helpers";
import {useLocal} from "../hooks/useLocal";
import {client} from "../api/client";
import {ADD_USER_TO_QUEUE} from "../api/operations/mutations/addUserToQueue";
import Colors from "../constants/Colors";
import {GET_CLASSROOM} from "../api/operations/queries/classroom";
import {GET_USER_BY_ID} from "../api/operations/queries/users";
import moment from "moment";
import InstrumentItem from "./InstrumentItem";
import OccupantInfo from "./OccupantInfo";
import ClassroomQueueControlButtons from "./ClassroomQueueControlButtons";

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
  } = useQuery(GET_USER_BY_ID, {
    variables: {
      where: {
        id: currentUserId
      }
    }
  });
  const {data: {mode}} = useLocal('mode');
  const {data: {isMinimalSetup}} = useLocal('isMinimalSetup');
  const {data: {desirableClassroomIds}} = useLocal('desirableClassroomIds');
  const {data: {minimalClassroomIds}} = useLocal('minimalClassroomIds');

  useEffect(() => {
    try {
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

  const goBack = () => navigation.goBack();

  const getReservedClassroom = () => {
    //TODO: get FREE classroom with RESERVED state
    alert('TODO: get FREE classroom with RESERVED state')
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
      {(!classroom || !userData) ? <ActivityIndicator animating color='#fff' size={64}/> : (
        <View>
          {!isEnabledForCurrentDepartment(classroom, userData.user) && (
            <View style={styles.warning}>
              <Title style={styles.warningText}>Аудиторія недоступна для вашої кафедри</Title>
            </View>
          )}
          {classroom.disabled.state === DisabledState.DISABLED && (
            <View style={styles.warning}>
              <Title style={styles.warningText}>Аудиторія відключена від системи</Title>
              <Title style={styles.warningText}>{classroom.disabled.comment}</Title>
              <Title style={styles.warningText}>
                до {moment(classroom.disabled.until).format('DD-MM-YYYY HH:mm')}
              </Title>
            </View>
          )}
          {classroom.isHidden && (
            <View style={styles.warning}>
              <Title style={styles.warningText}>Аудиторія недоступна</Title>
            </View>
          )}
          <View style={styles.tags}>
            {classroom.isWing && <Chip selected selectedColor='#00f' mode='outlined'
                                       style={styles.tag}>Флігель</Chip>}
            {classroom.isOperaStudio && <Chip selected selectedColor='#00f' mode='outlined'
                                              style={styles.tag}>Оперна студія</Chip>}
            {classroom.special && <Chip selected selectedColor='#00f' mode='outlined'
                                        style={styles.tag}>Спеціалізована</Chip>}
          </View>
          <Divider style={styles.divider}/>
          <View>
            <Text style={{textAlign: 'center'}}>{classroom.description}</Text>
          </View>
          <Divider style={styles.divider}/>
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
          <OccupantInfo classroom={classroom} user={userData.user}/>
          {classroom.occupied.state !== OccupiedState.FREE
          && !isOccupiedOrPendingByCurrentUser(classroom.occupied, userData.user)
          && <ClassroomQueueControlButtons classroom={classroom} currentUser={userData.user}/>
          }
          {classroom.occupied.state === OccupiedState.FREE
          && userData.user.queueInfo.currentSession.state !== UserQueueState.OCCUPYING
          && userData.user.queueInfo.currentSession.state !== UserQueueState.IN_QUEUE_DESIRED_AND_OCCUPYING
          && (
            <>
              <Divider style={styles.divider}/>
              <Button mode='contained' onPress={getReservedClassroom}>
                Взяти аудиторію
              </Button>
            </>
          )}
        </View>
      )}
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
  }
});