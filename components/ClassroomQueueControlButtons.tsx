import React from 'react';
import {useLocal} from "../hooks/useLocal";
import {Button, Divider} from "react-native-paper";
import {desirableClassroomIdsVar, minimalClassroomIdsVar} from "../api/client";
import {StyleSheet} from "react-native";

type PropTypes = {
  classroomId: number;
  currentUserId: number;
}

const ClassroomQueueControlButtons: React.FC<PropTypes> = ({classroomId, currentUserId}) =>  {
  const {data: {isMinimalSetup}} = useLocal('isMinimalSetup');
  const {data: {desirableClassroomIds}} = useLocal('desirableClassroomIds');
  const {data: {minimalClassroomIds}} = useLocal('minimalClassroomIds');

  const handleClassroomForQueue = async () => {
    if (isMinimalSetup) {
      const minimalSet = new Set([...minimalClassroomIds]);
      minimalSet.has(classroomId) ? minimalSet.delete(classroomId) : minimalSet.add(classroomId)
      minimalClassroomIdsVar([...minimalSet]);
    } else {
      const desiredSet = new Set([...desirableClassroomIds]);
      desiredSet.has(classroomId) ? desiredSet.delete(classroomId) : desiredSet.add(classroomId)
      desirableClassroomIdsVar([...desiredSet]);
    }
  };

  return (
    <>
      <Divider style={styles.divider}/>
      {isMinimalSetup ? (
        minimalClassroomIds.includes(classroomId) ? (
            <Button mode='contained' style={{marginBottom: 8}}
                    onPress={handleClassroomForQueue}
            >
              Видалити з черги (мінімальні)
            </Button>
          ) : (
            <Button mode='contained' style={{marginBottom: 8}}
                    onPress={handleClassroomForQueue}
            >
              Додати до черги (мінімальні)
            </Button>
          )
      ) : (
        desirableClassroomIds.includes(classroomId) ? (
          <Button mode='contained' style={{marginBottom: 8}}
                  onPress={handleClassroomForQueue}
          >
            Видалити з черги (бажані)
          </Button>
        ) : (
          <Button mode='contained' style={{marginBottom: 8}}
                  onPress={handleClassroomForQueue}
          >
            Додати до черги (бажані)
          </Button>
        )
      )}
    </>
  );
}

const styles = StyleSheet.create({
  divider: {
    marginTop: 16,
    marginBottom: 16
  },
})

export default ClassroomQueueControlButtons;