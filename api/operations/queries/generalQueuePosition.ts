import {gql} from "@apollo/client";

export const GENERAL_QUEUE_POSITION = gql`
  query generalQueuePosition($userId: Int!){
    generalQueuePosition(userId: $userId)
  }
`;