import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import {ClassroomType, OccupiedState, User} from "../../models/models";
import sortAB from "../../helpers/sortAB";
import FreeClassroomCell from "./FreeClassroomCell";
import OccupiedClassroomCell from "./OccupiedClassroomCell";
import ReservedClassroomCell from "./ReservedClassroomCell";
import PendingClassroomCell from "./PendingClassroomCell";
import {isEnabledForCurrentDepartment} from "../../helpers/helpers";
import OccupiedByCurrentUserClassroomCell from "./OccupiedByCurrentUserClassroomCell";

type PropTypes = {
  classrooms: ClassroomType[];
  currentUser: User;
  title?: string;
}

const ClassroomsBrowser: React.FC<PropTypes> = ({
                                                  classrooms, title,
                                                  currentUser
                                                }) => {
  if (!classrooms.length) return null;
  return (
    <>
      {title && <Text style={styles.gridDivider}>
        {title}
      </Text>}
      <View style={styles.grid}>
        {classrooms.slice().sort(sortAB).map(classroom => {
          const {occupied: {state, user}, id} = classroom;
          const isEnabledForCurrentUser = isEnabledForCurrentDepartment(classroom, currentUser);

          const isFree = state === OccupiedState.FREE;
          const isOccupiedByCurrentUser = state === OccupiedState.OCCUPIED && user.id === currentUser.id;
          const isOccupied = state === OccupiedState.OCCUPIED || OccupiedState.PENDING || OccupiedState.RESERVED;
          const isPending = state === OccupiedState.PENDING && user.id === currentUser.id;
          const isReserved = state === OccupiedState.RESERVED && user.id === currentUser.id;

          if (isFree) return <FreeClassroomCell key={id} classroom={classroom}
                                                isEnabledForCurrentUser={isEnabledForCurrentUser}
          />
          if (isReserved) return <ReservedClassroomCell key={id} classroom={classroom}/>
          if (isPending) return <PendingClassroomCell key={id} classroom={classroom}/>
          if (isOccupiedByCurrentUser) return <OccupiedByCurrentUserClassroomCell key={id} classroom={classroom}/>
          if (isOccupied) return <OccupiedClassroomCell key={id} classroom={classroom}
                                                        isEnabledForCurrentUser={isEnabledForCurrentUser}
          />
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
      marginBottom: 8,
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