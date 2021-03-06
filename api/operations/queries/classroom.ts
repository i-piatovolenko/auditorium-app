import { gql } from "@apollo/client";

export const GET_CLASSROOM = gql`
  query getClassroom($where: ClassroomWhereUniqueInput!) {
    classroom(where: $where) {
      id
      description
      name
      floor
      special
      isHidden
      chair {
          id
          name
          exclusivelyQueueAllowedDepartmentsInfo {
            department {
              id
              name
            }
          }
      }
      isWing
      isOperaStudio
      occupied {
        user {
          id
          firstName
          patronymic
          lastName
          type
          nameTemp
          email
          phoneNumber
        }
         keyHolder {
         id
          firstName
          patronymic
          lastName
          type
          nameTemp
          email
          phoneNumber
          department {
              name
          }
        }
        until
        state
      }
      instruments {
        name
        type
        rate
      }
      disabled {
        comment
        until
        state
      }
      queueInfo {
        queuePolicy {
          policy
          queueAllowedDepartments {
            department {
              id
              name
            }
          }
        }
      }
    }
  }
`;
