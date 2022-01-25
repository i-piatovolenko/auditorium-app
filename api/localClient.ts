import {makeVar} from "@apollo/client";
import {ACCESS_RIGHTS, Langs, Mode, User} from "../models/models";

export const localFields = {
  me: {
    read: () => meVar()
  },
  lang: {
    read: () => langVar()
  },
  accessRights: {
    read: () => accessRightsVar()
  },
  mode: {
    read: () => modeVar()
  },
  minimalClassroomIds: {
    read: () => minimalClassroomIdsVar()
  },
  desirableClassroomIds: {
    read: () => desirableClassroomIdsVar()
  },
  isMinimalSetup: {
    read: () => isMinimalSetupVar()
  },
  pushNotificationToken: {
    read: () => pushNotificationTokenVar()
  },
  noConnection: {
    read: () => noConnectionVar()
  },
  noToken: {
    read: () => noTokenVar()
  },
  skippedClassroom: {
    read: () => skippedClassroomVar()
  },
  acceptedClassroom: {
    read: () => acceptedClassroomVar()
  },
  maxDistance: {
    read: () => maxDistanceVar()
  },
  globalError: {
    read: () => globalErrorVar()
  },
};

export const meVar = makeVar<User | null>(null);
export const langVar = makeVar<Langs>(Langs.UK);
export const accessRightsVar = makeVar(ACCESS_RIGHTS.USER);
export const modeVar = makeVar(Mode.PRIMARY);
export const minimalClassroomIdsVar = makeVar<number[]>([]);
export const desirableClassroomIdsVar = makeVar<number[]>([]);
export const isMinimalSetupVar = makeVar(true);
export const pushNotificationTokenVar = makeVar('');
export const noConnectionVar = makeVar(false);
export const noTokenVar = makeVar(false);
export const skippedClassroomVar = makeVar(false);
export const acceptedClassroomVar = makeVar(false);
export const maxDistanceVar = makeVar(0.750);
export const globalErrorVar = makeVar(null);
