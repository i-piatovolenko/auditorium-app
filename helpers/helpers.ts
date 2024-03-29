import {HOUR, MINUTE, TIME_SNIPPETS, WORKING_DAY_END, WORKING_DAY_START,} from "./constants";
import {
  ACCESS_RIGHTS,
  ClassroomType,
  CurrentUser,
  DisabledState,
  Mode,
  OccupiedInfo,
  OccupiedState,
  QueuePolicyTypes,
  ScheduleUnitType,
  User,
  UserTypes,
} from "../models/models";
import moment from "moment";
import {ReactElement} from "react";
import {accessRightsVar} from "../api/localClient";

export const getScheduleTimeline = (start: number, end: number): string[] => {
  let timeSnippets: string[] = [];
  for (let hour = start; hour <= end; hour++) {
    if (hour === end) {
      timeSnippets.push(hour + ":00");
    } else {
      TIME_SNIPPETS.forEach((minutes) => {
        timeSnippets.push(hour + minutes);
      });
    }
  }
  return timeSnippets;
};

const getScheduleTimeInMilliseconds = (scheduleUnitTime: any) => {
  return scheduleUnitTime
    .split(":")
    .map((el: any, index: number) => {
      return index === 0 ? Number(el) * HOUR : Number(el) * MINUTE;
    })
    .reduce((acc: any, curr: any) => acc + curr);
};

export const getPossiblyOccupied = (schedule: Array<any>) => {
  const current =
    new Date().getHours() * HOUR + new Date().getMinutes() * MINUTE;
  const timeSnippets = schedule.map((el: any) => {
    return {
      from: getScheduleTimeInMilliseconds(el.from),
      to: getScheduleTimeInMilliseconds(el.to),
    };
  });
  return timeSnippets
    .map((el: any) => {
      return current >= el.from && current <= el.to;
    })
    .some((el: any) => el === true);
};

export const getTimeHHMM = (date: Date) => {
  return date.getHours() + ":" + formatMinutesToMM(date.getMinutes());
};

export const getScheduleUnitRowLength = (
  schedule: Array<ScheduleUnitType>,
  units: string
) =>
  schedule
    .map((scheduleUnit: ScheduleUnitType) => {
      return parseInt(scheduleUnit.to) - parseInt(scheduleUnit.from) + units;
    })
    .join(" ");

export const formatMinutesToMM = (value: number) => {
  if (value <= 9) return `0${value}`;
  else return value;
};

export const fullName = (user: User, withInitials = false) => {
  if (user) {
    if (user.nameTemp) return user.nameTemp
    if (withInitials) {
      return `${user.lastName} ${user.firstName.charAt(0)}. ${
        user.patronymic ? user.patronymic.charAt(0) + "." : ""
      }`;
    } else {
      return `${user.lastName} ${user.firstName} ${
        user.patronymic ? user.patronymic : ""
      }`;
    }
  }
  return "";
};

export const typeStyle = (occupied: OccupiedInfo, isDisabled = false) => {
  const student = {backgroundColor: "#2e287c", color: "#fff"};
  const employee = {backgroundColor: "#ffc000", color: "#fff"};
  const vacant = {
    backgroundColor: "transparent",
    color: "#000",
  };
  const disabled = {
    backgroundColor: "#00000011",
    color: "#454545",
  };
  if (isDisabled) return disabled;
  if (isNotFree(occupied)) {
    switch (occupied.user.type) {
      case UserTypes.STUDENT:
        return student;
      case UserTypes.POST_GRADUATE:
        return student;
      default:
        return employee;
    }
  }
  return vacant;
};

//get int from time unit. ex: "9:15" -> 36 where each 15 min == 1; ex: "00:15" -> 1, "10:00" ->40
const simpleIntFromScheduleUnit = (time: string) => {
  const reducer = (accumulator: any, currentValue: any) =>
    accumulator + currentValue;
  return time
    .split(":")
    .map((el: string, index: number) => {
      if (index === 0) {
        return parseInt(el) * 4;
      } else {
        switch (parseInt(el)) {
          case 0:
            return 0;
          case 15:
            return 1;
          case 30:
            return 2;
          case 45:
            return 3;
        }
      }
    })
    .reduce(reducer);
};

//get schedule units size in fr units for grids
export const getScheduleUnitSize = (
  units: Array<ScheduleUnitType>,
  fillEmpty = true
) => {
  const items = [];
  if (fillEmpty) {
    items.push(parseInt(units[0].from) - WORKING_DAY_START);
  }
  for (let item of units) {
    const from = simpleIntFromScheduleUnit(item.from);
    const to = simpleIntFromScheduleUnit(item.to);
    items.push((to as number) - (from as number));
  }
  if (fillEmpty) {
    items.push(WORKING_DAY_END - parseInt(units[units.length - 1].to));
  }

  return items.map((item) => `${item}fr`).join(" ");
};

export const ISODateString = (d: Date) => {
  function pad(n: any) {
    return n < 10 ? "0" + n : n;
  }

  return (
    d.getUTCFullYear() +
    "-" +
    pad(d.getUTCMonth() + 1) +
    "-" +
    pad(d.getUTCDate())
  );
};

