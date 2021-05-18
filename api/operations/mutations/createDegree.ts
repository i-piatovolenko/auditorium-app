import {gql} from "@apollo/client";

export const CREATE_DEGREE = gql`
    mutation createOneDegree($data: DegreeCreateInput!) {
        createOneDegree(data: $data) {
            id
            name
        }
    }
`;