import {gql} from "@apollo/client";

export const GET_LANG = gql`
    query langType {
        lang @client
    }
`;