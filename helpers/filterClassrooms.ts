import {ClassroomsFilterTypes, ClassroomType} from "../models/models";

export const filterClassrooms = (
  classrooms: Array<ClassroomType>,
  type: ClassroomsFilterTypes = ClassroomsFilterTypes.ALL,
  isOperaStudioOnly: boolean = false,
  noWing: boolean = false
  ): Array<ClassroomType> => {

  const filterTypeOnly = (classroom: ClassroomType) => {
    switch (type) {
      case ClassroomsFilterTypes.ALL:
        return true;
      case ClassroomsFilterTypes.FREE:
        return !classroom.occupied;
      case ClassroomsFilterTypes.SPECIAL:
        return !!classroom.special;
    }
  };

  const wingOnlyFilter = (classroom: ClassroomType) => {
    if (noWing) return !classroom.isWing;
    return true;
  };

  const studioOnlyFilter = (classroom: ClassroomType) => {
    if (isOperaStudioOnly) return classroom.isOperaStudio;
    return true;
  };

  return classrooms?.filter(classroom => filterTypeOnly(classroom))
    .filter(classroom => wingOnlyFilter(classroom))
    .filter(classroom => studioOnlyFilter(classroom));
};