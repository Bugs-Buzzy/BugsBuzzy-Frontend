import { useState, useEffect } from 'react';
import {
  FaHome,
  FaGamepad,
  FaLaptopCode,
  FaGem,
  FaUsers,
  FaUser,
  FaSignInAlt,
  FaQuestion,
  FaTelegramPlane,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

import PixelFrame from '@/components/PixelFrame';
import { TELEGRAM_CHANNEL_URL } from '@/constants/links';
import { useAuth } from '@/context/AuthContext';
import LoginModal from '@/pages/modals/LoginModal';

interface HUDProps {
  onFloorNavigate: (_index: number, _scroll: boolean) => void;
  currentFloor: number;
}
export default function HUD({ onFloorNavigate, currentFloor }: HUDProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showFastTravel, setShowFastTravel] = useState(true);
  const { isAuthenticated } = useAuth();
  const [showContactPopup, setShowContactPopup] = useState(false);

  useEffect(() => {
    let hideTimeout: ReturnType<typeof setTimeout>;

    const handleUserActivity = () => {
      setShowFastTravel(true);
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
          setShowFastTravel(false);
        }
      }, 2000);
    };

    window.addEventListener('scroll', handleUserActivity, true);
    window.addEventListener('touchmove', handleUserActivity);
    window.addEventListener('wheel', handleUserActivity);

    return () => {
      window.removeEventListener('scroll', handleUserActivity, true);
      window.removeEventListener('touchmove', handleUserActivity);
      window.removeEventListener('wheel', handleUserActivity);
      clearTimeout(hideTimeout);
    };
  }, []);

  const floors = [
    { name: 'باگزبازی', Icon: FaHome },
    // { name: 'رقابت حضوری', Icon: FaTrophy },
    { name: 'گیم‌جم', Icon: FaGamepad, highlighted: true },
    { name: 'سوالات متداول', Icon: FaQuestion },
    { name: 'کارگاه‌ها', Icon: FaLaptopCode },
    { name: 'حامی رویداد', Icon: FaGem },
    { name: 'تیم برگزاری', Icon: FaUsers },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="pointer-events-auto flex justify-between items-start p-3 md:p-6">
          <button
            onClick={() => setShowContactPopup(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md transition-all text-sm md:text-base"
          >
            درباره ما
          </button>

          <div className="flex items-center gap-2 md:gap-3">
            <a
              href={TELEGRAM_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg transition-colors duration-200"
              title="کانال تلگرام باگزبازی"
            >
              <FaTelegramPlane className="text-2xl md:text-3xl" />
            </a>

            {isAuthenticated ? (
              <Link
                to="/panel"
                className="pixel-btn pixel-btn-primary flex items-center gap-1 md:gap-2 text-sm md:text-base py-2 px-3 md:py-3 md:px-4 font-normal"
              >
                <FaUser />
                <span className="hidden sm:inline">پنل کاربری</span>
              </Link>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="pixel-btn pixel-btn-secondary flex items-center gap-1 md:gap-2 text-sm md:text-base py-2 px-3 md:py-3 md:px-4 font-normal"
              >
                <FaSignInAlt />
                <span className="hidden sm:inline">ورود</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Fast Travel */}
      <div
        className={`fixed left-1/2 -translate-x-1/2 bottom-4 md:left-auto md:translate-x-0 md:right-8 md:top-1/2 md:-translate-y-1/2 z-50 pointer-events-none transition-all duration-300 ${
          showFastTravel
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 md:translate-y-0 md:opacity-100'
        }`}
      >
        <PixelFrame className="pointer-events-auto bg-black bg-opacity-80">
          <div className="flex md:flex-col gap-2 md:gap-4">
            {floors.map((floor, index) => {
              const FloorIcon = floor.Icon;
              const isActive = currentFloor === index;
              const highlightedClasses = floor.highlighted
                ? 'ring-1 ring-yellow-400 animate-pulse'
                : '';
              const baseClasses =
                'pixel-btn p-2 flex flex-col items-center gap-1 text-xs transition-all bg-black bg-opacity-80';
              const activeClasses = isActive
                ? 'text-orange-400 border-orange-400 border-2'
                : 'text-white md:hover:bg-gray-700';
              return (
                <button
                  key={index}
                  onClick={() => onFloorNavigate(index, true)}
                  className={`${baseClasses} ${activeClasses} ${highlightedClasses}`}
                  title={floor.name}
                >
                  <FloorIcon className="text-xl md:text-2xl" />
                  <span className="font-normal hidden md:block text-xs">{floor.name}</span>
                </button>
              );
            })}
          </div>
        </PixelFrame>
      </div>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

      {showContactPopup && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowContactPopup(false)}
        >
          <div
            className="bg-gray-900 border-2 border-gray-700 rounded-xl shadow-2xl p-6 w-full max-w-sm text-white relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4 text-center">درباره ما</h2>

            <p className="mb-2 text-sm">ایمیل: info@bugsbuzzy.ir</p>
            <p className="mb-2 text-sm">شماره تماس: 09155709655</p>
            <p className="text-sm leading-relaxed">
              آدرس: دانشگاه صنعتی شریف، دانشکده مهندسی کامپیوتر، طبقه همکف، اتاق انجمن علمی
            </p>

            <button
              className="mt-5 w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition-all"
              onClick={() => setShowContactPopup(false)}
            >
              بستن
            </button>
          </div>
        </div>
      )}
      {showContactPopup && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowContactPopup(false)}
        >
          <div
            className="bg-gray-900 border-2 border-gray-700 rounded-xl shadow-2xl p-6 w-full max-w-sm text-white relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-6">درباره ما</h2>

            <div className="mb-4">
              <p className="text-base font-bold mb-1">ایمیل</p>
              <p className="text-sm">info@bugsbuzzy.ir</p>
            </div>

            <div className="mb-4">
              <p className="text-base font-bold mb-1">شماره تماس</p>
              <p className="text-sm">09155709655</p>
            </div>

            <div className="mb-4">
              <p className="text-base font-bold mb-1">آدرس</p>
              <p className="text-sm leading-relaxed">
                دانشگاه صنعتی شریف، دانشکده مهندسی کامپیوتر، طبقه همکف، اتاق انجمن علمی
              </p>
            </div>

            <button
              className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition-all"
              onClick={() => setShowContactPopup(false)}
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </>
  );
}
