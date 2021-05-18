import {gql} from "@apollo/client";

export const DELETE_DEPARTMENT = gql`
    mutation deleteOneDepartment($where: DepartmentWhereUniqueInput!) {
        deleteOneDepartment(where: $where) {
            name
        }
    }
`;