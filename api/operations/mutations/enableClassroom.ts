import {gql} from "@apollo/client";

export const ENABLE_CLASSROOM = gql`
    mutation enable($input: EnableClassroomInput!) {
        enableClassroom(input: $input) {
            classroom {
                id
                disabled {
                    comment
                    until
                    state
                }
            }
            userErrors {
                message
                code
            }
        }
    }
`;