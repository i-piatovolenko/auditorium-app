import {modeVar} from "../../api/client";
import {Mode} from "../../models/models";

const getInLine = (minimalClassroomsIds: number[], desirableClassroomIds: number[]) => {
  modeVar(Mode.INLINE);
};

export  default getInLine;