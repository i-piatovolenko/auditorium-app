import {User} from "../../models/models";
import {getItem} from "../../api/asyncStorage";
import {client} from "../../api/client";
import {REMOVE_USERS_FROM_QUEUE} from "../../api/operations/mutations/removeUsersFromQueue";

export default async function removeFromLine() {
  const user: User | undefined = await getItem('user');

  await client.mutate({
    mutation: REMOVE_USERS_FROM_QUEUE,
    variables: {
      where: {
        userId: {
          equals: (user as unknown as User).id
        }
      }
    }
  })
};