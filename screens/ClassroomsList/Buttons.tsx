import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from "react-native";
import {Button} from "react-native-paper";
import Colors from "../../constants/Colors";
import {hasOwnClassroom} from "../../helpers/helpers";
import {ClassroomType, Mode, SavedFilterT} from "../../models/models";
import {useLocal} from "../../hooks/useLocal";
import {desirableClassroomIdsVar, minimalClassroomIdsVar, modeVar} from "../../api/client";
import {filterDisabledForQueue} from "../../helpers/filterDisabledForQueue";
import {getItem} from "../../api/asyncStorage";
import {filterSavedFilter} from "../../helpers/filterSavedFIlters";
import getInLine from "../../helpers/queue/getInLine";
import ErrorDialog from "../../components/ErrorDialog";
import moment from "moment";

type PropTypes = {
  currentUser: any;
  classrooms: ClassroomType[];
}

const Buttons: React.FC<PropTypes> = ({currentUser: {queueInfo: {sanctionedUntil}, ...currentUser},
                                        classrooms}) => {
  const {data: {mode}} = useLocal('mode');
  const {data: {desirableClassroomIds}} = useLocal('desirableClassroomIds');
  const {data: {minimalClassroomIds}} = useLocal('minimalClassroomIds');
  const [visibleModalError, setVisibleModalError] = useState(false);
  const queueErrorMessage = `Ви не можете ставати в чергу через накладені санкції до ${sanctionedUntil ? moment(sanctionedUntil)
    .format('DD-MM-YYYY HH:mm') : ''}. До закінчення санкційного терміну ви можете брати вільні аудиторії.`;

  const handlePress = async () => {
    if (sanctionedUntil) return setVisibleModalError(true);
    if (mode === Mode.PRIMARY) {
      const availableClassroomsIds = classrooms.filter(classroom => {
        return filterDisabledForQueue(classroom, currentUser);
      }).map(({id}) => id);
      modeVar(Mode.QUEUE_SETUP);
      const savedFilters: SavedFilterT[] | undefined = await getItem('filters');
      if (savedFilters) {
        const mainFilter = savedFilters!.find(filter => filter.main);
        if (mainFilter) {
          filterSavedFilter(mainFilter, classrooms, currentUser)
        } else {
          minimalClassroomIdsVar(availableClassroomsIds);
          desirableClassroomIdsVar([]);
        }
      }
    }
    if (mode === Mode.QUEUE_SETUP) {
      modeVar(Mode.PRIMARY);
      minimalClassroomIdsVar([]);
      desirableClassroomIdsVar([]);
    }
    if (mode === Mode.INLINE) modeVar(Mode.PRIMARY);
  };

  const handleReady = async () => {
    await getInLine(minimalClassroomIds, desirableClassroomIds);
  };

  return (
    <View style={styles.wrapper}>
      {mode === Mode.PRIMARY && !(hasOwnClassroom(currentUser.occupiedClassrooms)) && (
        <Button style={styles.getInLine} mode='contained' color={Colors.blue}
                onPress={handlePress}>
          <Text>Стати в чергу</Text>
        </Button>
      )}
      {mode === Mode.QUEUE_SETUP && (
        <>
          <Button style={styles.getOutLine} mode='contained' color={Colors.red}
                  onPress={handlePress}>
            <Text>Відміна</Text>
          </Button>
          <Button style={styles.approve} mode='contained' color={Colors.blue}
                  disabled={!minimalClassroomIds.length && !desirableClassroomIds.length}
                  onPress={handleReady}>
            <Text>Стати в чергу</Text>
          </Button>
        </>
      )}
      {mode === Mode.INLINE && (
        <Button style={styles.getOutLine} mode='contained' color={Colors.red}
                onPress={handlePress}>
          <Text>Вийти з черги</Text>
        </Button>
      )}
      <ErrorDialog visible={visibleModalError} hideDialog={() => setVisibleModalError(false)}
        message={queueErrorMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create(
  {
    wrapper: {
      position: 'absolute',
      bottom: 16,
      left: 16,
      right: 16,
      flexDirection: 'row',
      justifyContent: 'center',
      zIndex: 1
    },

    getInLine: {
      width: '55%',
      height: 50,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center'
    },
    getOutLine: {
      height: 50,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
    },
    getOutLineSingle: {
      height: 50,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center'
    },
    approve: {
      width: '48%',
      height: 50,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center'
    }
  }
);

export default Buttons;