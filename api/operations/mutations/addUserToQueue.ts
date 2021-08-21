import {gql} from "@apollo/client";

export const ADD_USER_TO_QUEUE = gql`
    mutation addUserToQueue($input: AddUserToQueueInputType!) {
        addUserToQueue(input: $input) {
          user {
            id
            firstName
            lastName
            occupiedClassrooms {
              id
              state
              until
              classroom {
                id
              }
            }
            queueInfo {
              id
              currentSession {
                id
                state
                skips
              }
            }
          }
          userErrors {
              message
              code
            }
        }
    }
`;