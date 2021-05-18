import {gql} from "@apollo/client";

export const DELETE_INSTRUMENT = gql`
    mutation deleteOneInstrument($where: InstrumentWhereUniqueInput!) {
        deleteOneInstrument(where: $where) {
            name
        }
    }
`;