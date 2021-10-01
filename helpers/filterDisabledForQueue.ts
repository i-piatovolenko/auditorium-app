import {ClassroomType, DisabledState, OccupiedState, User} from "../models/models";
import {isEnabledForCurrentDepartment} from "./helpers";

export const filterDisabledForQueue = (classroom: ClassroomType, currentUser: User) => {
  return (
    (classroom.occupied.state !== OccupiedState.FREE ||
    classroom.disabled.state === DisabledState.DISABLED) &&
    !classroom.isHidden &&
    isEnabledForCurrentDepartment(classroom, currentUser)
  );
};