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
                occupiedClassrooms {
                state
                until
                classroom {
                 id
                 name
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