import {gql} from "@apollo/client";

export const UPDATE_DEPARTMENT = gql`
    mutation updateOneDepartment($data: DepartmentUpdateInput!, $where: DepartmentWhereUniqueInput!) {
        updateOneDepartment(data: $data, where: $where) {
            id
            name
        }
    }
`;