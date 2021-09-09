import React, {useEffect} from "react";
import {Snackbar} from "react-native-paper";
import { skippedClassroomVar } from "../api/client";
import {useLocal} from "../hooks/useLocal";
import {StyleSheet} from "react-native";

type PropTypes = {
  skipsCount: number;
}

const SkippedClassroomSnackbar: React.FC<PropTypes> = ({skipsCount}) => {
  const {data: {skippedClassroom}} = useLocal('skippedClassroom');

  useEffect(() => {
    setTimeout(() => {
      skippedClassroomVar(false);
    }, 3000);
  }, []);

  return (
    <Snackbar
      style={styles.snackbar}
      visible
      onDismiss={() => skippedClassroomVar(false)}
    >
      {`Ви пропустили аудиторію. Залишилось пропусків: ${skipsCount ? skipsCount : 0}.`}
    </Snackbar>
  );
}

const styles = StyleSheet.create({
  snackbar: {
    position: 'absolute',
    zIndex: 3,
    bottom: 16
  }
});

export default SkippedClassroomSnackbar;