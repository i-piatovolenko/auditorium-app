import {gql} from "@apollo/client";

export const UPDATE_INSTRUMENT = gql`
    mutation updateOneInstrument($data: InstrumentUpdateInput!, $where: InstrumentWhereUniqueInput!) {
        updateOneInstrument(data: $data, where: $where) {
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