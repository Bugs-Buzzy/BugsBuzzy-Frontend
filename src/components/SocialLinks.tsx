import React from 'react';
import { FaLinkedin, FaTelegram } from 'react-icons/fa6';

export function SocialLinks() {
  return (
    <div className="flex gap-6 justify-center mt-16">
      <a
        href="https://t.me/BugsBuzzy"
        target="_blank"
        rel="noopener noreferrer"
        className="text-orange-400 hover:text-orange-300 transition-colors"
        aria-label="Telegram"
      >
        <FaTelegram className="text-4xl md:text-5xl" />
      </a>
      <a
        href="https://www.linkedin.com/company/bugs-buzzy"
        target="_blank"
        rel="noopener noreferrer"
        className="text-orange-400 hover:text-orange-300 transition-colors"
        aria-label="LinkedIn"
      >
        <FaLinkedin className="text-4xl md:text-5xl" />
      </a>
    </div>
  );
}
