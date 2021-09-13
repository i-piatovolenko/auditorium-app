import { gql } from "@apollo/client";

export const SIGN_UP = gql`
    mutation signup($input: SignupInput!) {
        signup(input: $input) {
            email
            userErrors {
                message
                code
            }
        }
    }
`;