import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from "react-native";
import {useQuery} from "@apollo/client";
import {GET_CLASSROOMS_NO_SCHEDULE} from "../../api/operations/queries/classrooms";
import {FOLLOW_CLASSROOMS} from "../../api/operations/subscriptions/classrooms";
import {ActivityIndicator} from "react-native-paper";
import {ClassroomType, DisabledState, OccupiedState} from "../../models/models";
import sortAB from "../../helpers/sortAB";
import FreeClassroomCell from "./FreeClassroomCell";
import OccupiedClassroomCell from "./OccupiedClassroomCell";

type PropTypes = {
  classrooms: ClassroomType[];
  title?: string;
}

const ClassroomsBrowser: React.FC<PropTypes> = ({classrooms, title}) => {
  if (!classrooms.length) return null;
  return (
    <>
      {title && <Text style={styles.gridDivider}>
        {title}
      </Text>}
      <View style={styles.grid}>
        {classrooms.slice().sort(sortAB).map(classroom => {
          const isFree = classroom.occupied.state === OccupiedState.FREE;
          const isOccupied = classroom.occupied.state === OccupiedState.OCCUPIED;
          const isPending = classroom.occupied.state === OccupiedState.PENDING;
          const isReserved = classroom.occupied.state === OccupiedState.RESERVED;

          if (isFree) return <FreeClassroomCell key={classroom.id} classroom={classroom}/>
          if (isOccupied) return <OccupiedClassroomCell key={classroom.id} classroom={classroom}/>
          else return <></>;
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create(
  {
    top: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      paddingTop: 26,
      height: 80,
      backgroundColor: 'transparent',
      zIndex: 1
    },
    grid: {
      marginBottom: 10,
      marginLeft: 2,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start'
    },
    getInLine: {
      position: 'absolute',
      zIndex: 1,
      bottom: 15,
      width: '55%',
      height: 50,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center'
    },
    getOutLine: {
      position: 'absolute',
      zIndex: 1,
      bottom: 15,
      left: 20,
      width: '43%',
      height: 50,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center'
    },
    getOutLineSingle: {
      position: 'absolute',
      zIndex: 1,
      bottom: 15,
      width: '55%',
      height: 50,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center'
    },
    approve: {
      position: 'absolute',
      zIndex: 1,
      right: 20,
      bottom: 15,
      width: '43%',
      height: 50,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center'
    },
    wrapper: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      paddingTop: 80,
    },
    queueSwitcher: {
      flexDirection: 'row',
      width: '76%',
      justifyContent: 'center',
      paddingHorizontal: 5,
      marginHorizontal: 20,
      alignItems: 'center',
    },
    gridDivider: {
      color: '#fff',
      marginBottom: 10,
      marginLeft: 3,
      marginRight: 3,
      paddingLeft: 17,
      borderBottomWidth: 1,
      borderBottomColor: '#ffffff77',
      paddingBottom: 10
    }
  }
);

export default ClassroomsBrowser;