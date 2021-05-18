import {gql} from "@apollo/client";

export const DELETE_CLASSROOM = gql`
    mutation deleteOneClassroom($where: ClassroomWhereUniqueInput!) {
        deleteOneClassroom(where: $where) {
            name
        }
    }
`;