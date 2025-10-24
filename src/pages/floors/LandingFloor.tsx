import { forwardRef, useState } from 'react';
import { FaChevronDown, FaGamepad } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import bgLanding from '@/assets/bkg-landing.png';
import nameImg from '@/assets/name.png'; // 👈 تصویر جدیدت
import { SocialLinks } from '@/components/SocialLinks';
import { useAuth } from '@/context/AuthContext';
import LoginModal from '@/pages/modals/LoginModal';

const LandingFloor = forwardRef<HTMLElement>((props, ref) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
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

          <button
            onClick={() => {
              if (isAuthenticated) {
                navigate('/panel');
              } else {
                setShowLoginModal(true);
              }
            }}
            className="pixel-btn pixel-btn-secondary relative overflow-hidden bg-gradient-to-r text-white py-5 px-8 text-3xl font-extrabold rounded-2xl shadow-xl animate-pulse hover:scale-110 transition-transform duration-300"
          >
            <span className="relative z-10">ثبت‌نام در رویداد</span>
            <span className="absolute inset-0 bg-white/20 blur-xl opacity-0 hover:opacity-60 transition-opacity duration-700"></span>
          </button>
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
