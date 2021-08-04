import {desirableClassroomIdsVar, minimalClassroomIdsVar} from "../../api/client";

const addToFilteredList = (classroomId: number, isMinimalSetup: boolean,
                           minimalClassroomIds: any, desirableClassroomIds: any) => {

  if (isMinimalSetup) {
    const elementIndex = minimalClassroomIds.findIndex((id: number) => id === classroomId);

    if (elementIndex === -1) {
      minimalClassroomIdsVar([...minimalClassroomIds, classroomId]);
    } else {
      const filteredArray = minimalClassroomIds.slice();

      filteredArray.splice(elementIndex, 1);
      minimalClassroomIdsVar(filteredArray);
    }
  } else {
    const elementIndex = desirableClassroomIds.findIndex((id: number) => id === classroomId);

    if (elementIndex === -1) {
      desirableClassroomIdsVar([...desirableClassroomIds, classroomId]);
    } else {
      const filteredArray = desirableClassroomIds.slice();

      filteredArray.splice(elementIndex, 1);
      desirableClassroomIdsVar(filteredArray);
    }
  }
};

export default addToFilteredList;

