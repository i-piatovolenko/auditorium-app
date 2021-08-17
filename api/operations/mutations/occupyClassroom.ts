import { gql } from "@apollo/client";

export const OCCUPY_CLASSROOM = gql`
    mutation occupyClassroom($input: OccupyClassroomInput!) {
        occupyClassroom(input: $input) {
            classroom {
                id
                occupied {
                    user {
                        id
                        firstName
                        patronymic
                        lastName
                        type
                        department {
                            name
                        }
                    }
                    until
                    state
                }
            }
            prevClassroom {
               id
                occupied {
                    user {
                        id
                        firstName
                        patronymic
                        lastName
                        type
                        department {
                            name
                        }
                    }
                    until
                    state
                }
            }
            userErrors {
                message
                code
            }
        }
    }
`;