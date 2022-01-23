import React, {FC} from 'react';
import {StyleSheet, Text, View} from "react-native";
import {ScheduleUnitType, ScheduleUnitTypeT} from "../models/models";
import moment from "moment";
import {getMinutesFromHHMM} from "../helpers/helpers";
import ScheduleInfoButton from "./ScheduleInfoButton";
import {Divider} from "react-native-paper";

type PropTypes = {
  units: ScheduleUnitType[];
}

const ClassroomScheduleInfo: FC<PropTypes> = ({units}) => {
  const sortByTime = (units: ScheduleUnitType[]) => {
    return units.slice().sort((a: ScheduleUnitType, b: ScheduleUnitType) => {
      return getMinutesFromHHMM(a.from) - getMinutesFromHHMM(b.from)
    })
  };

  const filterCurrent = (units: ScheduleUnitType[]) => {
    return sortByTime(units).filter(unit => {
      const currentDate = moment();
      const dateStart = moment(unit.dateStart);
      const dateEnd = moment(unit.dateEnd);
      return dateStart.isSameOrBefore(currentDate) && dateEnd.isSameOrAfter(currentDate)
    });
  };

  const filter = (units: ScheduleUnitType[], type: ScheduleUnitTypeT) => {
    return filterCurrent(units).filter(unit => unit.type === type);
  };

  const primary = filter(units, ScheduleUnitTypeT.PRIMARY);
  const substitutions = filter(units, ScheduleUnitTypeT.SUBSTITUTION);

  return !!primary?.length && (
    <View style={styles.container}>
      <Text style={styles.title}>Розклад</Text>
      {primary.map(unit => <ScheduleInfoButton unit={unit}/>)}
      {!!substitutions?.length && (
        <>
          <Text style={{textAlign: 'center'}}>Заміни</Text>
          {substitutions.map(unit => <ScheduleInfoButton unit={unit}/>)}
        </>
      )}
      <Divider style={styles.divider}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {

  },
  title: {
    marginBottom: 8,
    textAlign: 'center'
  },
  divider: {
    marginTop: 16,
    marginBottom: 16
  },
});

export default ClassroomScheduleInfo;
