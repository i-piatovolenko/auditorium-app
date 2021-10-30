import {gql} from "@apollo/client";

export const PASSWORD_UPDATE = gql`
    mutation updatePassword($input: UpdatePasswordInput!) {
        updatePassword(input: $input) {
            operationSuccess
            userErrors {
                message
                code
            }
        }
    }
`;
