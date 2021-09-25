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
  EMAIL_TRANSPORT_ERROR = 'Помилка з e-mail',
  DB_ERROR = 'Помилка бази даних',
  USER_NOT_FOUND = 'Користувача не знайдено',
  SERVICE_TEMPORARILY_UNAVAILABLE = 'Сервіс тимчасово недоступний. Спробуйте пізніше.',
  ADD_QUEUE_RECORDS_WHILE_OCCUPYING = 'Неможливо стати в чергу при наявності зайнятої аудиторії.',
  ADD_QUEUE_RECORDS_WHILE_QUEUE_RESERVED = 'Неможливо стати в чергу при наявності зарезервованої аудиторії.',
  ADD_QUEUE_RECORDS_WHILE_SANCTIONED = 'Неможливо стати в чергу при наявності накладенх санкцій.',
  USER_IS_NOT_IN_QUEUE = 'Ви не знаходитесь в черзі.',
  EMAIL_ALREADY_CONFIRMED = 'E-mail вже підтверджено.',
  NO_SUCH_REGISTERED_USER = 'Користувача з такою поштовою адресою не знайдено.',
  BAD_EMAIL_CONFIRMATION_TOKEN = 'Посилання на підтвердження поштової адреси не дійсне.',
  CLASSROOM_NOT_FOUND = 'Аудиторію не знайдено.',
  CLASSROOM_ALREADY_FREE = 'Аудиторія вже вільна.',
  CLASSROOM_NOT_RESERVED = 'Неможливо видати ключ. Аудиторія не зарезервована.',
  EMAIL_NOT_CONFIRMED = 'Будь-ласка, підтвердіть вашу e-mail адресу. Для цього перейдіть за посиланням яке було відправлене на вашу поштову скриньку.',
  INVALID_PASSWORD = 'Невірний пароль',
  USER_ACADEMIC_LEAVE = 'Аккаунт не активний. Причина: академічна відпустка. Для активації підійдіть до учбовой частини.',
  USER_UNVERIFIED = 'Ви не верифіковані. Підтвердіть ваші дані в учбовій частині.',
  CLASSROOM_NOT_PENDING = 'Неможливо підтвердити або пропустити аудиторію.',
  CLASSROOM_PENDING_DECISION_NO_ACCESS = 'Неможливо підтвердити або пропустити аудиторію.',
  USER_NOT_IN_QUEUE = 'Ви не в стоїте в черзі.',
  INCORRECT_QUEUE_STATE = 'Помилка. Невірний статус в черзі.',
  CANNOT_RESERVE_WHILE_OCCUPYING = 'Знаходитись одночасно в декількох аудиторіях неможливо. У вас вже є аудиторія.',
  CANNOT_RESERVE_WHILE_QUEUE_RESERVED = 'Ви вже зарезервували аудиторію.',
  CLASSROOM_ACCESS_DENIED = 'Аудиторія недоступна для резервації.',
  EMAIL_ALREADY_TAKEN = 'Користувача з цією адресою вже зареєстровано.',
  CONFIRMATION_EMAIL_ALREADY_SENT = 'Лист підтвердження поштової адреси вже було відправлено.',
}

