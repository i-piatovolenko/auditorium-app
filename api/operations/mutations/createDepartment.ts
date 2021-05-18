import {gql} from "@apollo/client";

export const CREATE_DEPARTMENT = gql`
    mutation createOneDepartment($data: DepartmentCreateInput!) {
        createOneDepartment(data: $data) {
            id
            name
        }
    }
`;