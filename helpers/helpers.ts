import {
  HOUR,
  MINUTE,
  TIME_SNIPPETS,
  WORKING_DAY_END,
  WORKING_DAY_START,
} from "./constants";
import {
  ACCESS_RIGHTS, Mode,
  OccupiedInfo, OccupiedState,
  ScheduleUnitType,
  User,
  UserTypes,
} from "../models/models";
import moment from "moment";
import React, {ReactElement} from "react";
import {accessRightsVar} from "../api/client";
import {Image} from "react-native";
import {TWO_MINUTES} from "../constants/constants";

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

export const fullName = (user: User | undefined, withInitials = false) => {
  if (user !== undefined) {
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

export const typeStyle = (occupied: OccupiedInfo) => {
  const student = { backgroundColor: "#2e287c", color: "#fff" };
  const employee = { backgroundColor: "#ffc000", color: "#fff" };
  const vacant = {
    backgroundColor: "transparent",
    color: "#000",
  };
  if (occupied !== null) {
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
    const lastIndex = until.length - 5;
    const differenceInMs = moment(until.slice(0, lastIndex)).diff(moment());
    const tempTime = moment.duration(differenceInMs);

    const resultHHMMSS = tempTime.hours() + ':' + tempTime.minutes() + ':' + tempTime.seconds();
    const resultPercents = differenceInMs / ((MINUTE * minutesDuration) / 100);

    return [resultHHMMSS, resultPercents];
  }
};

export const isPendingForMe = (occupied: OccupiedInfo, me: User, mode: Mode) => {
  return occupied && occupied.user.id === me.id &&
    (occupied.state === OccupiedState.PENDING || occupied.state === OccupiedState.RESERVED) &&
    mode === Mode.INLINE;
}

export const isOwnClassroom = (occupied: OccupiedInfo, me: User) => {
  return occupied && occupied.user.id === me.id && occupied.state === OccupiedState.OCCUPIED;
};