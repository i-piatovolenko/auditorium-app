import {gql} from "@apollo/client";

export const REMOVE_USER_FROM_QUEUE = gql`
    mutation removeUserFromQueue($where: QueueRecordWhereInput) {
        removeUserFromQueue(where: $where) {
          count
        }
    }
`;