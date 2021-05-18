import { gql } from "@apollo/client";

export const GET_DEPARTMENTS = gql`
    query getDepartments($where: DepartmentWhereInput!) {
        departments(where: $where) {
            id
            name
            faculty {
              id
              name
            }
        }
    }
`;