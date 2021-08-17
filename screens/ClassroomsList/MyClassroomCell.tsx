import {StyleSheet, Text, View} from "react-native";
import ClassroomsCell from "../../components/ClassroomCell";
import {ClassroomType, CurrentUser, OccupiedState} from "../../models/models";
import React, {useEffect, useState} from "react";

type PropTypes = {
  me: CurrentUser;
  classrooms: ClassroomType[];
  isMinimalSetup: boolean;
  minimalClassroomIds: number[];
  desirableClassroomIds: number[];
}

export default function MyClassroomCell({
                                          me, classrooms, isMinimalSetup, minimalClassroomIds,
                                          desirableClassroomIds
                                        }: PropTypes) {
  const [ownClassroom, setOwnClassroom] = useState(null);

  useEffect(() => {
    const own = classrooms.find(({occupied}) => {
      return occupied.state === OccupiedState.OCCUPIED && me.id === occupied.user.id;
    });
    if (own) {
      setOwnClassroom(own);
    } else {
      setOwnClassroom(null);
    }
  }, [classrooms, me]);

  return ownClassroom ? (
    <View style={styles.container}>
      <Text style={styles.gridDivider}>
        Моя аудиторія:
      </Text>
      <View style={styles.grid}>
        <ClassroomsCell key={ownClassroom.id} classroom={ownClassroom}
                        filteredList={isMinimalSetup ? minimalClassroomIds : desirableClassroomIds}
        />
      </View>
    </View>
  ) : <></>
}

const styles = StyleSheet.create({
  gridDivider: {
    color: '#fff',
    marginBottom: 10,
    marginLeft: 3,
    marginRight: 3,
    paddingLeft: 17,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff77',
    paddingBottom: 10
  },
  container: {
    marginBottom: 10,
  },
  grid: {
    marginLeft: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start'
  },
});