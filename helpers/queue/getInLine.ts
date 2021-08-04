import {client, meVar, minimalClassroomIdsVar, modeVar} from "../../api/client";
import {Mode, QueueState, QueueType, User} from "../../models/models";
import {ADD_USER_TO_QUEUE} from "../../api/operations/mutations/addUserToQueue";

const getInLine = async (minimalClassroomsIds: number[], desirableClassroomIds: number[]) => {
  const user: User | null = meVar();

  const allClassroomIds = [...(new Set([...minimalClassroomsIds, ...desirableClassroomIds]))];

  const minimalData = allClassroomIds.map(id => ({
    userId: (user as unknown as User).id,
    classroomId: id,
    state: QueueState.ACTIVE,
    type: QueueType.MINIMAL
  }));

  const desirableData = desirableClassroomIds.map(id => ({
    userId: (user as unknown as User).id,
    classroomId: id,
    state: QueueState.ACTIVE,
    type: QueueType.DESIRED
  }));

  try {
    await client.mutate({
      mutation: ADD_USER_TO_QUEUE, variables: {
        input: [...minimalData, ...desirableData]
      }
    })
    modeVar(Mode.INLINE);
    minimalClassroomIdsVar(allClassroomIds);
  } catch (e) {
    alert(JSON.stringify(e));
  }
};

export  default getInLine;