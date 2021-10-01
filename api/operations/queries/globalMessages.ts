import { gql } from "@apollo/client";

export const GET_GLOBAL_MESSAGES = gql`
    query globalMessages {
        globalMessages {
            id
            title
            body
            type
        }
    }
`;