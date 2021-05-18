import {gql} from "@apollo/client";

export const CREATE_INSTRUMENT = gql`
    mutation createOneInstrument($data: InstrumentCreateInput!) {
        createOneInstrument(data: $data) {
            id
            name
            rate
            type
            persNumber
            classroom {
              name
            }
        }
    }
`;