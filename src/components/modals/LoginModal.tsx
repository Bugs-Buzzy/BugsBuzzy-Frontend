import { useState, useEffect } from 'react';

import PixelModal from './PixelModal';

import { useAuth } from '@/context/AuthContext';
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
      onClose();
    } catch (err) {
      console.error('Verify code error:', err);
      const apiError = err as ApiError;
      const { message } = extractFieldErrors(apiError.errors);
      setError(message || 'کد وارد شده اشتباه است');
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
      onClose();
    } catch (err) {
      console.error('Forgot password error:', err);
      const apiError = err as ApiError;
      const { message } = extractFieldErrors(apiError.errors);
      setError(message || 'خطا در بازنشانی رمز');
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
      onClose();
    } catch (err) {
      console.error('Login error:', err);
      const apiError = err as ApiError;
      const { message } = extractFieldErrors(apiError.errors);
      setError(message || 'خطا در ورود');
    } finally {
      setLoading(false);
    }
  };

  const renderEmailStep = () => (
    <>
      <h2 className="text-3xl font-bold mb-6 text-primary-sky">
        {flow === 'forgot' ? '🔑 فراموشی رمز عبور' : '⚡ ورود به پنل'}
      </h2>
      <p className="text-primary-aero mb-6 font-normal">
        {flow === 'forgot' ? 'ایمیل خود را برای بازیابی رمز وارد کنید' : 'ایمیل خود را وارد کنید'}
      </p>

      <input
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError('');
        }}
        placeholder="email@example.com"
        className={`w-full pixel-input bg-primary-midnight text-white border-primary-cerulean p-3 mb-2 text-center ${
          error ? 'border-red-500' : ''
        }`}
        disabled={loading}
        onKeyDown={(e) => e.key === 'Enter' && email && validateEmail(email) && handleSendCode()}
        dir="ltr"
      />

      {email && !validateEmail(email) && !error && (
        <p className="text-secondary-ramzinex mb-2 text-xs font-normal">فرمت ایمیل صحیح نیست</p>
      )}

      {error && (
        <p className="text-red-500 mb-4 text-sm font-normal whitespace-pre-line">{error}</p>
      )}

      <button
        onClick={handleSendCode}
        disabled={!email || !validateEmail(email) || loading}
        className="pixel-btn pixel-btn-primary py-3 px-8 w-full"
      >
        {loading ? 'در حال ارسال...' : 'ارسال کد'}
      </button>
    </>
  );

  const renderCodeStep = () => (
    <>
      <h2 className="text-3xl font-bold mb-6 text-primary-sky">
        {flow === 'forgot' ? '🔑 بازیابی رمز' : '✅ تایید ایمیل'}
      </h2>
      <p className="text-primary-aero mb-6 font-normal">
        کد ۶ رقمی ارسال شده به <span className="font-pixel">{email}</span> را وارد کنید
      </p>

      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
        placeholder="------"
        maxLength={6}
        className="w-full pixel-input bg-primary-midnight text-primary-sky border-primary-cerulean p-3 mb-4 text-center text-2xl tracking-widest font-pixel"
        disabled={loading}
        onKeyDown={(e) =>
          e.key === 'Enter' &&
          code.length === 6 &&
          (flow === 'forgot' ? handleForgotPassword() : handleVerifyCode())
        }
        dir="ltr"
      />

      {error && <p className="text-red-500 mb-4 text-sm font-normal">{error}</p>}

      <button
        onClick={flow === 'forgot' ? handleForgotPassword : handleVerifyCode}
        disabled={code.length !== 6 || loading}
        className="pixel-btn pixel-btn-primary py-3 px-8 mb-4 w-full"
      >
        {loading ? 'در حال پردازش...' : flow === 'forgot' ? 'بازنشانی رمز و ورود' : 'تایید و ورود'}
      </button>

      <div className="flex flex-col gap-2">
        <button
          onClick={handleSendCode}
          className={`text-sm font-normal underline ${
            resendTimer > 0 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white'
          }`}
          disabled={loading || resendTimer > 0}
        >
          {resendTimer > 0
            ? `ارسال مجدد (${Math.floor(resendTimer / 60)}:${(resendTimer % 60).toString().padStart(2, '0')})`
            : 'ارسال مجدد کد'}
        </button>

        {flow === 'normal' && (
          <button
            onClick={() => setStep('password-login')}
            className="text-gray-400 hover:text-white underline text-sm font-normal"
            disabled={loading}
          >
            ورود با رمز عبور
          </button>
        )}

        <button
          onClick={() => setStep('email')}
          className="text-gray-400 hover:text-white underline text-sm font-normal"
          disabled={loading}
        >
          تغییر ایمیل
        </button>
      </div>
    </>
  );

  const renderPasswordLoginStep = () => (
    <>
      <h2 className="text-3xl font-bold mb-6 text-primary-sky">🔐 ورود با رمز</h2>
      <p className="text-primary-aero mb-4 font-normal">
        <span className="font-pixel">{email}</span>
      </p>

      <input
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setError('');
        }}
        placeholder="رمز عبور"
        className="w-full pixel-input bg-primary-midnight text-white border-primary-cerulean p-3 mb-4 text-center"
        disabled={loading}
        onKeyDown={(e) => e.key === 'Enter' && password && handlePasswordLogin()}
      />

      {error && <p className="text-red-500 mb-4 text-sm font-normal">{error}</p>}

      <button
        onClick={handlePasswordLogin}
        disabled={!password || loading}
        className="pixel-btn pixel-btn-success py-3 px-8 mb-4 w-full"
      >
        {loading ? 'در حال ورود...' : 'ورود'}
      </button>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => {
            setFlow('forgot');
            setStep('email');
            setPassword('');
            setError('');
          }}
          className="text-secondary-ramzinex hover:text-secondary-orangeCrayola underline text-sm font-normal"
          disabled={loading}
        >
          رمز عبور را فراموش کرده‌اید؟
        </button>

        <button
          onClick={() => {
            setStep('code');
            setPassword('');
            setError('');
          }}
          className="text-gray-400 hover:text-white underline text-sm font-normal"
          disabled={loading}
        >
          بازگشت به ورود با کد
        </button>
      </div>
    </>
  );

  return (
    <PixelModal onClose={onClose}>
      <div className="text-white text-center font-pixel">
        {step === 'email' && renderEmailStep()}
        {step === 'code' && renderCodeStep()}
        {step === 'password-login' && renderPasswordLoginStep()}
      </div>
    </PixelModal>
  );
}
