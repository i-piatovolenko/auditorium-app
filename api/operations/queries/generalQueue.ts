import {gql} from "@apollo/client";

export const GET_GENERAL_QUEUE = gql`
  query generalQueue {
    generalQueue {
        id
      }
  }`;