import { forwardRef } from 'react';
import { FaChevronDown, FaGamepad, FaLinkedin, FaTelegram } from 'react-icons/fa';

import bgLanding from '@/assets/bkg-landing.png';
import nameImg from '@/assets/name.png'; // 👈 تصویر جدیدت

const LandingFloor = forwardRef<HTMLElement>((props, ref) => {
  return (
    <section
      ref={ref}
      className="floor bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgLanding})` }}
    >
      <div className="flex flex-col items-center justify-center h-full relative">
        <div className="text-center space-y-8 -translate-y-12 md:-translate-y-16">
          <img src={nameImg} alt="BugsBuzzy" className="w-[500px] md:w-[800px] h-auto" />

          <button className="pixel-btn pixel-btn-secondary py-4 px-8 text-xl">
            ثبت‌نام در رویداد
          </button>

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
        </div>

        <div className="absolute bottom-10 animate-bounce flex flex-col items-center gap-1">
          <FaGamepad className="text-5xl text-secondary-ramzinex" />
          <FaChevronDown className="text-3xl text-white" />
          <p className="text-white font-pixel text-sm mt-1">اسکرول کنید</p>
        </div>
      </div>
    </section>
  );
});

LandingFloor.displayName = 'LandingFloor';

export default LandingFloor;
