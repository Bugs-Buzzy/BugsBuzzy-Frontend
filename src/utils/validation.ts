// Email validation regex (RFC 5322 simplified)
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Persian text regex (including space and zero-width non-joiner)
const PERSIAN_REGEX = /^[\u0621-\u0651\u066B-\u06CC\u200c\s]+$/;

// Phone number regex (Iranian format)
const PHONE_REGEX = /^09\d{9}$/;

// National code regex
const NATIONAL_CODE_REGEX = /^\d{10}$/;

export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

export const validatePersianText = (text: string): boolean => {
  return PERSIAN_REGEX.test(text);
};

export const validatePhoneNumber = (phone: string): boolean => {
  return PHONE_REGEX.test(phone);
};

export const validateNationalCode = (code: string): boolean => {
  if (!NATIONAL_CODE_REGEX.test(code)) {
    return false;
  }

  // اعتبارسنجی کد ملی با الگوریتم استاندارد
  const nationalCode = parseInt(code);
  const control = nationalCode % 10;
  let sum = 0;
  let temp = Math.floor(nationalCode / 10);

  for (let i = 2; i <= 10; i++) {
    const digit = temp % 10;
    sum += digit * i;
    temp = Math.floor(temp / 10);
  }

  const remainder = sum % 11;
  const newControl = remainder < 2 ? remainder : 11 - remainder;

  return newControl === control;
};

export const getEmailError = (email: string): string | null => {
  if (!email) {
    return 'ایمیل الزامی است';
  }
  if (!validateEmail(email)) {
    return 'فرمت ایمیل صحیح نیست';
  }
  return null;
};

export const getPersianNameError = (name: string, fieldName: string): string | null => {
  if (!name || !name.trim()) {
    return `${fieldName} الزامی است`;
  }
  if (!validatePersianText(name)) {
    return `${fieldName} باید به فارسی باشد`;
  }
  return null;
};

export const getPhoneNumberError = (phone: string): string | null => {
  if (!phone) {
    return 'شماره موبایل الزامی است';
  }
  if (!validatePhoneNumber(phone)) {
    return 'شماره موبایل باید با 09 شروع شود و 11 رقم باشد';
  }
  return null;
};

export const getNationalCodeError = (code: string): string | null => {
  if (!code) {
    return 'کد ملی الزامی است';
  }
  if (!NATIONAL_CODE_REGEX.test(code)) {
    return 'کد ملی باید 10 رقم باشد';
  }
  if (!validateNationalCode(code)) {
    return 'کد ملی نامعتبر است';
  }
  return null;
};
