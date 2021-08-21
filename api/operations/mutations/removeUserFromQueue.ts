import {gql} from "@apollo/client";

export const REMOVE_USER_FROM_QUEUE = gql`
    mutation removeUserFromQueue($input: RemoveUserFromQueueInputType!) {
        removeUserFromQueue(input: $input) {
          user {
            id
          }
        }
    }
`;