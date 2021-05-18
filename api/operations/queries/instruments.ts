import { gql } from "@apollo/client";

export const GET_INSTRUMENTS = gql`
    query getInstruments($where: InstrumentWhereInput!) {
        instruments(where: $where) {
            id
            persNumber
            type
            name
            rate
            classroom {
              id
              name
            }
        }
    }
`;