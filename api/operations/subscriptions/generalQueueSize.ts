import {gql} from "@apollo/client/core";

export const FOLLOW_GENERAL_QUEUE_SIZE = gql`
  subscription generalQueueSize {
    generalQueueSize
  }
`;