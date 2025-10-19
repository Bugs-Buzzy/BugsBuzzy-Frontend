import { forwardRef } from 'react';
import { FaChevronDown, FaGamepad } from 'react-icons/fa';

import bgLanding from '@/assets/bkg-landing.png';

const LandingFloor = forwardRef<HTMLElement>((props, ref) => {
  return (
    <section
      ref={ref}
      className="floor bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgLanding})` }}
    >
      <div className="flex flex-col items-center justify-center h-full relative">
        <div className="text-center space-y-8">
          <h1 className="text-6xl font-bold text-white font-pixel">BugsBuzzy</h1>
          <p className="text-2xl text-green-200 font-pixel">به جنگل باگ‌ها خوش آمدید</p>

          <button className="pixel-btn pixel-btn-secondary py-4 px-8 text-xl">
            ثبت‌نام در رویداد
          </button>
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
