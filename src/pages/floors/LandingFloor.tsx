import { forwardRef, useState } from 'react';
import { FaChevronDown, FaGamepad } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';

import bgLanding from '@/assets/bkg-landing.png';
import nameImg from '@/assets/name.png'; // 👈 تصویر جدیدت
import PixelFrame from '@/components/PixelFrame';
import { SocialLinks } from '@/components/SocialLinks';
// import { useAuth } from '@/context/AuthContext';
import LoginModal from '@/pages/modals/LoginModal';

const LandingFloor = forwardRef<HTMLElement>((props, ref) => {
  // const navigate = useNavigate();
  // const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  return (
    <section
      ref={ref}
      className="floor bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgLanding})` }}
    >
      <div className="flex flex-col items-center justify-center h-full relative">
        <div className="text-center space-y-8 -translate-y-12 md:-translate-y-16">
          <img src={nameImg} alt="BugsBuzzy" className="w-[500px] md:w-[800px] h-auto" />

          <PixelFrame className="bg-primary-oxfordblue/90 border-secondary-orangePantone max-w-md mx-4 md:mx-auto transform hover:scale-105 transition-transform duration-300">
            <div className="text-center p-3 md:p-5">
              <h2 className="text-xl md:text-2xl font-bold text-secondary-orangeCrayola mb-2 animate-pulse">
                رویداد به پایان رسید! 🏁
              </h2>
              <p className="text-white text-sm md:text-base leading-relaxed font-medium mb-4">
                با تشکر از همه شرکت‌کنندگان عزیز که در این رویداد همراه ما بودند.
                <br />
                به امید دیدار شما در رویدادهای آینده! 👋
              </p>
              <a
                href="https://dl.bugsbuzzy.ir/gamejam/"
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-btn pixel-btn-primary inline-flex items-center gap-2 text-sm px-4 py-2 hover:scale-105 transition-transform"
              >
                <FaGamepad className="text-lg" />
                <span>دانلود و تجربه بازی‌ها</span>
              </a>
            </div>
          </PixelFrame>

          <SocialLinks />
        </div>

        <div className="absolute bottom-10 animate-bounce flex flex-col items-center gap-1">
          <FaGamepad className="text-5xl text-secondary-ramzinex" />
          <FaChevronDown className="text-3xl text-white" />
          <p className="text-white font-pixel text-sm mt-1">اسکرول کنید</p>
        </div>
      </div>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </section>
  );
});

LandingFloor.displayName = 'LandingFloor';

export default LandingFloor;
