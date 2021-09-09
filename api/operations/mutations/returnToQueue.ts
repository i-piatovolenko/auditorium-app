import {gql} from "@apollo/client";

export const MAKE_DECISION_ON_QUEUE_RESERVED = gql`
    mutation makeDecisionOnQueueReserved($input: MakeDecisionOnQueueReservedInput!) {
        makeDecisionOnQueueReserved(input: $input) {
           user {
            id
            firstName
            lastName
            queue {
            id
            state
            type
            classroom {
                id
              }
            }
            queueInfo {
              currentSession {
                  state
                  remainingOccupationTime
                }
              }
            }
            userErrors {
                message
                code
              }
        }
    }
`;