import { useState } from 'react';
import { FaCopy, FaCheckCircle, FaTelegramPlane, FaTicketAlt, FaBullhorn } from 'react-icons/fa';

import { Countdown } from '@/components/Countdown';
import PixelModal from '@/components/modals/PixelModal';

interface PromoModalProps {
  onClose: () => void;
  deadline: Date;
  discountCode: string;
  supportUrl: string;
  channelUrl: string;
}

export default function PromoModal({
  onClose,
  deadline,
  discountCode,
  supportUrl,
  channelUrl,
}: PromoModalProps) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(discountCode);
      setCopied(true);
      setCopyError(null);
      window.setTimeout(() => setCopied(false), 2500);
    } catch (error) {
      console.warn('Failed to copy discount code', error);
      setCopyError('کپی کد ممکن نشد. لطفا به صورت دستی انتخاب کنید.');
      setCopied(false);
    }
  };

  return (
    <PixelModal onClose={onClose} closeOnOverlayClick={false}>
      <div className="flex flex-col gap-6 pb-8 text-right">
        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">
            LAST CALL
          </span>
          <h2 className="text-3xl font-black text-white leading-snug">
            ⏰ آخرین لحظات ثبت‌نام با ۳۰٪ تخفیف
          </h2>
          <p className="text-sm md:text-base leading-relaxed text-slate-200">
            شمارش معکوس رویداد در حال تمام شدن است! همین الان ثبت‌نامت را نهایی کن تا با وارد کردن
            این کد، ۳۰٪ تخفیف ویژه دریافت کنی. ظرفیت‌ها در حال تکمیل شدن است؛ فرصت را از دست نده.
          </p>
        </div>

        <div className="rounded-2xl border border-primary-cerulean/40 bg-slate-900/70 p-6 shadow-inner shadow-primary-midnight/40">
          <div className="flex flex-col items-center gap-4">
            <Countdown target={deadline} />

            <div className="w-full bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 rounded-2xl border border-primary-aero/40 px-6 py-4 flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <div className="flex items-center gap-3 text-slate-100">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-sky/10 border border-primary-sky/30 text-primary-sky">
                  <FaTicketAlt className="text-2xl" />
                </span>
                <div className="text-right">
                  <p className="text-xs text-slate-300/80">کد تخفیف ۳۰٪</p>
                  <p className="font-black text-2xl tracking-[0.35em]" dir="ltr">
                    {discountCode}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className={`pixel-btn flex w-full md:w-auto items-center justify-center gap-2 px-4 py-3 text-sm font-bold ${
                  copied
                    ? 'pixel-btn-primary bg-emerald-600 border-emerald-400'
                    : 'pixel-btn-secondary'
                }`}
              >
                {copied ? (
                  <>
                    <FaCheckCircle className="text-base" />
                    <span>کپی شد!</span>
                  </>
                ) : (
                  <>
                    <FaCopy className="text-base" />
                    <span>کپی کد</span>
                  </>
                )}
              </button>
            </div>

            {copyError && <p className="text-xs text-red-300">{copyError}</p>}
          </div>
        </div>

        <div className="flex flex-col gap-3 text-slate-200">
          <p>
            بعد از کپی کردن کد، مستقیماً از طریق پنل کاربری، در گیم‌جم مجازی تیم تشکیل بده و ثبت‌نام
            را همین حالا تکمیل کن تا تخفیف برایت اعمال شود. اگر جایی گیر کردی یا سوالی داشتی، تیم
            پشتیبانی آماده است کمک کند و در کانال هم لحظه‌ای مسیر را دنبال کن.
          </p>
          <a
            href={supportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pixel-btn pixel-btn-primary flex items-center justify-center gap-2 py-4 text-lg font-black"
          >
            <FaTelegramPlane className="text-xl" />
            <span>سوال فوری از پشتیبانی</span>
          </a>
          <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pixel-btn pixel-btn-secondary flex items-center justify-center gap-2 py-3 text-base font-bold"
          >
            <FaBullhorn className="text-lg" />
            <span>کانال رویداد</span>
          </a>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          * اگر این پنجره را ببندی، فعلاً دوباره سراغت نمی‌آید تا در آرامش تصمیم بگیری.
        </p>
      </div>
    </PixelModal>
  );
}
