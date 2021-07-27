import {gql} from "@apollo/client";

export const REMOVE_USERS_FROM_QUEUE = gql`
    mutation removeUsersFromQueue($where: QueueRecordWhereInput) {
        removeUsersFromQueue(where: $where) {
          count
        }
    }
`;