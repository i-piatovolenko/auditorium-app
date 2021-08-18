import { gql } from "@apollo/client";

export const GET_USERS_SKIPS = gql`
  query getUserSkips($where: UserWhereUniqueInput!) {
    user(where: $where) {
      id
      queueInfo {
        currentSession {
          skips
        }
      }
    }
  }
`;