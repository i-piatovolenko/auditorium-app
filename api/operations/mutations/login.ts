import { gql } from "@apollo/client";

export const LOGIN = gql`
    mutation login($input: LoginInput!) {
        login(input: $input) {
            token
            user {
                id
                firstName
                patronymic
                lastName
                type
                phoneNumber
                extraPhoneNumbers
                email
                department {
                  id
                  name  
                }
                occupiedClassroom: classroom {
                  id
                  name
                  occupied {
                    state
                  }
                }
                studentInfo {
                  degree {
                    name
                  }
                  startYear
                  accountStatus
                }
                employeeInfo {
                  employmentType
                  accountStatus
                }
                queue {
                  id
                  classroom {
                    id
                    name
                  }
                  state
                  type
                }
            }
               
            userErrors {
                message
                code
            }
        }
    }
`;