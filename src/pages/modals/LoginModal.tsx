import { useState, useEffect } from 'react';
import {
  FaBolt,
  FaKey,
  FaCheckCircle,
  FaEnvelope,
  FaSortNumericDown,
  FaLock,
  FaUnlock,
  FaSpinner,
  FaCheck,
  FaRedo,
  FaClock,
  FaEdit,
  FaArrowLeft,
  FaTimes,
  FaExclamationTriangle,
} from 'react-icons/fa';

import PixelModal from '@/components/modals/PixelModal';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import type { ApiError } from '@/services/api';
import { authService } from '@/services/auth.service';
import { extractFieldErrors } from '@/utils/errorMessages';
import { validateEmail, getEmailError } from '@/utils/validation';

interface LoginModalProps {
  onClose: () => void;
}

type Flow = 'normal' | 'forgot';
type Step = 'email' | 'code' | 'password-login';

export default function LoginModal({ onClose }: LoginModalProps) {
  const [flow, setFlow] = useState<Flow>('normal');
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [resendTimer, setResendTimer] = useState(0);
  const { login } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendCode = async () => {
    const emailError = getEmailError(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setLoading(true);
    setError('');
    try {
      await authService.sendCode({ email });
      setStep('code');
      setResendTimer(120);
    } catch (err) {
      console.error('Send code error:', err);
      const apiError = err as ApiError;
      const { message } = extractFieldErrors(apiError.errors);
      setError(message || 'خطا در ارسال کد');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await authService.verifyCode({
        email,
        verification_code: code,
      });

      authService.setTokens(response.access, response.refresh);
      login(response.user, response.access, response.refresh);
      toast.success('ورود موفقیت‌آمیز بود');
      onClose();
    } catch (err) {
      console.error('Verify code error:', err);
      const apiError = err as ApiError;
      const { message } = extractFieldErrors(apiError.errors);
      setError(message || 'کد وارد شده اشتباه است');
      toast.error(message || 'کد وارد شده اشتباه است');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await authService.forgotPassword({
        email,
        verification_code: code,
      });

      authService.setTokens(response.access, response.refresh);
      login(response.user, response.access, response.refresh);
      toast.success('رمز عبور شما با موفقیت بازنشانی شد');
      onClose();
    } catch (err) {
      console.error('Forgot password error:', err);
      const apiError = err as ApiError;
      const { message } = extractFieldErrors(apiError.errors);
      setError(message || 'خطا در بازنشانی رمز');
      toast.error(message || 'خطا در بازنشانی رمز');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async () => {
    const emailError = getEmailError(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await authService.login({ email, password });
      authService.setTokens(response.access, response.refresh);
      login(response.user, response.access, response.refresh);
      toast.success('ورود موفقیت‌آمیز بود');
      onClose();
    } catch (err) {
      console.error('Login error:', err);
      const apiError = err as ApiError;
      const { message } = extractFieldErrors(apiError.errors);
      setError(message || 'خطا در ورود');
      toast.error(message || 'خطا در ورود');
    } finally {
      setLoading(false);
    }
  };

  const renderEmailStep = () => (
    <>
      <div className="flex items-center justify-center gap-3 mb-4 md:mb-6">
        {flow === 'forgot' ? (
          <FaKey className="text-primary-sky text-2xl md:text-3xl" />
        ) : (
          <FaBolt className="text-primary-sky text-2xl md:text-3xl" />
        )}
        <h2 className="text-2xl md:text-3xl font-bold text-primary-sky">
          {flow === 'forgot' ? 'بازیابی رمز عبور' : 'ورود به حساب'}
        </h2>
      </div>
      <p className="text-gray-400 mb-6 text-sm md:text-base font-normal">
        {flow === 'forgot' ? 'ایمیل خود را وارد کنید' : 'لطفا ایمیل خود را وارد کنید'}
      </p>

      <div className="mb-6">
        <label className="flex items-center gap-2 text-primary-aero text-sm mb-2 font-bold">
          <FaEnvelope className="text-xs" />
          <span>ایمیل</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          placeholder="email@example.com"
          className={`w-full pixel-input bg-gray-900 text-white p-3 mb-2 text-center transition-colors ${
            error
              ? 'border-red-500 bg-red-950 bg-opacity-30'
              : 'border-primary-cerulean focus:border-primary-sky'
          }`}
          disabled={loading}
          onKeyDown={(e) => e.key === 'Enter' && email && validateEmail(email) && handleSendCode()}
          dir="ltr"
        />

        {email && !validateEmail(email) && !error && (
          <div className="flex items-center font-normal gap-2 text-yellow-500 text-xs bg-yellow-950 bg-opacity-30 p-2 rounded border border-yellow-800">
            <FaExclamationTriangle className="flex-shrink-0" />
            <span>فرمت ایمیل صحیح نیست</span>
          </div>
        )}

        {error && (
          <div className="flex items-center font-normal gap-2 text-red-400 text-sm whitespace-pre-line bg-red-950 bg-opacity-30 p-3 rounded border border-red-800">
            <FaTimes className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <button
        onClick={handleSendCode}
        disabled={!email || !validateEmail(email) || loading}
        className="pixel-btn pixel-btn-primary py-3 px-8 w-full text-base md:text-lg font-bold transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin" />
            <span>در حال ارسال...</span>
          </>
        ) : (
          <>
            <FaEnvelope />
            <span>ارسال کد تایید</span>
          </>
        )}
      </button>
    </>
  );

  const renderCodeStep = () => (
    <>
      <div className="flex items-center justify-center gap-3 mb-4 md:mb-6">
        {flow === 'forgot' ? (
          <FaKey className="text-primary-sky text-2xl md:text-3xl" />
        ) : (
          <FaCheckCircle className="text-primary-sky text-2xl md:text-3xl" />
        )}
        <h2 className="text-2xl md:text-3xl font-bold text-primary-sky">
          {flow === 'forgot' ? 'بازیابی رمز' : 'تایید ایمیل'}
        </h2>
      </div>
      <p className="text-gray-400 mb-6 text-sm md:text-base">
        کد ۶ رقمی ارسال شده به <span className="font-pixel text-primary-sky">{email}</span> را وارد
        کنید
      </p>

      <div className="mb-6">
        <label className="flex items-center gap-2 text-primary-aero text-sm mb-2 font-bold">
          <FaSortNumericDown className="text-xs" />
          <span>کد تایید</span>
        </label>
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.replace(/\D/g, ''));
            setError('');
          }}
          placeholder="------"
          maxLength={6}
          className={`w-full pixel-input bg-gray-900 p-4 mb-3 text-center text-2xl tracking-widest font-pixel transition-colors ${
            error
              ? 'border-red-500 text-red-400 bg-red-950 bg-opacity-30'
              : 'text-primary-sky border-primary-cerulean focus:border-primary-sky'
          }`}
          disabled={loading}
          onKeyDown={(e) =>
            e.key === 'Enter' &&
            code.length === 6 &&
            (flow === 'forgot' ? handleForgotPassword() : handleVerifyCode())
          }
          dir="ltr"
        />

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm mb-3 bg-red-950 bg-opacity-30 p-3 rounded border border-red-800">
            <FaTimes className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <button
        onClick={flow === 'forgot' ? handleForgotPassword : handleVerifyCode}
        disabled={code.length !== 6 || loading}
        className="pixel-btn pixel-btn-primary py-3 px-8 mb-4 w-full text-base md:text-lg font-bold transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin" />
            <span>در حال پردازش...</span>
          </>
        ) : flow === 'forgot' ? (
          <>
            <FaUnlock />
            <span>بازنشانی و ورود</span>
          </>
        ) : (
          <>
            <FaCheck />
            <span>تایید و ورود</span>
          </>
        )}
      </button>

      <div className="grid grid-cols-2 gap-2 pt-3 mt-3 border-t border-gray-700">
        <button
          onClick={handleSendCode}
          className={`pixel-btn text-xs py-2 px-3 transition-colors ${
            resendTimer > 0
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700'
              : 'bg-primary-oxfordblue border-primary-cerulean text-primary-aero hover:text-primary-sky'
          }`}
          disabled={loading || resendTimer > 0}
        >
          {resendTimer > 0 ? (
            <div className="flex items-center justify-center gap-1.5">
              <FaClock className="text-xs" />
              <span>
                {Math.floor(resendTimer / 60)}:{(resendTimer % 60).toString().padStart(2, '0')}
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1.5">
              <FaRedo className="text-xs" />
              <span>ارسال مجدد</span>
            </div>
          )}
        </button>

        {flow === 'normal' && (
          <button
            onClick={() => setStep('password-login')}
            className="pixel-btn bg-primary-oxfordblue border-primary-cerulean text-primary-aero hover:text-primary-sky transition-colors text-xs py-2 px-3"
            disabled={loading}
          >
            <div className="flex items-center justify-center gap-1.5">
              <FaLock className="text-xs" />
              <span>ورود با رمز</span>
            </div>
          </button>
        )}

        <button
          onClick={() => setStep('email')}
          className="pixel-btn bg-primary-oxfordblue border-primary-cerulean text-primary-aero hover:text-primary-sky transition-colors text-xs py-2 px-3 col-span-2"
          disabled={loading}
        >
          <div className="flex items-center justify-center gap-1.5">
            <FaEdit className="text-xs" />
            <span>تغییر ایمیل</span>
          </div>
        </button>
      </div>
    </>
  );

  const renderPasswordLoginStep = () => (
    <>
      <div className="flex items-center justify-center gap-3 mb-4 md:mb-6">
        <FaLock className="text-primary-sky text-2xl md:text-3xl" />
        <h2 className="text-2xl md:text-3xl font-bold text-primary-sky">ورود با رمز عبور</h2>
      </div>
      <p className="text-gray-400 mb-6 text-sm md:text-base">
        <span className="font-pixel text-primary-sky">{email}</span>
      </p>

      <div className="mb-6">
        <label className="flex items-center gap-2 text-primary-aero text-sm mb-2 font-bold">
          <FaLock className="text-xs" />
          <span>رمز عبور</span>
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError('');
          }}
          placeholder="رمز عبور خود را وارد کنید"
          className={`w-full pixel-input bg-gray-900 text-white p-3 mb-3 text-center transition-colors ${
            error
              ? 'border-red-500 bg-red-950 bg-opacity-30'
              : 'border-primary-cerulean focus:border-primary-sky'
          }`}
          disabled={loading}
          onKeyDown={(e) => e.key === 'Enter' && password && handlePasswordLogin()}
        />

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm mb-3 bg-red-950 bg-opacity-30 p-3 rounded border border-red-800">
            <FaTimes className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <button
        onClick={handlePasswordLogin}
        disabled={!password || loading}
        className="pixel-btn pixel-btn-primary py-3 px-8 mb-4 w-full text-base md:text-lg font-bold transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin" />
            <span>در حال ورود...</span>
          </>
        ) : (
          <>
            <FaCheck />
            <span>ورود</span>
          </>
        )}
      </button>

      <div className="flex flex-col gap-3 pt-3 border-t border-gray-700">
        <button
          onClick={() => {
            setFlow('forgot');
            setStep('email');
            setPassword('');
            setError('');
          }}
          className="pixel-btn bg-primary-oxfordblue border-secondary-orangePantone text-secondary-ramzinex hover:text-secondary-orangeCrayola transition-colors text-xs py-2 px-3"
          disabled={loading}
        >
          <div className="flex items-center justify-center gap-1.5">
            <FaKey className="text-xs" />
            <span>فراموشی رمز</span>
          </div>
        </button>

        <button
          onClick={() => {
            setStep('code');
            setPassword('');
            setError('');
          }}
          className="pixel-btn bg-primary-oxfordblue border-primary-cerulean text-primary-aero hover:text-primary-sky transition-colors text-xs py-2 px-3"
          disabled={loading}
        >
          <div className="flex items-center justify-center gap-1.5">
            <FaArrowLeft className="text-xs" />
            <span>بازگشت</span>
          </div>
        </button>
      </div>
    </>
  );

  return (
    <PixelModal onClose={onClose} closeOnOverlayClick={false}>
      <div className="text-white text-center font-pixel">
        {step === 'email' && renderEmailStep()}
        {step === 'code' && renderCodeStep()}
        {step === 'password-login' && renderPasswordLoginStep()}
      </div>
    </PixelModal>
  );
}
