import {gql} from "@apollo/client";

export const PASSWORD_RESET = gql`
    mutation resetPassword($input: ResetPasswordInput!) {
        resetPassword(input: $input) {
            operationSuccess
            userErrors {
                message
                code
            }
        }
    }
`;
