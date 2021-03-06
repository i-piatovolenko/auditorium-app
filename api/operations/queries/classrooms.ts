import { gql } from "@apollo/client";

export const GET_CLASSROOMS = gql`
  query getClassrooms($where: ClassroomWhereInput) {
    classrooms(where: $where) {
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

export const GET_CLASSROOMS_NO_SCHEDULE = gql`
  query getClassroomsNoSchedule {
    classrooms {
      id
      name
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
        }
        until
        state
      }
      instruments {
        id
        name
        type
        rate
      }
      disabled {
        id
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

export const GET_CLASSROOMS_WITH_SCHEDULE = gql`
  query getClassrooms($date: DateTime!) {
    classrooms {
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
      schedule(date: $date) {
        id
        from
        to
        user {
        id
          lastName
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
