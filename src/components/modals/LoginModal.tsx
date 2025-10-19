import { useState } from 'react';

import PixelModal from './PixelModal';

import { useAuth } from '@/context/AuthContext';

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSendCode = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStep('code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      login({
        id: '1',
        email,
        is_validated: false,
        token: 'mock-token',
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <PixelModal onClose={onClose}>
      <div className="text-white text-center font-pixel">
        {step === 'email' ? (
          <>
            <h2 className="text-3xl font-bold mb-6">⚡ فعال‌سازی پورتال</h2>
            <p className="text-gray-300 mb-6 font-normal">
              برای ورود به دنیای BugsBuzzy، ایمیل خود را وارد کنید
            </p>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full pixel-input bg-gray-800 text-white border-gray-600 p-3 mb-6 text-center"
              disabled={loading}
            />

            <button
              onClick={handleSendCode}
              disabled={!email || loading}
              className="pixel-btn pixel-btn-success py-3 px-8"
            >
              {loading ? 'در حال ارسال...' : 'ارسال کد'}
            </button>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-6">✅ پورتال فعال شد</h2>
            <p className="text-gray-300 mb-6 font-normal">
              کد ۶ رقمی ارسال شده به {email} را وارد کنید
            </p>

            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              maxLength={6}
              className="w-full pixel-input bg-gray-800 text-white border-gray-600 p-3 mb-6 text-center text-2xl tracking-widest"
              disabled={loading}
            />

            <button
              onClick={handleVerifyCode}
              disabled={code.length !== 6 || loading}
              className="pixel-btn pixel-btn-primary py-3 px-8"
            >
              {loading ? 'در حال ورود...' : 'ورود به بازی'}
            </button>

            <button
              onClick={() => setStep('email')}
              className="mt-4 text-gray-400 hover:text-white underline text-sm font-normal"
              disabled={loading}
            >
              تغییر ایمیل
            </button>
          </>
        )}
      </div>
    </PixelModal>
  );
}
