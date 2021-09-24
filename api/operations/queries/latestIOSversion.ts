import {gql} from "@apollo/client";

export const LATEST_IOS_VERSION = gql`
  query Constant {
  constant(where: { name: LATEST_IOS_VERSION }) {
    value
  }
}
`;