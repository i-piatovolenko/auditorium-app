import {QueueSession, QueueType, User, UserQueueState} from "../../models/models";
import {getItem} from "../../api/asyncStorage";
import {REMOVE_USER_FROM_QUEUE} from "../../api/operations/mutations/removeUserFromQueue";
import {client} from "../../api/client";
import {
  desirableClassroomIdsVar,
  globalErrorVar,
  isMinimalSetupVar,
  minimalClassroomIdsVar
} from "../../api/localClient";

export default async function removeFromLine(classroomId?: number, currentSession?: QueueSession) {
  const user: User | undefined = await getItem('user');
  if (classroomId) {
    try {
      await client.mutate({
        mutation: REMOVE_USER_FROM_QUEUE,
        variables: {
          input: {
            userId: user.id,
            deleteWhere: {
              classroomId: {
                equals: classroomId
              },
              type: {
                equals: currentSession.state === UserQueueState.IN_QUEUE_MINIMAL
                  ? QueueType.MINIMAL : QueueType.DESIRED
              }
            }
          }
        }
      });
      minimalClassroomIdsVar([]);
      desirableClassroomIdsVar([]);
      isMinimalSetupVar(true);
    } catch (e: any) {
      globalErrorVar(e.message);
    }
  } else {
    try {
      await client.mutate({
        mutation: REMOVE_USER_FROM_QUEUE,
        variables: {
          input: {
            userId: user.id
          }
        }
      });
      minimalClassroomIdsVar([]);
      desirableClassroomIdsVar([]);
      isMinimalSetupVar(true);
    } catch (e: any) {
      globalErrorVar(e.message);
    }
  }
};
