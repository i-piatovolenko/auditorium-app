import {gql} from "@apollo/client";

export const VERIFY_USER = gql`
    mutation verifyUser($input: VerifyUserInput !) {
        verifyUser(input: $input) {
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
