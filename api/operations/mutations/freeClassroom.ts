import {gql} from "@apollo/client";

export const FREE_CLASSROOM = gql`
    mutation free($input: FreeClassroomInput!) {
        freeClassroom(input: $input) {
            classroom {
                id
                name
                occupied {
                    user {
                        id
                        firstName
                        lastName
                        patronymic
                        type
                    }
                    until
                }
            }
                userErrors {
                    message
                    code
                }
            }
        }
`;
