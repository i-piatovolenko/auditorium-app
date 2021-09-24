import {client, meVar, minimalClassroomIdsVar, modeVar} from "../../api/client";
import {EnqueuedBy, Mode, QueueState, QueueType, User} from "../../models/models";
import {ADD_USER_TO_QUEUE} from "../../api/operations/mutations/addUserToQueue";

const getInLine = async (minimalClassroomsIds: number[], desirableClassroomIds: number[]) => {
  const user: User | null = meVar();

  const allClassroomIds = [...(new Set([...minimalClassroomsIds, ...desirableClassroomIds]))];

  const minimalData = allClassroomIds.map(id => ({
    classroomId: id,
    type: QueueType.MINIMAL
  }));

  const desirableData = desirableClassroomIds.map(id => ({
    classroomId: id,
    type: QueueType.DESIRED
  }));

  try {
    await client.mutate({
      mutation: ADD_USER_TO_QUEUE, variables: {
        input: {
          userId: user.id,
          data: [...minimalData, ...desirableData],
          enqueuedBy: EnqueuedBy.SELF
        }
      }
    })
    modeVar(Mode.INLINE);
    minimalClassroomIdsVar(allClassroomIds);
  } catch (e: any) {
    alert(JSON.stringify(e));
  }
};

export  default getInLine;