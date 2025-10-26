// ترجمه نام فیلدها به فارسی
const fieldNames: Record<string, string> = {
  first_name: 'نام',
  last_name: 'نام خانوادگی',
  phone_number: 'شماره موبایل',
  national_code: 'کد ملی',
  gender: 'جنسیت',
  city: 'شهر',
  university: 'دانشگاه',
  major: 'رشته تحصیلی',
  email: 'ایمیل',
  password: 'رمز عبور',
  name: 'نام تیم',
  invite_code: 'کد دعوت',
  code: 'کد تخفیف',
  discount_code: 'کد تخفیف',
};

// ترجمه پیام‌های خطای رایج بکند
const errorTranslations: Record<string, string> = {
  // ========== Field Validation Errors ==========
  'This field may not be blank.': 'این فیلد نمی‌تواند خالی باشد',
  'This field is required.': 'این فیلد الزامی است',
  'This field must be unique.': 'این فیلد باید یکتا باشد',
  'Ensure this field has no more than 100 characters.':
    'این فیلد حداکثر 100 کاراکتر می‌تواند داشته باشد',
  'Ensure this field has no more than 50 characters.':
    'این فیلد حداکثر 50 کاراکتر می‌تواند داشته باشد',

  // ========== Phone Number Errors ==========
  'A user with this phone number already exists.':
    'کاربری با این شماره موبایل قبلاً ثبت‌نام کرده است',
  'Phone number must start with 09 and be 11 digits':
    'شماره موبایل باید با 09 شروع شود و 11 رقم باشد',
  'Phone number must start with 09 and be 11 digits.':
    'شماره موبایل باید با 09 شروع شود و 11 رقم باشد',

  // ========== National Code Errors ==========
  'A user with this national code already exists.': 'کاربری با این کد ملی قبلاً ثبت‌نام کرده است',
  'National code is invalid.': 'کد ملی نامعتبر است',
  'National code should contain only 10 digits.': 'کد ملی باید 10 رقم باشد',
  'National code must be exactly 10 digits': 'کد ملی باید دقیقاً 10 رقم باشد',

  // ========== Name Errors ==========
  'First name should be in persian.': 'نام باید به فارسی باشد',
  'Last name should be in persian.': 'نام خانوادگی باید به فارسی باشد',

  // ========== Email Errors ==========
  'Invalid email format': 'فرمت ایمیل صحیح نیست',
  'Invalid email format.': 'فرمت ایمیل صحیح نیست',
  'Email is required': 'ایمیل الزامی است',
  'Email is required.': 'ایمیل الزامی است',
  'User with this email does not exist.': 'کاربری با این ایمیل وجود ندارد',
  'User already exists.': 'این ایمیل قبلاً ثبت شده است',
  'Invalid email': 'ایمیل نامعتبر است',
  'Invalid email.': 'ایمیل نامعتبر است',

  // ========== Password Errors ==========
  'Invalid credentials': 'ایمیل یا رمز عبور اشتباه است',
  'Invalid credentials.': 'ایمیل یا رمز عبور اشتباه است',
  "Passwords don't match.": 'رمزهای عبور مطابقت ندارند',
  'Password must be at least 8 characters': 'رمز عبور باید حداقل 8 کاراکتر باشد',
  'Password must be at least 8 characters.': 'رمز عبور باید حداقل 8 کاراکتر باشد',
  'Password required for new users': 'رمز عبور برای کاربران جدید الزامی است',
  'Email and password are required': 'ایمیل و رمز عبور الزامی هستند',
  'Must include email and password.': 'باید ایمیل و رمز عبور وارد شود',
  'User account is disabled.': 'حساب کاربری غیرفعال است',
  'Account is disabled': 'حساب کاربری غیرفعال است',
  'New password is required': 'رمز عبور جدید الزامی است',
  'Current password is required': 'رمز عبور فعلی الزامی است',
  'Current password is incorrect': 'رمز عبور فعلی اشتباه است',
  'Password changed successfully': 'رمز عبور با موفقیت تغییر کرد',
  'Password reset successful. Please set a new password in your profile.':
    'رمز عبور بازنشانی شد. لطفاً در پروفایل، رمز جدید تنظیم کنید.',

  // ========== Verification Errors ==========
  'Verification code has expired': 'کد تایید منقضی شده است',
  'Verification Code has expired': 'کد تایید منقضی شده است',
  'Verification Code is not correct': 'کد وارد شده اشتباه است',
  'Invalid verification code': 'کد تایید نامعتبر است',
  'Invalid verification code.': 'کد تایید نامعتبر است',
  'Verification code must contain only digits.': 'کد تایید باید فقط عدد باشد',
  'Email and verification code are required': 'ایمیل و کد تایید الزامی هستند',
  'Too many attempts. Please try again after 15 minutes':
    'تلاش‌های زیاد. لطفاً بعد از 15 دقیقه دوباره تلاش کنید',
  'User is already verified.': 'کاربر قبلاً تایید شده است',
  'Verification successful': 'تایید با موفقیت انجام شد',
  'Verification code sent to your email': 'کد تایید به ایمیل شما ارسال شد',

  // ========== Team Errors ==========
  'Team name is required': 'نام تیم الزامی است',
  'Invite code is required': 'کد دعوت الزامی است',
  'Invalid invite code': 'کد دعوت نامعتبر است',

  // Create Team Errors (from TeamCreateView)
  'You already have an active team': 'شما قبلاً یک تیم فعال دارید',
  'You are already a member of another team': 'شما عضو تیم دیگری هستید',

  // Join Team Errors (from TeamJoinView and can_join method)
  'You are already a member of this team': 'شما قبلاً عضو این تیم هستید',
  'You are already a member of another in-person team': 'شما عضو تیم حضوری دیگری هستید',
  'You are leader of another team': 'شما سرتیم دیگری هستید',

  // Leave Team Errors (from TeamLeaveView)
  'Team leader cannot leave. Disband team instead.': 'سرتیم نمی‌تواند خارج شود. تیم را منحل کنید',
  'You are not a member of this team': 'شما عضو این تیم نیستید',

  // General Team Messages
  'Left team successfully': 'با موفقیت از تیم خارج شدید',
  'Team disbanded successfully': 'تیم با موفقیت منحل شد',
  'Invite code revoked and regenerated': 'کد دعوت باطل و کد جدید ساخته شد',

  // Submission Errors
  'You are not in an active team': 'شما عضو تیم فعالی نیستید',
  'Your team must be complete to submit': 'تیم شما باید کامل باشد تا بتوانید ارسال کنید',
  'Phase is required': 'فاز الزامی است',
  'Content is required': 'متن ارسالی الزامی است',
  'Phase 0 is not active yet': 'فاز ۰ هنوز فعال نشده است',
  'Phase 1 is not active yet': 'فاز ۱ هنوز فعال نشده است',
  'Phase 2 is not active yet': 'فاز ۲ هنوز فعال نشده است',
  'Phase 3 is not active yet': 'فاز ۳ هنوز فعال نشده است',
  'Phase 4 is not active yet': 'فاز ۴ هنوز فعال نشده است',

  message: '',

  // Legacy support for old messages
  'You already have an active in-person team': 'شما قبلاً یک تیم حضوری فعال دارید',
  'You already have an active inpersonteam team': 'شما قبلاً یک تیم حضوری فعال دارید',
  'You already have an active online team': 'شما قبلاً یک تیم مجازی فعال دارید',
  'You already have an active onlineteam team': 'شما قبلاً یک تیم مجازی فعال دارید',
  'You are already a member of another online team': 'شما عضو تیم مجازی دیگری هستید',
  'Team leader cannot leave the team. You must disband the team instead.':
    'سرتیم نمی‌تواند از تیم خارج شود. باید تیم را منحل کنید',
  'You are not a member of this in-person team': 'شما عضو این تیم حضوری نیستید',
  'You are not a member of this online team': 'شما عضو این تیم مجازی نیستید',
  'In-person team not found': 'تیم حضوری یافت نشد',
  'Online team not found': 'تیم مجازی یافت نشد',
  'Successfully joined the in-person team': 'با موفقیت به تیم حضوری پیوستید',
  'Successfully joined the online team': 'با موفقیت به تیم مجازی پیوستید',
  'Successfully left the in-person team': 'با موفقیت از تیم حضوری خارج شدید',
  'Successfully left the online team': 'با موفقیت از تیم مجازی خارج شدید',
  'In-person team created successfully': 'تیم حضوری با موفقیت ساخته شد',
  'Online team created successfully': 'تیم مجازی با موفقیت ساخته شد',
  'Exactly one team (in_person_team or online_team) must be set':
    'باید دقیقاً یک نوع تیم انتخاب شود',
  'Can join': 'می‌توانید عضو شوید',

  // ========== Payment Errors ==========
  'Payment service failed': 'خطا در سرویس پرداخت. لطفاً دوباره تلاش کنید',
  'Gateway connection failed': 'خطا در اتصال به درگاه پرداخت. لطفاً دوباره تلاش کنید',
  'Unexpected payment error': 'خطای غیرمنتظره در ایجاد پرداخت',
  'Gateway error': 'خطا از درگاه پرداخت',
  'Items are required': 'آیتم‌ها الزامی هستند',
  'Refresh token is required': 'توکن تمدید الزامی است',
  'Invalid or expired refresh token': 'توکن نامعتبر یا منقضی شده است',

  // ========== Discount Code Errors ==========
  'Discount code is required': 'کد تخفیف الزامی است',
  'Invalid discount code': 'کد تخفیف نامعتبر است',
  'Discount code has reached its usage limit': 'کد تخفیف به حد مجاز استفاده رسیده است',
  'Request was throttled. Expected available in': 'درخواست‌های شما بیش از حد مجاز است. لطفاً',
  'Request was throttled.': 'تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً یک دقیقه صبر کنید',

  // ========== Profile Errors ==========
  'Profile updated successfully': 'پروفایل با موفقیت به‌روزرسانی شد',
  'Login successful': 'ورود با موفقیت انجام شد',

  // ========== Permission Errors ==========
  'Authentication credentials were not provided.': 'احراز هویت انجام نشده است. لطفاً وارد شوید',
  'You do not have permission to perform this action.': 'شما مجوز انجام این عملیات را ندارید',
  'User is not verified': 'کاربر تایید نشده است',
  'Profile is not completed': 'پروفایل تکمیل نشده است',
  'Given token not valid for any token type': 'نشست شما منقضی شده است. لطفاً دوباره وارد شوید',
  'Token is expired': 'نشست شما منقضی شده است',

  // Purchase Permission Errors (from HasPurchased permission)
  'You have not purchased the required item.': 'شما این مورد را خریداری نکرده‌اید',
  'You must purchase inperson registration first.': 'ابتدا باید ثبت‌نام حضوری را خریداری کنید',
  'You must purchase gamejam registration first.': 'ابتدا باید ثبت‌نام گیم‌جم را خریداری کنید',
};