export const scheduleUnitToDate = (item: ScheduleUnitType) => {
  const from = item.from.split(':');
  const to = item.to.split(':');
  const fromHours = +from[0];
  const fromMinutes = +from[1];
  const toHours = +to[0];
  const toMinutes = +to[1];
  const fromDate = moment({hours: fromHours, minutes: fromMinutes, seconds: 0, milliseconds: 0});
  const toDate = moment({hours: toHours, minutes: toMinutes, seconds: 0, milliseconds: 0});

  return {
    from: fromDate,
    to: toDate
  };
};

export const isOccupiedOnSchedule = (scheduleUnits: ScheduleUnitType[]) => {
  const result: any = [];

  scheduleUnits.forEach(item => result.push(scheduleUnitToDate(item)));

  return result.some((item: { from: Date, to: Date }) => {
    const current = moment();

    return current.isAfter(item.from) && current.isBefore(item.to);
  });
};

export const showNotification = (dispatcher: any, data: string[] | HTMLElement[] | ReactElement[]) => {
  dispatcher({
    header: data[0],
    message: data[1],
    type: data[2],
  });
};

export const setAccessRights = (user: User) => {
  let accessRights = ACCESS_RIGHTS.USER;

  if (user && user?.type) {
    switch (user.type) {
      case UserTypes.ADMIN:
        accessRights = ACCESS_RIGHTS.ADMIN;
        break;
      case UserTypes.DISPATCHER:
        accessRights = ACCESS_RIGHTS.DISPATCHER;
        break;
      default:
        accessRights = ACCESS_RIGHTS.USER;
    }
  }

  accessRightsVar(accessRights);
};

export const isTeacherType = (type: UserTypes) => {
  return type === UserTypes.TEACHER || type === UserTypes.CONCERTMASTER || type === UserTypes.ILLUSTRATOR;
};

export const getTimeFromUntil = (until: string, minutesDuration = 2) => {
  if (until) {
    const differenceInMs = moment(until).diff(moment());
    const tempTime = moment.duration(differenceInMs);

    const resultHHMMSS = tempTime.hours() + ':' + tempTime.minutes() + ':' + tempTime.seconds();
    const resultPercents = differenceInMs / ((MINUTE * minutesDuration) / 100);

    return [resultHHMMSS, resultPercents];
  }
};

export const isPendingForMe = (occupied: OccupiedInfo, me: User, mode: Mode) => {
  return (
    (occupied.state === OccupiedState.PENDING || occupied.state === OccupiedState.RESERVED) &&
    occupied.user.id === me.id
    && mode === Mode.INLINE
  );
}

export const isOwnClassroom = (occupied: OccupiedInfo, me: User) => {
  return occupied.state === OccupiedState.OCCUPIED && occupied.user.id === me.id;
};

export const isOccupiedOrPendingByCurrentUser = (occupied: OccupiedInfo, currentUser: User) => {
  return (
    occupied.state === OccupiedState.OCCUPIED
    || occupied.state === OccupiedState.PENDING
    || occupied.state === OccupiedState.RESERVED
        ) && occupied.user.id === currentUser.id;
}

export const shouldOccupiedByTeacher = (classroomName: string, scheduleUnits: ScheduleUnitType[]) => {
  if (!scheduleUnits.length) return 'Вільно'
  const occupiedOnSchedule = scheduleUnits.some(scheduleUnit => {
    const [fromH, fromM] = scheduleUnit.from.split(':');
    const [toH, toM] = scheduleUnit.to.split(':');
    const fromDate = moment().set('hours', +fromH).set('minutes', +fromM);
    const toDate = moment().set('hours', +toH).set('minutes', +toM);
    const currentDate = moment();

    const hasIntersection = currentDate.isBetween(fromDate, toDate)

    return hasIntersection;
  });
  if (occupiedOnSchedule) return 'Зайнято за розкладом';
  return `Зайнято з ${scheduleUnits[0].from}`;
};

export const isNotFree = (occupied: OccupiedInfo) => {
  return occupied.state !== OccupiedState.FREE;
};

export const getIsMeOccupied = (me: CurrentUser, classrooms: ClassroomType[]) => {
  return !!classrooms.find(({occupied}) => occupied.state === OccupiedState.OCCUPIED && me.id === occupied.user.id);
};

export const hasOwnClassroom = (occupiedClassrooms: any) => {
  const ownClassroom = occupiedClassrooms.find((classroom: any) => {
    return classroom.state === OccupiedState.OCCUPIED || classroom.state === OccupiedState.RESERVED;
  });
  return ownClassroom ? ownClassroom.classroom.id : null;
};

export const isEnabledForCurrentDepartment = (classroom: ClassroomType, currentUser: User) => {
  const {queueInfo: {queuePolicy}} = classroom;
  if (queuePolicy.policy === QueuePolicyTypes.SELECTED_DEPARTMENTS
    && !queuePolicy.queueAllowedDepartments.length) return false;
  return queuePolicy.queueAllowedDepartments.length ?
    queuePolicy.queueAllowedDepartments
      .some(({department}) => department.id === currentUser?.department?.id) : true;
};

export const isEnabledForQueue = (classroom: ClassroomType, user: any) => {
    const ownClassroomId = hasOwnClassroom(user.occupiedClassrooms);

    return classroom.id !== ownClassroomId && !classroom.isHidden
      && isEnabledForCurrentDepartment(classroom, user)
      && !(user.occupiedClassrooms.some((data: any) => {
        return data.classroom.id === classroom.id && data.state === OccupiedState.PENDING
      }));
};

export const getMinutesFromHHMM = (time: string) => {
  const [hh, mm] = time.split(':');
  return (+hh * 60) + +mm;
};
