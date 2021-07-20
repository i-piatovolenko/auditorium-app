import {gql} from "@apollo/client";

export const ADD_USERS_TO_QUEUE = gql`
    mutation addUsersToQueue($input: [AddUserToQueueInputType!]!) {
        addUsersToQueue(input: $input) {
          count
        }
    }
`;