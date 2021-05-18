import {gql} from "@apollo/client";

export const DELETE_DEGREE = gql`
    mutation deleteOneDegree($where: DegreeWhereUniqueInput!) {
        deleteOneDegree(where: $where) {
            name
        }
    }
`;