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
      queueInfo {
        id
        sanctionedUntil
        currentSession {
          id
          state
          skips
          generalQueuePosition
        }
      }
    }
  }
}
`;