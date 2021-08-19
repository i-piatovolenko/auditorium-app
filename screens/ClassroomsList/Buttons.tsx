import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import {Button} from "react-native-paper";
import Colors from "../../constants/Colors";
import {hasOwnClassroom} from "../../helpers/helpers";
import {Mode} from "../../models/models";
import {useLocal} from "../../hooks/useLocal";
import {desirableClassroomIdsVar, minimalClassroomIdsVar, modeVar} from "../../api/client";

type PropTypes = {
  currentUser: any;
}

const Buttons: React.FC<PropTypes> = ({currentUser}) => {
  const {data: {mode}} = useLocal('mode');

  const handlePress = () => {
    if (mode === Mode.PRIMARY) modeVar(Mode.QUEUE_SETUP);
    if (mode === Mode.QUEUE_SETUP) {
      modeVar(Mode.PRIMARY);
      minimalClassroomIdsVar([]);
      desirableClassroomIdsVar([]);
    }
    if (mode === Mode.INLINE) modeVar(Mode.PRIMARY);
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
                  onPress={handlePress}>
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