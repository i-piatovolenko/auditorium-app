import { gql } from "@apollo/client";

export const GET_UNSIGNED_DEGREES = gql`
    query getUnsignedDegrees {
        signupDegrees {
            id
            name
        }
    }
`;