import {gql} from "@apollo/client";

export const CONFIRM_EMAIL = gql`
    mutation confirmEmail($input: ConfirmEmailInput!) {
        confirmEmail(input: $input) {
            user {
                id
            }
            userErrors {
                message
                code
            }
        }
    }
`;
