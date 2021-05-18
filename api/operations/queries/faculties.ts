import { gql } from "@apollo/client";

export const GET_FACULTIES = gql`
    query getFaculties($where: FacultyWhereInput!) {
        faculties(where: $where) {
            id
            name
        }
    }
`;