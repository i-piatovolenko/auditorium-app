import { gql } from "@apollo/client";

export const GET_SCHEDULE_UNIT = gql`
  query getScheduleUnit($classroomName: String!, $date: Date!) {
    schedule(classroomName: $classroomName, date: $date) {
      id
      user {
        id
        lastName
        firstName
        patronymic
      }
      from
      to
      activity
    }
  }
`;
