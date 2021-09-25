export const PASSWORD_SOFT_VALID = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;
export const PASSWORD_STRONG_VALID = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
export const PHONE_VALID = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
export const ONLY_DIGITS = /^[0-9]*$/;
export const EMAIL_VALID = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
export const ONLY_CYRILLIC = /[\u0400-\u04FF-’]/;

export const validationErrors = {
  REQUIRED_FIELD: "Обов'язкове поле",
  INVALID_FORMAT: "Невірний формат",
  PASSWORDS_NOT_SAME: 'Паролі не співпадають',
  INVALID_PASSWORD: 'Не меньше 6 символів і має містити букви та цифри.',
  ONLY_CYRILLIC: "Тільки символи кирилиці",
  NO_START_YEAR: "Рік вступу не вибрано",
  NO_DEPARTMENT: "Кафедру не вибрано",
  NO_DEGREE: "Навчальний ступінь не вибрано",
}

