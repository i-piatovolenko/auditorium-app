import {Text, StyleSheet, View} from "react-native";
import ClassroomsCell from "../../components/ClassroomCell";
import {ClassroomType, CurrentUser, User} from "../../models/models";
import React from "react";

type PropTypes = {
  me: CurrentUser;
  classrooms: ClassroomType[];
  isMinimalSetup: boolean;
  minimalClassroomIds: number[];
  desirableClassroomIds: number[];
}

export default function MyClassroomCell({me, classrooms, isMinimalSetup, minimalClassroomIds,
                                          desirableClassroomIds}: PropTypes) {
  const {occupiedClassroom: classroom} = me;

  return classroom ? (
    <View style={styles.container}>
      <Text style={styles.gridDivider}>
        Моя аудиторія:
      </Text>
      <View style={styles.grid}>
        <ClassroomsCell key={classroom.id}
                        classroom={classrooms
                          .find(({id}) => id === classroom.id) as ClassroomType}
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