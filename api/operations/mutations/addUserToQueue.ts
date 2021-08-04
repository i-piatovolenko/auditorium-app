import {gql} from "@apollo/client";

export const ADD_USER_TO_QUEUE = gql`
    mutation addUserToQueue($input: [AddUserToQueueInputType!]!) {
        addUserToQueue(input: $input) {
          count
        }
    }
`;