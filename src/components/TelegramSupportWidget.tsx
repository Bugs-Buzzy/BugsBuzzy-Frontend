import { useEffect, useState } from 'react';
import { FaTelegramPlane, FaHeadset, FaTimes } from 'react-icons/fa';

import PixelFrame from '@/components/PixelFrame';
import { TELEGRAM_SUPPORT_URL } from '@/constants/links';
const HIDE_STORAGE_KEY = 'bugsbuzzy.telegramWidget.hiddenUntil';
const HIDE_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours

interface TelegramSupportWidgetProps {
  supportUrl?: string;
}

export default function TelegramSupportWidget({
  supportUrl = TELEGRAM_SUPPORT_URL,
}: TelegramSupportWidgetProps) {
  const [isWidgetVisible, setIsWidgetVisible] = useState(false);
  const [showLauncher, setShowLauncher] = useState(false);

  useEffect(() => {
    try {
      const storedHiddenUntil = localStorage.getItem(HIDE_STORAGE_KEY);
      if (storedHiddenUntil && Number(storedHiddenUntil) > Date.now()) {
        setShowLauncher(true);
        return;
      }
    } catch (error) {
      console.warn('Unable to read Telegram widget state from storage', error);
    }

    const showTimer = window.setTimeout(() => setIsWidgetVisible(true), 1500);

    return () => window.clearTimeout(showTimer);
  }, []);

  const openWidget = () => {
    setIsWidgetVisible(true);
    setShowLauncher(false);
    try {
      localStorage.removeItem(HIDE_STORAGE_KEY);
    } catch (error) {
      console.warn('Unable to reset Telegram widget state', error);
    }
  };

  const handleClose = () => {
    setIsWidgetVisible(false);
    setShowLauncher(true);
    try {
      localStorage.setItem(HIDE_STORAGE_KEY, String(Date.now() + HIDE_DURATION_MS));
    } catch (error) {
      console.warn('Unable to persist Telegram widget state', error);
    }
  };

  const containerZIndex = isWidgetVisible ? 'z-[65]' : 'z-[45] sm:z-[60]';

  return (
    <div
      className={`fixed right-3 bottom-24 flex flex-col items-end gap-3 pointer-events-none sm:right-6 sm:bottom-6 ${containerZIndex}`}
    >
      {isWidgetVisible && (
        <div className="pointer-events-auto w-[min(100vw-3rem,340px)] transition-all duration-200 ease-out relative">
          <button
            type="button"
            className="absolute left-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg shadow-rose-900/50 transition-transform duration-150 hover:scale-105 focus:outline-none z-10 sm:-top-4 sm:-left-4"
            aria-label="بستن پشتیبانی تلگرام"
            onClick={handleClose}
          >
            <FaTimes className="text-base" />
          </button>
          <PixelFrame
            className="relative bg-slate-950/95 shadow-xl shadow-primary-cerulean/30 backdrop-blur-md rounded-3xl"
            padding={20}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-sky-400 to-sky-600 text-white shadow-lg shadow-sky-900/40 sm:mx-0">
                <span
                  className="absolute inset-0 rounded-2xl bg-sky-200/30 blur-lg"
                  aria-hidden="true"
                />
                <FaHeadset className="absolute -left-1.5 -top-1.5 text-sm text-sky-100 opacity-80" />
                <FaTelegramPlane className="text-3xl" />
              </div>

              <div className="flex-1 text-right space-y-3">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-300">
                    Support
                  </p>
                  <h3 className="text-xl font-black leading-tight text-white sm:text-2xl">
                    تیم پشتیبانی تلگرام باگزبازی
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-slate-100/90 sm:text-[15px]">
                  سوالی داری؟ همین الان پیام بده تا تیم ما در لحظه راهنماییت کنه. سریع‌ترین راه برای
                  ارتباط با ماست.
                </p>
                <a
                  href={supportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pixel-btn pixel-btn-primary flex w-full items-center justify-center gap-2 rounded-xl py-3 text-base font-bold shadow-lg shadow-primary-cerulean/20 transition-transform duration-150 hover:scale-[1.02]"
                >
                  <FaTelegramPlane className="text-lg" />
                  <span>گفت‌وگو در تلگرام</span>
                </a>
              </div>
            </div>
          </PixelFrame>
        </div>
      )}

      {showLauncher && !isWidgetVisible && (
        <button
          type="button"
          onClick={openWidget}
          className="pointer-events-auto flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-600 via-sky-500 to-sky-700 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-sky-900/40 transition-transform duration-150 hover:scale-105 focus:outline-none sm:px-5"
          aria-label="باز کردن پشتیبانی تلگرام"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
            <FaTelegramPlane className="text-lg" />
          </span>
          <span className="hidden sm:inline">پشتیبانی تلگرام</span>
          <span className="sm:hidden">پشتیبانی</span>
        </button>
      )}
    </div>
  );
}
