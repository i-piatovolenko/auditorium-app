import {gql} from "@apollo/client";

export const PERMITTED_ACTION_HOURS = gql`
  query permittedActionHours {
    permittedActionHours {
      type
      startUTCHours
      startUTCMinutes
      endUTCHours
      endUTCMinutes
    }
  }
`;