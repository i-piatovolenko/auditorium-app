import {gql} from "@apollo/client";

export const GET_REGISTER = gql`
    query getRegister($where: RegisterWhereInput!) {
        register(where: $where) {
            id
            user {
                lastName
                firstName
                patronymic
                id
                type
                email
                phoneNumber
                nameTemp
            }
            classroom {
                name
            }
            nameTemp
            start
            end
        }
    }
`