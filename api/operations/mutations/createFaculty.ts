import {gql} from "@apollo/client";

export const CREATE_FACULTY = gql`
    mutation createOneFaculty($data: FacultyCreateInput!) {
        createOneFaculty(data: $data) {
            id
            name
        }
    }
`;