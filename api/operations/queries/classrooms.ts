import { gql } from "@apollo/client";

export const GET_CLASSROOMS = gql`
  query getClassrooms($date: Date!, $where: ClassroomWhereInput) {
    classrooms(where: $where) {
      id
      description
      name
      floor
      special
      isHidden
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
        state
      }
      schedule(date: $date) {
        from
        to
        activity
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
    }
  }
`;