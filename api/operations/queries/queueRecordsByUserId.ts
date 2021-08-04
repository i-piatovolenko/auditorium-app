import {gql} from "@apollo/client";

export const GET_QUEUE_RECORDS = gql`
  query queueRecords {
    queueRecords {
      id
      user {
        firstName
        lastName
        patronymic
      }
      classroom {
        id
        name
      }
      date
      state
      type
      id
    }
  }`;