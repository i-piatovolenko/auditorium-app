import { gql } from "@apollo/client";

export const GET_UNSIGNED_DEPARTMENTS = gql`
    query getUnsignedDepartments {
        signupDepartments {
            id
            name
        }
    }
`;