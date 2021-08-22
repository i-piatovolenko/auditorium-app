import {gql} from "@apollo/client/core";

export const FOLLOW_GENERAL_QUEUE_POSITION = gql`
  subscription generalQueuePosition($userId: Int!) {
    generalQueuePosition(userId: $userId)
  }
`;