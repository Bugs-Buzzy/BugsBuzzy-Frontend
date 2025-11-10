import React from 'react';
import { FaHeadset } from 'react-icons/fa';
import { FaLinkedin, FaTelegram } from 'react-icons/fa6';

import { LINKEDIN_URL, TELEGRAM_CHANNEL_URL, TELEGRAM_SUPPORT_URL } from '@/constants/links';

export function SocialLinks() {
  return (
    <div className="mt-16 flex flex-wrap items-center justify-center gap-5 text-orange-300">
      <a
        href={TELEGRAM_CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-1 transition-transform hover:scale-110"
        aria-label="کانال تلگرام باگزبازی"
      >
        <FaTelegram className="text-3xl md:text-4xl" />
        <span className="text-[11px] font-medium text-white/80">کانال</span>
      </a>
      <a
        href={TELEGRAM_SUPPORT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-1 transition-transform hover:scale-110"
        aria-label="پشتیبانی تلگرام باگزبازی"
      >
        <FaHeadset className="text-3xl md:text-4xl" />
        <span className="text-[11px] font-medium text-white/80">پشتیبانی</span>
      </a>
      <a
        href={LINKEDIN_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-1 transition-transform hover:scale-110"
        aria-label="LinkedIn"
      >
        <FaLinkedin className="text-3xl md:text-4xl" />
        <span className="text-[11px] font-medium text-white/80">LinkedIn</span>
      </a>
    </div>
  );
}
