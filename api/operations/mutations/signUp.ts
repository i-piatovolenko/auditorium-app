import { gql } from "@apollo/client";

export const SIGN_UP = gql`
    mutation signup($input: SignupInput!) {
        signup(input: $input) {
            user {
                id
                lastName
            }
            userErrors {
                message
                code
            }
        }
    }
`;