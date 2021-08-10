import {ClassroomType} from "../models/models";

export const filterDisabledForQueue = (classroom: ClassroomType) => {
  return !!classroom.occupied && !classroom.disabled && !classroom.isHidden;
};