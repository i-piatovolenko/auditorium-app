import {useLocal} from "../../hooks/useLocal";
import {minimalClassroomIdsVar} from "../../api/client";

const {data: {isMinimalSetup}} = useLocal('isMinimalSetup');
const {data: {desirableClassroomIds}} = useLocal('desirableClassroomIds');
const {data: {minimalClassroomIds}} = useLocal('minimalClassroomIds');

const addToFilteredList = (classroomId: number) => {
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
      desirableClassroomIds([...desirableClassroomIds, classroomId]);
    } else {
      const filteredArray = desirableClassroomIds.slice();

      filteredArray.splice(elementIndex, 1);
      desirableClassroomIds(filteredArray);
    }
  }
};

export default addToFilteredList;

