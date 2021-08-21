import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query getUsers {
    users {
      id
      firstName
      patronymic
      lastName
      type
      department {
        name
      }
      email
      phoneNumber
      extraPhoneNumbers
      nameTemp
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
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query getUserById($where: UserWhereUniqueInput!) {
    user(where: $where) {
      id
      firstName
      patronymic
      lastName
      type
      department {
        id
        name
      }
      occupiedClassrooms {
        id
        state 
        classroom {
          id
          name
        }
      }
      queue {
        id
        state
        classroom {
          id
        }
      }
      queueInfo {
        id
        sanctionedUntil
        currentSession {
          id
          state
          skips
          generalQueuePosition
        }
      }
      email
      phoneNumber
      extraPhoneNumbers
      nameTemp
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
    }
  }
`;