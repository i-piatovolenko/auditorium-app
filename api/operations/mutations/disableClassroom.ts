import {gql} from "@apollo/client";

export const DISABLE_CLASSROOM = gql`
    mutation disable($input: DisableClassroomInput!) {
        disableClassroom(input: $input) {
            classroom {
                disabled {
                    comment
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
