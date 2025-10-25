import { useState, useEffect } from 'react';
import {
  FaHome,
  FaTrophy,
  FaGamepad,
  FaLaptopCode,
  FaGem,
  FaUsers,
  FaUser,
  FaSignInAlt,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

import coinGif from '@/assets/coin.gif';
import PixelModal from '@/components/modals/PixelModal';
import PixelFrame from '@/components/PixelFrame';
import { useAuth } from '@/context/AuthContext';
import LoginModal from '@/pages/modals/LoginModal';

interface HUDProps {
  onFloorNavigate: (_index: number) => void;
  currentFloor: number;
}
export default function HUD({ onFloorNavigate, currentFloor }: HUDProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showFastTravel, setShowFastTravel] = useState(true);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { isAuthenticated } = useAuth();

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
    { name: 'رقابت حضوری', Icon: FaTrophy },
    { name: 'گیم‌جم', Icon: FaGamepad },
    { name: 'کارگاه‌ها', Icon: FaLaptopCode },
    { name: 'حامی رویداد', Icon: FaGem },
    { name: 'تیم برگزاری', Icon: FaUsers },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="pointer-events-auto flex justify-between items-start p-3 md:p-6">
          {/* 👇 سکه‌ی تعاملی */}
          <div
            className="cursor-pointer"
            onClick={() => setShowMiniGame(true)}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <img
              src={coinGif}
              alt="BugsBuzzy Coin"
              className={`h-12 md:h-20 w-auto select-none ${
                isHovering ? 'animate-none opacity-80' : 'opacity-100'
              }`}
              style={{
                animationPlayState: isHovering ? 'paused' : 'running',
              }}
            />
          </div>

          <div>
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
              const baseClasses =
                'pixel-btn p-2 flex flex-col items-center gap-1 text-xs transition-all bg-black bg-opacity-80';
              const activeClasses = isActive
                ? 'text-orange-400 border-orange-400 border-2'
                : 'text-white md:hover:bg-gray-700';
              return (
                <button
                  key={index}
                  onClick={() => onFloorNavigate(index)}
                  className={`${baseClasses} ${activeClasses}`}
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

      {/* 🎮 Mini Game Modal */}
      {showMiniGame && (
        <PixelModal onClose={() => setShowMiniGame(false)}>
          <div className="text-center">
            <h2 className="font-pixel text-xl text-white mb-4">مینی‌گیم</h2>
            <p className="text-gray-300 mb-4"></p>

            {/* داخل قاب بازی */}
            <p>Coming Soon...</p>
          </div>
        </PixelModal>
      )}
    </>
  );
}
