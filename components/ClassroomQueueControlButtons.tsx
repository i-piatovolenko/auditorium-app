import React, {useState} from 'react';
import {useLocal} from "../hooks/useLocal";
import {Button, Divider} from "react-native-paper";
import {desirableClassroomIdsVar, minimalClassroomIdsVar} from "../api/client";
import {StyleSheet, Text} from "react-native";
import {ClassroomType, Mode, QueueRecord, QueueType, User, UserQueueState} from "../models/models";
import getInLine from "../helpers/queue/getInLine";
import WaitDialog from "./WaitDialog";
import {isEnabledForQueue} from "../helpers/helpers";
import {useNavigation} from "@react-navigation/native";
import removeFromLine from "../helpers/queue/removeFromLine";

type PropTypes = {
  classroom: ClassroomType;
  currentUser: User;
}

const ClassroomQueueControlButtons: React.FC<PropTypes> = ({
                                                             classroom, currentUser: {
    queueInfo: {currentSession}, queue, ...currentUser
  }
                                                           }) => {
  const {data: {mode}} = useLocal('mode');
  const {data: {isMinimalSetup}} = useLocal('isMinimalSetup');
  const {data: {desirableClassroomIds}} = useLocal('desirableClassroomIds');
  const {data: {minimalClassroomIds}} = useLocal('minimalClassroomIds');
  const currentRecord: QueueRecord[] = currentSession?.state === UserQueueState.IN_QUEUE_MINIMAL
    && queue.filter(queueRecord => queueRecord.classroom.id === classroom.id);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleClassroomForQueue = async () => {
    if (isMinimalSetup) {
      const minimalSet = new Set([...minimalClassroomIds]);
      minimalSet.has(classroom.id) ? minimalSet.delete(classroom.id) : minimalSet.add(classroom.id)
      minimalClassroomIdsVar([...minimalSet]);
    } else {
      const desiredSet = new Set([...desirableClassroomIds]);
      desiredSet.has(classroom.id) ? desiredSet.delete(classroom.id) : desiredSet.add(classroom.id)
      desirableClassroomIdsVar([...desiredSet]);
    }
    navigation.goBack();
  };

  const asyncHandleClassroomForQueue = async (exist: boolean) => {
    setLoading(true);
    if (currentSession?.state === UserQueueState.IN_QUEUE_MINIMAL) {
      if (exist) {
        await removeFromLine(classroom.id, currentSession)
      } else {
        await getInLine([classroom.id], []);
      }
    } else if (currentSession?.state === UserQueueState.IN_QUEUE_DESIRED_AND_OCCUPYING) {
      if (exist) {
        await removeFromLine(classroom.id, currentSession)
      } else {
        await getInLine([], [classroom.id]);
      }
    }
    setLoading(false);
    navigation.goBack();
  };
  if (!isEnabledForQueue(classroom, currentUser)) return null;
  return (
    <>
      <WaitDialog visible={loading}/>
      {mode === Mode.QUEUE_SETUP && (
        <>
          <Divider style={styles.divider}/>
          {isMinimalSetup ? (
            minimalClassroomIds.includes(classroom.id) ? (
              <Button mode='contained' style={{marginBottom: 8}}
                      onPress={handleClassroomForQueue}
              >
                <Text>Видалити з черги (мінімальні)</Text>
              </Button>
            ) : (
              <Button mode='contained' style={{marginBottom: 8}}
                      onPress={handleClassroomForQueue}
              >
                <Text>Додати до черги (мінімальні)</Text>
              </Button>
            )
          ) : (
            desirableClassroomIds.includes(classroom.id) ? (
              <Button mode='contained' style={{marginBottom: 8}}
                      onPress={handleClassroomForQueue}
              >
                <Text>Видалити з черги (бажані)</Text>
              </Button>
            ) : (
              <Button mode='contained' style={{marginBottom: 8}}
                      onPress={handleClassroomForQueue}
              >
                <Text>Додати до черги (бажані)</Text>
              </Button>
            )
          )}
        </>
      )}
      {(currentSession?.state === UserQueueState.IN_QUEUE_MINIMAL
        || currentSession?.state === UserQueueState.IN_QUEUE_DESIRED_AND_OCCUPYING)
      && (
        <>
          <Divider style={styles.divider}/>
          {currentRecord.some(({type}) => type === QueueType.MINIMAL) ? (
            <Button mode='contained' style={{marginBottom: 8}}
                    onPress={() => asyncHandleClassroomForQueue(true)}
            >
              <Text>Видалити з черги</Text>
            </Button>
          ) : (
            <Button mode='contained' style={{marginBottom: 8}}
                    onPress={() => asyncHandleClassroomForQueue(false)}
            >
              <Text>Додати до черги</Text>
            </Button>
          )}
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create(
  {
    divider: {
      marginTop: 16,
      marginBottom: 16
    },
  }
)

export default ClassroomQueueControlButtons;