export const extractErrorMessage = (error: any): string => {
  // Handle nested messages array from JWT
  if (error.messages && Array.isArray(error.messages)) {
    const message = error.messages.map((m: any) => m.message).join(', ');
    return translateError(message);
  }

  // Handle detail field
  if (error.detail) {
    return translateError(error.detail);
  }

  // Handle error or message field
  const rawMessage = error.message || error.error || 'خطای نامشخص';
  console.log('🔍 extractErrorMessage - rawMessage:', rawMessage);
  const translated = translateError(rawMessage);
  console.log('🔍 extractErrorMessage - translated:', translated);
  return translated;
};

export const translateError = (error?: string): string => {
  if (!error) return '';
  const translated = errorTranslations[error];
  if (translated) return translated;
  // اگر ترجمه پیدا نشد، همان متن انگلیسی را برگردان (نه "خطای نامشخص")
  return error;
};

export const getFieldName = (field: string): string => {
  return fieldNames[field] || field;
};

export const formatApiErrors = (errors: Record<string, string[]>): Record<string, string> => {
  const formatted: Record<string, string> = {};

  Object.entries(errors).forEach(([field, messages]) => {
    const translatedMessages = messages.map(translateError).join(', ');
    formatted[field] = translatedMessages;
  });

  return formatted;
};

