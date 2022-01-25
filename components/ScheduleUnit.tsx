import React, {FC} from 'react';
import {StyleSheet, TouchableOpacity} from "react-native";
import {Surface} from "react-native-paper";
import {ScheduleUnitType, ScheduleUnitTypeT} from "../models/models";
import {fullName, getMinutesFromHHMM} from "../helpers/helpers";
import {WORKING_DAY_END, WORKING_DAY_START} from "../helpers/constants";
import Colors from "../constants/Colors";
import TextTicker from "react-native-text-ticker";

type PropTypes = {
  unit: ScheduleUnitType;
  setChosenUnit: (unit: ScheduleUnitType) => void;
}

const ScheduleUnit: FC<PropTypes> = ({unit, setChosenUnit}) => {
  const handlePress = () => {
    setChosenUnit(unit);
  };

  const getUnitSize = (unit: ScheduleUnitType) => {
    const workingDayLengthMinutes = (WORKING_DAY_END * 60) - (WORKING_DAY_START * 60);
    const unitLengthMinutes = getMinutesFromHHMM(unit.to) - getMinutesFromHHMM(unit.from);
    const stepSize = workingDayLengthMinutes / 90;

    return unitLengthMinutes / stepSize;
  };

  const getUnitLeftPos = (unit: ScheduleUnitType) => {
    const workingDayLengthMinutes = (WORKING_DAY_END * 60) - (WORKING_DAY_START * 60);
    const stepSize = workingDayLengthMinutes / 90;
    const startDay = WORKING_DAY_START * 60;
    const startUnit = getMinutesFromHHMM(unit.from);
    const pos = startUnit - startDay

    return pos / stepSize;
  }

  const cssStyles = {
    width: `${getUnitSize(unit)}%`,
    left: `${10 + getUnitLeftPos(unit)}%`,
    zIndex: unit.type === ScheduleUnitTypeT.PRIMARY ? 1 : 2,
  };

  const cssContainerStyles = {
    backgroundColor: unit.type === ScheduleUnitTypeT.PRIMARY ? Colors.blue : Colors.blue,
  }

  const name = fullName(unit.user, true);

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.wrapper, cssStyles]}
    >
      <Surface style={[styles.container, cssContainerStyles]}>
          <TextTicker
            animationType='auto'
            duration={name.length * 500}
            loop
            repeatSpacer={10}
            marqueeDelay={0}
            style={styles.text}
          >
            {name}
          </TextTicker>
      </Surface>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
  },
  container: {
    elevation: 8,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#fff',
  },
  text: {
    color: '#fff',
  },
})

export default ScheduleUnit;
