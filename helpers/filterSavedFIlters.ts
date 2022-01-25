import {ClassroomType, SavedFilterT, User} from "../models/models";
import {filterDisabledForQueue} from "./filterDisabledForQueue";
import {desirableClassroomIdsVar, minimalClassroomIdsVar} from "../api/localClient";

export const filterSavedFilter = (savedFilter: SavedFilterT, classrooms: ClassroomType[], currentUser: User) => {
  const enabledClassrooms = (classroom: ClassroomType, isMinimal: boolean) => {
    return savedFilter[isMinimal ? 'minimalClassroomIds': 'desirableClassroomIds'].includes(classroom.id)
      && filterDisabledForQueue(classroom, currentUser)
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
