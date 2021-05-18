import { gql } from "@apollo/client";

export const LOGIN = gql`
    mutation login($input: LoginInput!) {
        login(input: $input) {
            token
            user {
                id
                firstName
                patronymic
                lastName
                type
                phoneNumber
                extraPhoneNumbers
                email
            }
            userErrors {
                message
                code
            }
        }
    }
`;