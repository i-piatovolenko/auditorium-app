import {gql} from "@apollo/client";

export const GET_ME_TYPE = gql`
    query meType {
        meType @client
    }
`;