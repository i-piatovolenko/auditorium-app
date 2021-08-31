import {gql} from "@apollo/client/core";

export const FOLLOW_USER = gql`
 subscription userUpdate($userId: Int!) {
    userUpdate(userId: $userId) {
    user {
      id
      occupiedClassrooms {
        id
        state
        classroom {
          id
          name
        }
      }
      queue {
        id
        state
        type
        classroom {
          id
        }
      }
      queueInfo {
        id
        sanctionedUntil
        currentSession {
          id
          state
          skips
          remainingOccupationTime
        }
      }
    }
  }
}
`;