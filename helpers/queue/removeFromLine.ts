import {Mode, User} from "../../models/models";
import {getItem} from "../../api/asyncStorage";
import {client, desirableClassroomIdsVar, isMinimalSetupVar, minimalClassroomIdsVar, modeVar} from "../../api/client";
import {REMOVE_USER_FROM_QUEUE} from "../../api/operations/mutations/removeUserFromQueue";

export default async function removeFromLine() {
  const user: User | undefined = await getItem('user');

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
  } catch (e) {
    alert(JSON.stringify(e))
  }
};