import {gql} from "@apollo/client";

export const UPDATE_FACULTY = gql`
    mutation updateOneFaculty($data: FacultyUpdateInput!, $where: FacultyWhereUniqueInput!) {
        updateOneFaculty(data: $data, where: $where) {
            id
            name
        }
    }
`;