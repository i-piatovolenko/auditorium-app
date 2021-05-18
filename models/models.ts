export enum ACCESS_RIGHTS {
  USER,
  DISPATCHER,
  ADMIN
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

export enum ActivityTypes {
  LECTURE = '#ffa200',
  INDIVIDUAL_LESSON = '#2b5dff'
}

export enum NotificationsTypes {
  OK = "ok",
  ALERT = "alert",
  DEFAULT = "default",
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
  verified: boolean;
  expireDate: Date | null;
};

export type StudentInfo = {
  degree: Degree;
  startYear: number;
  accountStatus: string;
};

export type EmployeeInfo = {
  employmentType: EmploymentTypes;
  accountStatus: string;
};

export type OccupiedInfo = {
  user: User;
  until: Date;
};

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

export type DisabledInfo = {
  comment: string;
  until: Date;
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
  chair: Department | null;
  special: string | null;
  floor: number;
  isWing: boolean;
  isOperaStudio: boolean;
  description: string | null;
  occupied: OccupiedInfo | null;
  instruments: Array<InstrumentType>;
  disabled: DisabledInfo | null;
  schedule: Array<ScheduleUnitType>;
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
  SPECIAL = 'SPECIAL'
}