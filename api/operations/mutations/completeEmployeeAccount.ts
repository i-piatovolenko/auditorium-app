import {gql} from "@apollo/client";

export const COMPLETE_EMPLOYEE_ACCOUNT = gql`
    mutation completeEmployeeAccount($input: CompleteEmployeeAccountInput!) {
        completeEmployeeAccount(input: $input) {
            userErrors {
                message
                code
            }
        }
    }
`;
