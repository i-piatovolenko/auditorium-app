import {desirableClassroomIdsVar, minimalClassroomIdsVar} from "../api/client";
import {ClassroomType, SavedFilterT} from "../models/models";
import {filterDisabledForQueue} from "./filterDisabledForQueue";

export const filterSavedFilter = (savedFilter: SavedFilterT, classrooms: ClassroomType[]) => {
  const enabledClassrooms = (classroom: ClassroomType, isMinimal: boolean) => {
    return savedFilter[isMinimal ? 'minimalClassroomIds': 'desirableClassroomIds'].includes(classroom.id)
      && filterDisabledForQueue(classroom)
  };

  const minimalIds = classrooms
    .filter((classroom) => enabledClassrooms(classroom, true))
    .map(({id}) => id);

  const desireIds = classrooms
    .filter((classroom) => enabledClassrooms(classroom, false))
    .map(({id}) => id);

  minimalClassroomIdsVar(minimalIds);
  desirableClassroomIdsVar(desireIds);
};