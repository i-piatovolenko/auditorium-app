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
      wrapperStyle={styles.snackbar}
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
    zIndex: 100,
    bottom: 8,
    elevation: 4
  }
});

export default SkippedClassroomSnackbar;