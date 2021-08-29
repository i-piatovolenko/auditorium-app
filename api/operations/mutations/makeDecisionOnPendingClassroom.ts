import {gql} from "@apollo/client";

export const MAKE_DECISION_ON_PENDING_CLASSROOM = gql`
    mutation makeDecisionOnPendingClassroom($input: MakeDecisionOnPendingClassroomInput!) {
        makeDecisionOnPendingClassroom(input: $input) {
          classroom {
            id
            name
            special
            isHidden
            chair {
                id
                name
                exclusivelyQueueAllowedDepartmentsInfo {
                  department {
                    id
                    name
                  }
                }
            }
            isWing
            isOperaStudio
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
            instruments {
              id
              name
              type
              rate
            }
            disabled {
              id
              comment
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