export enum ErrorCodes {
  EMAIL_TRANSPORT_ERROR = 'EMAIL_TRANSPORT_ERROR',
  DB_ERROR = 'DB_ERROR',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  SERVICE_TEMPORARILY_UNAVAILABLE = 'SERVICE_TEMPORARILY_UNAVAILABLE',
  ADD_QUEUE_RECORDS_WHILE_OCCUPYING = 'ADD_QUEUE_RECORDS_WHILE_OCCUPYING',
  ADD_QUEUE_RECORDS_WHILE_QUEUE_RESERVED = 'ADD_QUEUE_RECORDS_WHILE_QUEUE_RESERVED',
  ADD_QUEUE_RECORDS_WHILE_SANCTIONED = 'ADD_QUEUE_RECORDS_WHILE_SANCTIONED',
  USER_IS_NOT_IN_QUEUE = 'USER_IS_NOT_IN_QUEUE',
  EMAIL_ALREADY_CONFIRMED = 'EMAIL_ALREADY_CONFIRMED',
  NO_SUCH_REGISTERED_USER = 'NO_SUCH_REGISTERED_USER',
  BAD_EMAIL_CONFIRMATION_TOKEN = 'BAD_EMAIL_CONFIRMATION_TOKEN',
  CLASSROOM_NOT_FOUND = 'CLASSROOM_NOT_FOUND',
  CLASSROOM_ALREADY_FREE = 'CLASSROOM_ALREADY_FREE',
  CLASSROOM_NOT_RESERVED = 'CLASSROOM_NOT_RESERVED',
  EMAIL_NOT_CONFIRMED = 'EMAIL_NOT_CONFIRMED',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  USER_ACADEMIC_LEAVE = 'USER_ACADEMIC_LEAVE',
  USER_UNVERIFIED = 'USER_UNVERIFIED',
  CLASSROOM_NOT_PENDING = 'CLASSROOM_NOT_PENDING',
  CLASSROOM_PENDING_DECISION_NO_ACCESS = 'CLASSROOM_PENDING_DECISION_NO_ACCESS',
  USER_NOT_IN_QUEUE = 'USER_NOT_IN_QUEUE',
  INCORRECT_QUEUE_STATE = 'INCORRECT_QUEUE_STATE',
  CANNOT_RESERVE_WHILE_OCCUPYING = 'CANNOT_RESERVE_WHILE_OCCUPYING',
  CANNOT_RESERVE_WHILE_QUEUE_RESERVED = 'CANNOT_RESERVE_WHILE_QUEUE_RESERVED',
  CLASSROOM_ACCESS_DENIED = 'CLASSROOM_ACCESS_DENIED',
  EMAIL_ALREADY_TAKEN = 'EMAIL_ALREADY_TAKEN',
  CONFIRMATION_EMAIL_ALREADY_SENT = 'CONFIRMATION_EMAIL_ALREADY_SENT',
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
  expireDate: string | null;
  classroom: ClassroomType;
  queue: QueueRecord[];
  queueInfo: UserQueueInfo;
};

export type UserQueueInfo = {
  id: number;
  user: User;
  sanctionedUntil: string;
  currentSession: QueueSession
}

export type QueueSession = {
  id: number;
  queueInfo: UserQueueInfo;
  state: UserQueueState;
  enqueuedBy: EnqueuedBy;
  skips: number;
  remainingOccupationTime: string;
}

export enum UserQueueState {
  IN_QUEUE_MINIMAL = 'IN_QUEUE_MINIMAL',
  IN_QUEUE_DESIRED_AND_OCCUPYING = 'IN_QUEUE_DESIRED_AND_OCCUPYING',
  QUEUE_RESERVED_NOT_OCCUPYING = 'QUEUE_RESERVED_NOT_OCCUPYING',
  OCCUPYING = 'OCCUPYING',
}

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
      department: Department | null
    }[];
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
  queueInfo: ClassroomQueueInfo;
};

export type ClassroomQueueInfo = {
  classroom: ClassroomType;
  queuePolicy: QueuePolicyInfo;
}

export type QueuePolicyInfo = {
  classroomQueueInfo: ClassroomQueueInfo;
  policy: QueuePolicyTypes;
  queueAllowedDepartments: ExclusivelyQueueAllowedDepartmentsInfo[];
}

export type ExclusivelyQueueAllowedDepartmentsInfo = {
  department: Department;
  queuePolicyInfo: QueuePolicyInfo;
}

export enum QueuePolicyTypes {
  ALL_DEPARTMENTS = 'ALL_DEPARTMENTS',
  SELECTED_DEPARTMENTS = 'SELECTED_DEPARTMENTS'
}

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

export enum PermittedActionHoursTypes {
  RESERVE_FREE_CLASSROOM = 'RESERVE_FREE_CLASSROOM',
  QUEUE_ACTION = 'QUEUE_ACTION'
}

export enum Platforms {
  WEB = 'web',
  ANDROID = 'android',
  IOS = 'ios'
}