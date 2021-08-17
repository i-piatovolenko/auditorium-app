import {gql} from "@apollo/client/core";

export const FOLLOW_CLASSROOMS = gql`
  subscription {
  classroomUpdate {
  classroom {
        id
        occupied {
          user {
            id
            firstName
            lastName
            patronymic
            type
          }
          until
          state
        }
        disabled {
        comment
        state
        until
      }
      }
    }
  }
`;