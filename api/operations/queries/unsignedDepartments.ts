import { gql } from "@apollo/client";

export const GET_UNSIGNED_DEPARTMENTS = gql`
    query getUnsignedDepartments {
        signupFacultiesDepartments {
            id
            name
            departments {
              id
              name
            }
        }
    }
`;