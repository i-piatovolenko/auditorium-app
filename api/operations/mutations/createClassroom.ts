import {gql} from "@apollo/client";

export const CREATE_CLASSROOM = gql`
    mutation createOneClassroom($data: ClassroomCreateInput!) {
        createOneClassroom(data: $data) {
            name
        }
    }
`;