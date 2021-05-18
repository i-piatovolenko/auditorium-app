import {gql} from "@apollo/client";

export const DELETE_FACULTY = gql`
    mutation deleteOneFaculty($where: FacultyWhereUniqueInput!) {
        deleteOneFaculty(where: $where) {
            name
        }
    }
`;