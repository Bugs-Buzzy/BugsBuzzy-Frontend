import { FormEvent, useState, useEffect } from 'react';

import PixelFrame from '@/components/PixelFrame';
import { useAuth } from '@/context/AuthContext';
import type { ApiError } from '@/services/api';
import { authService, type UpdateProfileData } from '@/services/auth.service';
import { extractFieldErrors } from '@/utils/errorMessages';
import { getPersianNameError, getPhoneNumberError, getNationalCodeError } from '@/utils/validation';

export default function ProfileSettings() {
  const { user, refreshProfile, profileCompleted } = useAuth();
  const [formData, setFormData] = useState<UpdateProfileData>({
    first_name: '',
    last_name: '',
    phone_number: '',
    gender: 'M',
    national_code: '',
    city: '',
    university: '',
    major: '',
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone_number: user.phone_number || '',
        gender: user.gender || 'M',
        national_code: user.national_code || '',
        city: user.city || '',
        university: user.university || '',
        major: user.major || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    setFieldErrors({});

    // Client-side validation
    const validationErrors: Record<string, string> = {};

    const firstNameError = getPersianNameError(formData.first_name, 'نام');
    if (firstNameError) validationErrors.first_name = firstNameError;

    const lastNameError = getPersianNameError(formData.last_name, 'نام خانوادگی');
    if (lastNameError) validationErrors.last_name = lastNameError;

    const phoneError = getPhoneNumberError(formData.phone_number);
    if (phoneError) validationErrors.phone_number = phoneError;

    const nationalCodeError = getNationalCodeError(formData.national_code);
    if (nationalCodeError) validationErrors.national_code = nationalCodeError;

    if (!formData.city || !formData.city.trim()) {
      validationErrors.city = 'شهر الزامی است';
    }

    if (!formData.gender) {
      validationErrors.gender = 'جنسیت الزامی است';
    }

    // اگر کاربر رمز عبور نداره، باید حتماً تنظیم کنه
    if (!user?.has_usable_password && !newPassword) {
      setPasswordError('برای تکمیل پروفایل، باید رمز عبور تنظیم کنید');
      setShowPasswordSection(true);
      validationErrors.password = 'رمز عبور الزامی است';
    }

    // اگر validation error داشتیم، نشون بده و submit نکن
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setError('لطفاً خطاهای فرم را بررسی و اصلاح کنید');
      setLoading(false);
      return;
    }

    try {
      // اگر رمز جدید ست شده، اول رمز رو تغییر بده
      if (newPassword && newPassword === confirmPassword) {
        await authService.changePassword({
          current_password: user?.has_usable_password ? currentPassword : undefined,
          new_password: newPassword,
        });
        setPasswordSuccess(true);
        setTimeout(() => setPasswordSuccess(false), 3000);
      }

      await authService.updateProfile(formData);
      await refreshProfile();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      // پاک کردن فیلدهای رمز
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordSection(false);
    } catch (err) {
      console.error('Profile update error:', err);
      const apiError = err as ApiError;
      const { fieldErrors, message } = extractFieldErrors(apiError.errors);

      setFieldErrors(fieldErrors);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordError('رمزهای عبور مطابقت ندارند');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('رمز عبور باید حداقل 8 کاراکتر باشد');
      return;
    }

    setPasswordLoading(true);
    setPasswordError('');
    setPasswordSuccess(false);

    try {
      await authService.changePassword({
        current_password: user?.has_usable_password ? currentPassword : undefined,
        new_password: newPassword,
      });

      await refreshProfile();
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordSection(false);
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      console.error('Password change error:', err);
      const apiError = err as ApiError;
      const { message } = extractFieldErrors(apiError.errors);
      setPasswordError(message || 'خطا در تغییر رمز عبور');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleChange = (field: keyof UpdateProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');

    // Real-time validation
    let fieldError: string | null = null;

    if (field === 'first_name') {
      fieldError = getPersianNameError(value, 'نام');
    } else if (field === 'last_name') {
      fieldError = getPersianNameError(value, 'نام خانوادگی');
    } else if (field === 'phone_number') {
      fieldError = getPhoneNumberError(value);
    } else if (field === 'national_code') {
      fieldError = getNationalCodeError(value);
    } else if (field === 'city' && (!value || !value.trim())) {
      fieldError = 'شهر الزامی است';
    }

    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      if (fieldError) {
        newErrors[field] = fieldError;
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
        <h2 className="text-3xl font-bold text-primary-sky font-pixel mb-6">⚙️ تنظیمات پروفایل</h2>

        {!profileCompleted && (
          <PixelFrame className="bg-secondary-golden bg-opacity-20 border-secondary-orangePantone mb-6">
            <p className="text-secondary-orangeCrayola text-sm font-normal">
              ⚠️ برای دسترسی به امکانات ثبت‌نام و تیم‌سازی، ابتدا فیلدهای ستاره‌دار را تکمیل کنید.
              {!user?.has_usable_password && (
                <span className="block mt-2 font-bold">🔐 همچنین باید رمز عبور تنظیم کنید.</span>
              )}
            </p>
          </PixelFrame>
        )}

        {success && (
          <PixelFrame className="bg-green-900 bg-opacity-30 border-green-500 mb-6">
            <p className="text-green-300 text-sm font-normal">✅ اطلاعات با موفقیت ذخیره شد</p>
          </PixelFrame>
        )}

        {passwordSuccess && (
          <PixelFrame className="bg-green-900 bg-opacity-30 border-green-500 mb-6">
            <p className="text-green-300 text-sm font-normal">✅ رمز عبور با موفقیت تغییر کرد</p>
          </PixelFrame>
        )}

        {error && (
          <PixelFrame className="bg-red-900 bg-opacity-30 border-red-500 mb-6">
            <p className="text-red-300 text-sm font-normal">❌ {error}</p>
          </PixelFrame>
        )}

        {/* Password Change Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-primary-sky font-pixel">
              🔐 {user?.has_usable_password ? 'تغییر رمز عبور' : 'تنظیم رمز عبور'}
              {!user?.has_usable_password && (
                <span className="text-secondary-orangePantone text-lg"> *</span>
              )}
            </h3>
            {!showPasswordSection && (
              <button
                onClick={() => setShowPasswordSection(true)}
                className={`pixel-btn px-4 py-2 text-sm ${
                  !user?.has_usable_password
                    ? 'pixel-btn-warning animate-pulse'
                    : 'pixel-btn-primary'
                }`}
              >
                {user?.has_usable_password ? 'تغییر رمز' : 'تنظیم رمز'}
              </button>
            )}
          </div>

          {showPasswordSection ? (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {passwordError && (
                <PixelFrame className="bg-red-900 bg-opacity-30 border-red-500">
                  <p className="text-red-300 text-sm font-normal">❌ {passwordError}</p>
                </PixelFrame>
              )}

              {user?.has_usable_password && (
                <div>
                  <label className="block text-primary-aero font-bold mb-2 font-pixel">
                    رمز عبور فعلی
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="رمز عبور فعلی خود را وارد کنید"
                    className="w-full pixel-input bg-primary-midnight text-white border-primary-cerulean p-3 font-normal"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-primary-aero font-bold mb-2 font-pixel">
                  رمز عبور جدید
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="رمز عبور جدید (حداقل 8 کاراکتر)"
                  className="w-full pixel-input bg-primary-midnight text-white border-primary-cerulean p-3 font-normal"
                  required
                  minLength={8}
                />
                <p className="text-xs text-gray-400 mt-1 font-normal">(حداقل 8 کاراکتر)</p>
              </div>

              <div>
                <label className="block text-primary-aero font-bold mb-2 font-pixel">
                  تکرار رمز عبور جدید
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="رمز عبور جدید را دوباره وارد کنید"
                  className="w-full pixel-input bg-primary-midnight text-white border-primary-cerulean p-3 font-normal"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="pixel-btn pixel-btn-success py-3 px-8"
                >
                  {passwordLoading ? 'در حال ذخیره...' : 'ذخیره رمز جدید'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordSection(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setPasswordError('');
                  }}
                  className="pixel-btn pixel-btn-danger py-3 px-8"
                >
                  انصراف
                </button>
              </div>
            </form>
          ) : (
            <p className="text-gray-400 text-sm font-normal">
              برای تغییر رمز عبور، روی دکمه "تغییر رمز" کلیک کنید
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-primary-aero font-bold mb-2 font-pixel">ایمیل</label>
            <input
              type="email"
              value={user?.email}
              disabled
              className="w-full pixel-input bg-primary-midnight text-gray-400 border-primary-cerulean p-3 font-pixel opacity-60 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1 font-normal">(غیرقابل تغییر)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-primary-aero font-bold mb-2 font-pixel">
                نام <span className="text-secondary-orangePantone">*</span>
              </label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => handleChange('first_name', e.target.value)}
                placeholder="مثلاً علی"
                className={`w-full pixel-input bg-primary-midnight text-white border-primary-cerulean p-3 font-normal ${
                  fieldErrors.first_name ? 'border-red-500' : ''
                }`}
                required
              />
              {fieldErrors.first_name && (
                <p className="text-red-400 text-xs mt-1 font-normal">{fieldErrors.first_name}</p>
              )}
            </div>

            <div>
              <label className="block text-primary-aero font-bold mb-2 font-pixel">
                نام خانوادگی <span className="text-secondary-orangePantone">*</span>
              </label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
                placeholder="مثلاً احمدی"
                className={`w-full pixel-input bg-primary-midnight text-white border-primary-cerulean p-3 font-normal ${
                  fieldErrors.last_name ? 'border-red-500' : ''
                }`}
                required
              />
              {fieldErrors.last_name && (
                <p className="text-red-400 text-xs mt-1 font-normal">{fieldErrors.last_name}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-primary-aero font-bold mb-2 font-pixel">
                شماره موبایل <span className="text-secondary-orangePantone">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone_number}
                onChange={(e) => handleChange('phone_number', e.target.value)}
                placeholder="09123456789"
                pattern="^09\d{9}$"
                className={`w-full pixel-input bg-primary-midnight text-white border-primary-cerulean p-3 font-pixel ${
                  fieldErrors.phone_number ? 'border-red-500' : ''
                }`}
                required
                dir="ltr"
              />
              <p className="text-xs text-gray-400 mt-1 font-normal">(مثلاً 09xxxxxxxxx)</p>
              {fieldErrors.phone_number && (
                <p className="text-red-400 text-xs mt-1 font-normal">{fieldErrors.phone_number}</p>
              )}
            </div>

            <div>
              <label className="block text-primary-aero font-bold mb-2 font-pixel">
                کد ملی <span className="text-secondary-orangePantone">*</span>
              </label>
              <input
                type="text"
                value={formData.national_code}
                onChange={(e) => handleChange('national_code', e.target.value)}
                placeholder="1234567890"
                pattern="\d{10}"
                maxLength={10}
                className={`w-full pixel-input bg-primary-midnight text-white border-primary-cerulean p-3 font-pixel ${
                  fieldErrors.national_code ? 'border-red-500' : ''
                }`}
                required
                dir="ltr"
              />
              <p className="text-xs text-gray-400 mt-1 font-normal">(10 رقم)</p>
              {fieldErrors.national_code && (
                <p className="text-red-400 text-xs mt-1 font-normal">{fieldErrors.national_code}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-primary-aero font-bold mb-2 font-pixel">
              جنسیت <span className="text-secondary-orangePantone">*</span>
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className={`w-full pixel-input bg-primary-midnight text-white border-primary-cerulean p-3 font-pixel ${
                fieldErrors.gender ? 'border-red-500' : ''
              }`}
              required
            >
              <option value="M">مرد</option>
              <option value="F">زن</option>
            </select>
            {fieldErrors.gender && (
              <p className="text-red-400 text-xs mt-1 font-normal">{fieldErrors.gender}</p>
            )}
          </div>

          <div>
            <label className="block text-primary-aero font-bold mb-2 font-pixel">
              شهر <span className="text-secondary-orangePantone">*</span>
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="مثلاً تهران"
              className={`w-full pixel-input bg-primary-midnight text-white border-primary-cerulean p-3 font-normal ${
                fieldErrors.city ? 'border-red-500' : ''
              }`}
              required
            />
            {fieldErrors.city && (
              <p className="text-red-400 text-xs mt-1 font-normal">{fieldErrors.city}</p>
            )}
          </div>

          <div>
            <label className="block text-primary-aero font-bold mb-2 font-pixel">دانشگاه</label>
            <input
              type="text"
              value={formData.university}
              onChange={(e) => handleChange('university', e.target.value)}
              placeholder="مثلاً دانشگاه تهران"
              className={`w-full pixel-input bg-primary-midnight text-white border-primary-cerulean p-3 font-normal ${
                fieldErrors.university ? 'border-red-500' : ''
              }`}
            />
            {fieldErrors.university && (
              <p className="text-red-400 text-xs mt-1 font-normal">{fieldErrors.university}</p>
            )}
          </div>

          <div>
            <label className="block text-primary-aero font-bold mb-2 font-pixel">رشته تحصیلی</label>
            <input
              type="text"
              value={formData.major}
              onChange={(e) => handleChange('major', e.target.value)}
              placeholder="مثلاً مهندسی کامپیوتر"
              className={`w-full pixel-input bg-primary-midnight text-white border-primary-cerulean p-3 font-normal ${
                fieldErrors.major ? 'border-red-500' : ''
              }`}
            />
            {fieldErrors.major && (
              <p className="text-red-400 text-xs mt-1 font-normal">{fieldErrors.major}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="pixel-btn pixel-btn-success py-3 px-8 w-full md:w-auto"
          >
            {loading ? 'در حال ذخیره...' : '💾 ذخیره اطلاعات'}
          </button>
        </form>
      </PixelFrame>
    </div>
  );
}
