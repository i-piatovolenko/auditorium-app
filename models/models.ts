export enum ACCESS_RIGHTS {
  USER,
  DISPATCHER,
  ADMIN
}

export enum Mode {
  PRIMARY = 'PRIMARY',
  QUEUE_SETUP = 'QUEUE_SETUP',
  INLINE = 'INLINE',
  OWNER = 'OWNER'
}

export enum ErrorCodesUa {
  INVALID_PASSWORD = "Невірний пароль",
  USER_NOT_FOUND = "Користувача не знайдено",
}

export enum ErrorCodes {
  INVALID_PASSWORD = "INVALID_PASSWORD",
  USER_NOT_FOUND = "USER_NOT_FOUND",
}

export enum EmploymentTypes {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  HOURLY = 'HOURLY',
}

export enum EmploymentTypesUa {
  FULL_TIME = 'Штатний співробітник',
  PART_TIME = 'Часткова',
  HOURLY = 'Погодинна',
}

export enum UserTypes {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
  POST_GRADUATE = "POST_GRADUATE",
  ADMIN = "ADMIN",
  DISPATCHER = "DISPATCHER",
  PIANO_TUNER = "PIANO_TUNER",
  STAFF = "STAFF",
  CONCERTMASTER = "CONCERTMASTER",
  ILLUSTRATOR = "ILLUSTRATOR",
  OTHER = "OTHER",
}

export enum UserTypesUa {
  STUDENT = "Студент",
  TEACHER = "Викладач",
  POST_GRADUATE = "Асистент/аспірант",
  ADMIN = "Адмін",
  DISPATCHER = "Диспетчер",
  PIANO_TUNER = "Настроювач фортепіано",
  STAFF = "Співробітник",
  CONCERTMASTER = "Концертмейстер",
  ILLUSTRATOR = "Іллюстратор",
  OTHER = "Користувач",
}

export enum UserTypeColors {
  STUDENT = "#1e2c4f",
  TEACHER = "#ffa200",
  POST_GRADUATE = "#1e2c4f",
  ADMIN = "#ffa200",
  DISPATCHER = "#ffa200",
  PIANO_TUNER = "#ffa200",
  STAFF = "#ffa200",
  CONCERTMASTER = "#ffa200",
  ILLUSTRATOR = "#ffa200",
  OTHER = "#ffa200",
}

export enum ActivityTypesColor {
  LECTURE = '#ffa200',
  INDIVIDUAL_LESSON = '#2b5dff'
}

export enum ActivityTypes {
  LECTURE = 'LECTURE',
  INDIVIDUAL_LESSON = 'INDIVIDUAL_LESSON'
}

export enum NotificationsTypes {
  OK = "ok",
  ALERT = "alert",
  DEFAULT = "default",
}

export enum AccountStatuses {
  ACTIVE = 'ACTIVE',
  UNVERIFIED = 'UNVERIFIED',
  ACADEMIC_LEAVE = 'ACADEMIC_LEAVE',
  FROZEN = 'FROZEN'
}

export type User = {
  id: number;
  createdAt: Date;
  firstName: string;
  patronymic: string | null;
  lastName: string;
  type: string;
  department: Department;
  email: string;
  phoneNumber: string;
  extraPhoneNumbers: string | null;
  nameTemp: string | null;
  startYear: number;
  studentInfo: StudentInfo;
  employeeInfo: EmployeeInfo;
  expireDate: Date | null;
  classroom: ClassroomType;
  queue: QueueRecord[];
};

export type CurrentUser = {
  id: number;
  createdAt: Date;
  firstName: string;
  patronymic: string | null;
  lastName: string;
  type: string;
  department: Department;
  email: string;
  phoneNumber: string;
  extraPhoneNumbers: string | null;
  nameTemp: string | null;
  startYear: number;
  studentInfo: StudentInfo;
  employeeInfo: EmployeeInfo;
  expireDate: Date | null;
  occupiedClassrooms: {
    id: number;
    state: OccupiedState;
    until: string;
    classroom: ClassroomType;
    user: User;
  }[];
  queue: QueueRecord[];
}

export type StudentInfo = {
  degree: Degree;
  startYear: number;
  accountStatus: AccountStatuses;
};

export type EmployeeInfo = {
  employmentType: EmploymentTypes;
  accountStatus: AccountStatuses;
};

export type OccupiedInfo = {
  user: User | null;
  until: Date | null;
  state: OccupiedState;
};

export enum OccupiedState {
  FREE = 'FREE',
  OCCUPIED = 'OCCUPIED',
  PENDING = 'PENDING',
  RESERVED = 'RESERVED'
}

export type Comment = {
  id: number;
  user: User;
  body: string;
  date: Date;
};

export type InstrumentType = {
  id: number;
  type: string;
  name: string;
  rate: number;
  persNumber: number;
  comments: Comment | null;
  classroom: ClassroomType;
};

export enum DisabledState {
  DISABLED = 'DISABLED',
  NOT_DISABLED = 'NOT_DISABLED'
}

export type DisabledInfo = {
  state: DisabledState;
  comment: string;
  until: string;
};

export type ScheduleUnitType = {
  id: number;
  user: User;
  classroom: ClassroomType;
  dateStart: Date;
  dateEnd: Date;
  dayOfWeek: number;
  from: string;
  to: string;
  activity: string;
};

export type ClassroomType = {
  id: number;
  name: string;
  chair: {
    id: number;
    name: string;
    faculty: Faculty;
    users: User[];
    exclusivelyQueueAllowedDepartmentsInfo: {
      department: Department | null }[];
  } | null;
  special: string | null;
  floor: number;
  isWing: boolean;
  isOperaStudio: boolean;
  description: string | null;
  occupied: OccupiedInfo;
  instruments: Array<InstrumentType>;
  disabled: DisabledInfo | null;
  schedule: Array<ScheduleUnitType>;
  isHidden: boolean;
};

export type RegisterUnit = {
  id: number;
  user: User;
  nameTemp: string;
  classroom: {
    id: number;
    name: string;
  };
  start: string;
  end: string;
};

export type Degree = {
  id: number
  name: string;
  startMonth: number;
  startDay: number;
  durationMonths: number;
};

export type Faculty = {
  id: number;
  name: string;
  departments: Department[];
  users: User[];
}

export type Department = {
  id: number;
  name: string;
  faculty: Faculty;
  users: User[];
};

export type MenuElement = {
  text: string;
  path: string;
  icon: string;
  exact?: boolean;
  rights: string;
};

export enum ClassroomsFilterTypes {
  ALL = 'ALL',
  FREE = 'FREE',
  SPECIAL = 'SPECIAL',
  INLINE = 'INLINE'
}

export enum QueueState {
  ACTIVE = 'ACTIVE',
  RESERVED = 'RESERVED'
}

export enum QueueType {
  MINIMAL = 'MINIMAL',
  DESIRED = 'DESIRED'
}

export type QueueRecord = {
  id: number;
  user: User;
  date: string;
  classroom: ClassroomType;
  state: QueueState;
  type: QueueType;
}

export type SavedFilterT = {
  minimalClassroomIds: number[];
  desirableClassroomIds: number[];
  name: string;
  main: boolean;
}

export enum Langs {
  EN = 'EN',
  UA = 'UA'
}

export enum EnqueuedBy {
  SELF = 'SELF',
  DISPATCHER = 'DISPATCHER'
}