export const extractFieldErrors = (
  errorData: any,
): { fieldErrors: Record<string, string>; message: string } => {
  // بررسی اینکه آیا errors object دارد که فیلدهای خطا داشته باشد
  const hasFieldErrors =
    errorData &&
    typeof errorData === 'object' &&
    Object.keys(errorData).some(
      (key) => !['message', 'error', 'status', 'detail', 'code', 'messages'].includes(key),
    );

  if (hasFieldErrors) {
    // فقط فیلدهایی که خطا دارند
    const fieldErrorsOnly: Record<string, string[]> = {};
    Object.entries(errorData).forEach(([key, value]) => {
      if (
        !['message', 'error', 'status', 'detail', 'code', 'messages'].includes(key) &&
        Array.isArray(value)
      ) {
        fieldErrorsOnly[key] = value;
      }
    });

    const errors = formatApiErrors(fieldErrorsOnly);
    return {
      fieldErrors: errors,
      message: getErrorSummary(errors),
    };
  }

  // استفاده از extractErrorMessage برای ترجمه صحیح
  const translatedMessage = extractErrorMessage(errorData);
  return {
    fieldErrors: {},
    message: translatedMessage || 'خطای نامشخص',
  };
};

export const getErrorSummary = (errors: Record<string, string>): string => {
  const errorFields = Object.keys(errors);

  if (errorFields.length === 0) {
    return '';
  }

  if (errorFields.length === 1) {
    const field = errorFields[0];
    const fieldNameFa = getFieldName(field);
    const errorMessage = errors[field];

    // اگر پیام خطا خودش کامل بود، همونو برگردون
    if (errorMessage.includes('قبلاً ثبت') || errorMessage.includes('کاربری با')) {
      return errorMessage;
    }

    return `خطا در ${fieldNameFa}: ${errorMessage}`;
  }

  return `${errorFields.length} فیلد دارای خطا: ${errorFields.map(getFieldName).join('، ')}`;
};
