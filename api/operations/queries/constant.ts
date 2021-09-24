import {gql} from "@apollo/client";

export const MAX_DISTANCE = gql`
  query Constant {
  constant(where: { name: MAX_GEOLOCATION_DISTANCE_KM }) {
    value
  }
}
`;