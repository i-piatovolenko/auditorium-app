import {gql} from "@apollo/client";

export const GET_ME = gql`
    query meType {
        me @client
    }
`;