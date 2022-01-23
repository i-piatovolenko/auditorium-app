import {gql} from '@apollo/client';

export const GET_SCHEDULE_UNITS = gql`
  query getScheduleUnits($where: ScheduleUnitWhereInput) {
    scheduleUnits(where: $where) {
      id
      primaryScheduleUnit {
        id
      }
      user {
        id
        firstName
        lastName
        patronymic
        type
      }
      classroom {
        id
        name
      }
      type
      dateStart
      dateEnd
      from
      to
      activity
      dayOfWeek
    }
  }
`;
