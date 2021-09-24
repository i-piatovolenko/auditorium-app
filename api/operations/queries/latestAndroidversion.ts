import {gql} from "@apollo/client";

export const LATEST_ANDROID_VERSION = gql`
  query Constant {
  constant(where: { name: LATEST_ANDROID_VERSION }) {
    value
  }
}
`;