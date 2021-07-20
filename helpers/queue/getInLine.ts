import {client, modeVar} from "../../api/client";
import {Mode, QueueState, QueueType, User} from "../../models/models";
import {ADD_USERS_TO_QUEUE} from "../../api/operations/mutations/addUsersToQueue";
import {getItem} from "../../api/asyncStorage";

const getInLine = async (minimalClassroomsIds: number[], desirableClassroomIds: number[]) => {
  const user: User | undefined = await getItem('user');

  const minimalData = minimalClassroomsIds.map(id => ({
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

  await client.mutate({mutation: ADD_USERS_TO_QUEUE, variables: {
      input: [...minimalData, ...desirableData]
    }})
  modeVar(Mode.INLINE);
};

export  default getInLine;