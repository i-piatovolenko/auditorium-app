import {gql} from "@apollo/client/core";

export const FOLLOW_CRASH_MODE = gql`
 subscription crashModeUpdate {
    crashModeUpdate {
      isActive
      until
      comment
    }
}
`;