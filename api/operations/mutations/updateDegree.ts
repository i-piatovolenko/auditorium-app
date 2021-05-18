import {gql} from "@apollo/client";

export const UPDATE_DEGREE = gql`
    mutation updateOneDegree($data: DegreeUpdateInput!, $where: DegreeWhereUniqueInput!) {
        updateOneDegree(data: $data, where: $where) {
            id
            name
        }
    }
`;