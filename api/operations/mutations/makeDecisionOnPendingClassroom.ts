import {gql} from "@apollo/client";

export const MAKE_DECISION_ON_PENDING_CLASSROOM = gql`
    mutation makeDecisionOnPendingClassroom($input: MakeDecisionOnPendingClassroomInput!) {
        makeDecisionOnPendingClassroom(input: $input) {
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