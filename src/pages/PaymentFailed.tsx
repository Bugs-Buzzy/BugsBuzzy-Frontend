import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PixelFrame from '@/components/PixelFrame';
import {
  paymentStorage,
  getItemDisplayName,
  formatPrice,
  type PaymentContext,
} from '@/utils/paymentStorage';

export default function PaymentFailed() {
  const navigate = useNavigate();
  const [paymentContext, setPaymentContext] = useState<PaymentContext | null>(null);

  useEffect(() => {
    const context = paymentStorage.get();

    if (!context) {
      // No payment context - redirect to panel
      navigate('/panel', { replace: true });
      return;
    }

    setPaymentContext(context);
    // Keep payment context so user can retry if needed
  }, [navigate]);

  if (!paymentContext) {
    return null; // Will redirect immediately
  }

  const handleRetry = () => {
    // Keep the payment context and go back to the originating page
    navigate(paymentContext.returnUrl, { replace: true });
  };

  const handleGoToPanel = () => {
    paymentStorage.clear();
    navigate('/panel', { replace: true });
  };

  return (
    <div className="min-h-screen bg-primary-midnight flex items-center justify-center p-4">
      <PixelFrame className="bg-primary-oxfordblue bg-opacity-90 max-w-2xl w-full">
        <div className="text-center py-8">
          {/* Failure Icon */}
          <div className="text-6xl mb-4 animate-pulse">❌</div>

          {/* Failure Title */}
          <h1 className="text-3xl font-bold text-red-400 mb-4 font-pixel">پرداخت ناموفق</h1>

          {/* Failure Message */}
          <p className="text-primary-aero mb-8 text-lg">
            متأسفانه پرداخت شما با خطا مواجه شد و تراکنش تکمیل نشد.
          </p>

          {/* Transaction Details Card */}
          <div className="bg-primary-midnight rounded-lg p-6 mb-8 border-2 border-red-500 text-right">
            <h2 className="text-xl font-bold text-primary-sky mb-4 flex items-center gap-2">
              <span>📋</span>
              <span>جزئیات تراکنش</span>
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

              {/* Items List (Simplified) */}
              <div className="bg-primary-oxfordblue rounded p-4 border border-primary-cerulean">
                <p className="text-primary-aero mb-3 font-bold">موارد:</p>
                <ul className="space-y-2">
                  {paymentContext.items.map((item, index) => (
                    <li key={index} className="text-primary-aero flex items-center gap-2">
                      <span className="text-gray-500">○</span>
                      <span>{getItemDisplayName(item)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Amount */}
              <div className="bg-red-900 bg-opacity-30 rounded p-4 border-2 border-red-500">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-red-300 text-lg">مبلغ:</span>
                  <span className="font-pixel font-bold text-red-400 text-2xl" dir="ltr">
                    {formatPrice(paymentContext.amount)} تومان
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="bg-primary-oxfordblue rounded p-3 border border-red-500">
                <div className="flex justify-between items-center">
                  <span className="text-primary-aero">وضعیت:</span>
                  <span className="font-bold text-red-400">❌ ناموفق</span>
                </div>
              </div>
            </div>
          </div>

          {/* Error Info Box */}
          <div className="bg-red-900 bg-opacity-30 rounded-lg p-5 mb-6 border border-red-500 text-right">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <p className="text-red-300 font-bold mb-2">دلایل احتمالی شکست پرداخت:</p>
              </div>
            </div>
            <ul className="text-red-300 text-sm space-y-2 mr-8">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>موجودی کافی در حساب شما وجود نداشت</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>تراکنش توسط شما لغو شد</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>خطا در ارتباط با درگاه پرداخت</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>اطلاعات کارت بانکی نادرست بود</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>محدودیت تراکنش از سمت بانک</span>
              </li>
            </ul>
          </div>

          {/* Help Info Box */}
          <div className="bg-blue-900 bg-opacity-30 rounded-lg p-4 mb-6 border border-blue-500">
            <div className="flex items-start gap-3 text-right">
              <span className="text-2xl">💡</span>
              <div className="flex-1">
                <p className="text-blue-300 text-sm">
                  <strong>نکته:</strong> اگر مبلغ از حساب شما کسر شده ولی پرداخت موفق نبوده، تا ۷۲
                  ساعت آینده به حساب شما بازگردانده می‌شود.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="pixel-btn pixel-btn-warning py-3 px-8 w-full text-lg"
            >
              🔄 تلاش مجدد برای پرداخت
            </button>

            <button
              onClick={handleGoToPanel}
              className="pixel-btn pixel-btn-secondary py-3 px-8 w-full"
            >
              بازگشت به پنل کاربری
            </button>
          </div>

          {/* Support Contact (Optional) */}
          <div className="mt-6 text-center">
            <p className="text-primary-aero text-sm">در صورت بروز مشکل با پشتیبانی تماس بگیرید</p>
          </div>
        </div>
      </PixelFrame>
    </div>
  );
}
