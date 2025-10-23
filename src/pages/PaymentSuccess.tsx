import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PixelFrame from '@/components/PixelFrame';
import {
  paymentStorage,
  getItemDisplayName,
  formatPrice,
  type PaymentContext,
} from '@/utils/paymentStorage';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [paymentContext, setPaymentContext] = useState<PaymentContext | null>(null);
  const [countdown, setCountdown] = useState(10);
  const [loading, setLoading] = useState(true);
  const [noContext, setNoContext] = useState(false);

  useEffect(() => {
    // Small delay to ensure storage is available
    const initTimer = setTimeout(() => {
      const context = paymentStorage.get();

      setLoading(false);

      if (!context) {
        setNoContext(true);
        // Show message for 3 seconds before redirecting
        setTimeout(() => {
          navigate('/panel', { replace: true });
        }, 3000);
        return;
      }

      setPaymentContext(context);

      // Clear payment context after successful display
      paymentStorage.clear();

      // Start countdown for auto-redirect
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate(context.returnUrl, { replace: true });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }, 100);

    return () => clearTimeout(initTimer);
  }, [navigate]);

  const handleManualReturn = () => {
    if (paymentContext) {
      navigate(paymentContext.returnUrl, { replace: true });
    } else {
      navigate('/panel', { replace: true });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-primary-midnight flex items-center justify-center p-4">
        <PixelFrame className="bg-primary-oxfordblue bg-opacity-90 max-w-2xl w-full">
          <div className="text-center py-8">
            <div className="text-6xl mb-4 animate-spin">⏳</div>
            <p className="text-primary-aero text-lg">در حال بارگذاری اطلاعات پرداخت...</p>
          </div>
        </PixelFrame>
      </div>
    );
  }

  // No context state
  if (noContext || !paymentContext) {
    return (
      <div className="min-h-screen bg-primary-midnight flex items-center justify-center p-4">
        <PixelFrame className="bg-primary-oxfordblue bg-opacity-90 max-w-2xl w-full">
          <div className="text-center py-8">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-3xl font-bold text-yellow-400 mb-4">اطلاعات پرداخت یافت نشد</h1>
            <p className="text-primary-aero mb-6">
              ممکن است پرداخت شما با موفقیت انجام شده باشد.
              <br />
              لطفاً وضعیت ثبت‌نام خود را در پنل کاربری بررسی کنید.
            </p>
            <div className="bg-blue-900 bg-opacity-30 rounded p-4 mb-6 border border-blue-500">
              <p className="text-blue-300 text-sm">
                💡 در صورت کسر مبلغ و عدم ثبت‌نام، با پشتیبانی ارتباط برقرار کنید
              </p>
            </div>
            <button
              onClick={handleManualReturn}
              className="pixel-btn pixel-btn-primary py-3 px-8 w-full"
            >
              رفتن به پنل کاربری
            </button>
          </div>
        </PixelFrame>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-midnight flex items-center justify-center p-4">
      <PixelFrame className="bg-primary-oxfordblue bg-opacity-90 max-w-2xl w-full">
        <div className="text-center py-8">
          {/* Success Icon */}
          <div className="text-6xl mb-4 animate-bounce">✅</div>

          {/* Success Title */}
          <h1 className="text-3xl font-bold text-green-400 mb-4 font-pixel">پرداخت موفق!</h1>

          {/* Success Message */}
          <p className="text-primary-aero mb-8 text-lg">پرداخت شما با موفقیت انجام شد.</p>

          {/* Payment Details Card */}
          <div className="bg-primary-midnight rounded-lg p-6 mb-8 border-2 border-green-500 text-right">
            <h2 className="text-xl font-bold text-primary-sky mb-4 flex items-center gap-2">
              <span>📄</span>
              <span>جزئیات پرداخت</span>
            </h2>

            <div className="space-y-4">
              {/* Payment Title */}
              <div className="bg-primary-oxfordblue rounded p-3 border border-primary-cerulean">
                <div className="flex justify-between items-center">
                  <span className="text-primary-aero">عنوان:</span>
                  <span className="font-bold text-primary-sky text-lg">{paymentContext.title}</span>
                </div>
              </div>

              {/* Optional Description */}
              {paymentContext.description && (
                <div className="bg-primary-oxfordblue rounded p-3 border border-primary-cerulean">
                  <p className="text-primary-aero text-sm">{paymentContext.description}</p>
                </div>
              )}

              {/* Items List */}
              <div className="bg-primary-oxfordblue rounded p-4 border border-primary-cerulean">
                <p className="text-primary-aero mb-3 font-bold">موارد خریداری شده:</p>
                <ul className="space-y-2">
                  {paymentContext.items.map((item, index) => (
                    <li key={index} className="text-primary-sky flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span>{getItemDisplayName(item)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Discount Code */}
              {paymentContext.discount_code && (
                <div className="bg-primary-oxfordblue rounded p-3 border border-green-500">
                  <div className="flex justify-between items-center">
                    <span className="text-primary-aero">کد تخفیف:</span>
                    <span className="font-pixel text-green-400">
                      {paymentContext.discount_code}
                    </span>
                  </div>
                </div>
              )}

              {/* Total Amount */}
              <div className="bg-green-900 bg-opacity-30 rounded p-4 border-2 border-green-500">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-green-300 text-lg">مبلغ پرداخت شده:</span>
                  <span className="font-pixel font-bold text-green-400 text-2xl" dir="ltr">
                    {formatPrice(paymentContext.amount)} تومان
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-900 bg-opacity-30 rounded-lg p-4 mb-6 border border-blue-500">
            <div className="flex items-start gap-3 text-right">
              <span className="text-2xl">💡</span>
              <div className="flex-1">
                <p className="text-blue-300 text-sm">
                  اطلاعات بیشتر و مراحل بعدی را در پنل کاربری خود مشاهده کنید.
                </p>
              </div>
            </div>
          </div>

          {/* Auto-redirect Notice */}
          <div className="bg-primary-midnight rounded p-3 mb-6 border border-primary-cerulean">
            <p className="text-primary-aero text-sm">
              <span className="font-pixel text-primary-sky">{countdown}</span> ثانیه دیگر به‌طور
              خودکار منتقل می‌شوید
            </p>
          </div>

          {/* Return Button */}
          <button
            onClick={handleManualReturn}
            className="pixel-btn pixel-btn-primary py-3 px-8 w-full text-lg"
          >
            بازگشت به پنل کاربری
          </button>
        </div>
      </PixelFrame>
    </div>
  );
}
