import React, {FC, useState} from 'react';
import {Button} from "react-native-paper";
import {Text, View, StyleSheet} from "react-native";
import {fullName} from "../helpers/helpers";
import {ScheduleUnitType} from "../models/models";
import ScheduleInfo from "./ScheduleInfo";

type PropTypes = {
  unit: ScheduleUnitType;
}

const ScheduleInfoButton: FC<PropTypes> = ({unit}) => {
  const [visible, setVisible] = useState(false);

  const handlePress = () => setVisible(true);

  const hideModal = () => setVisible(false);

  return (
    <View>
      <Button mode='outlined' style={styles.scheduleButton} onPress={handlePress}>
        <Text>{fullName(unit.user, true)} {unit.from}-{unit.to}</Text>
      </Button>
      <ScheduleInfo hideModal={hideModal} visible={visible} unit={unit}/>
    </View>
  );
};

const styles = StyleSheet.create({
  scheduleButton: {
    marginVertical: 2,
  },
})

export default ScheduleInfoButton;
