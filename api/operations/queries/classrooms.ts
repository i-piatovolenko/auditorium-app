import { gql } from "@apollo/client";

export const GET_CLASSROOMS = gql`
  query getClassrooms($date: Date!) {
    classrooms {
      id
      description
      name
      floor
      special
      chair {
          name
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
        until
      }
      schedule(date: $date) {
        from
        to
      }
      instruments {
        name
        type
        rate
      }
      disabled {
        comment
        until
      }
    }
  }
`;