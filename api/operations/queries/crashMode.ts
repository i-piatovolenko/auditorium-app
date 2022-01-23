import {gql} from "@apollo/client";

export const CRASH_MODE = gql`
  query crashMode {
    crashMode {
      isActive
      until
      comment
    }
  }`;
