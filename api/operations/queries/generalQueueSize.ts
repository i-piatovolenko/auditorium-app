import { gql } from "@apollo/client";

export const GENERAL_QUEUE_SIZE = gql`
    query {
      generalQueueSIze
    }
`;