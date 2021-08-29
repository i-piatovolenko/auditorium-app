import {gql} from "@apollo/client";

export const RESERVE_FREE_CLASSROOM = gql`
    mutation reserveFreeClassroom($input: ReserveFreeClassroomInput!) {
        reserveFreeClassroom(input: $input) {
          classroom {
            id
            occupied {
              user {
                id
                firstName
                patronymic
                lastName
                type
                nameTemp
              }
              until
              state
            }
          }
          userErrors {
            message
            code
          }
        }
    }
`;