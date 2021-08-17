import {ClassroomType, DisabledState, OccupiedState} from "../models/models";

export const filterDisabledForQueue = (classroom: ClassroomType) => {
  return (
    classroom.occupied.state === OccupiedState.FREE &&
    classroom.disabled.state === DisabledState.DISABLED &&
    !classroom.isHidden
  );
};