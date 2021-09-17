import {gql} from "@apollo/client";

export const EMAIL_FOR_PASSWORD_RESET = gql`
    mutation resetPasswordRequestEmail($input: ResetPasswordRequestEmailInput!) {
        resetPasswordRequestEmail(input: $input) {
            operationSuccess
            userErrors {
                message
                code
            }
        }
    }
`;
