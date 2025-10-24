import {
  FaChartBar,
  FaUser,
  FaTrophy,
  FaGamepad,
  FaBullhorn,
  FaDesktop,
  FaArrowLeft,
  FaSignOutAlt,
  FaLock,
} from 'react-icons/fa';
import { Link, Outlet, useNavigate } from 'react-router-dom';

import { ParticlesCanvas } from '@/components/ParticlesCanvas';
import PixelFrame from '@/components/PixelFrame';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function Panel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { info } = useToast();

  const handleLogout = () => {
    logout();
    info('خارج شدید');
    navigate('/');
  };

  const menuItems = [
    { path: '/panel/dashboard', label: 'داشبورد', icon: FaChartBar, enabled: true },
    { path: '/panel/profile', label: 'پروفایل', icon: FaUser, enabled: true },
    { path: '/panel/inperson', label: 'رقابت حضوری', icon: FaTrophy, enabled: user?.is_verified },
    { path: '/panel/gamejam', label: 'گیم‌جم مجازی', icon: FaGamepad, enabled: user?.is_verified },
    { path: '/panel/announcements', label: 'اطلاعیه‌ها', icon: FaBullhorn, enabled: true },
    { path: '/panel/presentations', label: 'ارائه‌ها', icon: FaDesktop, enabled: true },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-primary-oxfordblue via-primary-midnight to-primary-cerulean overflow-hidden">
      <ParticlesCanvas />
      <div className="relative z-10 flex flex-col md:flex-row min-h-screen">
        {/* Sidebar - Desktop & Mobile */}
        <aside className="md:w-64 bg-black bg-opacity-70 backdrop-blur-sm border-l-4 border-primary-process md:border-l-0 md:border-r-4">
          <PixelFrame className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-primary-cerulean border-opacity-30">
              <h1 className="text-2xl md:text-3xl font-bold text-primary-sky font-pixel">
                پنل کاربری
              </h1>
              <p className="text-primary-aero text-xs md:text-sm mt-2 font-pixel truncate">
                {user?.email}
              </p>
            </div>

            {/* Navigation - Horizontal scroll on mobile, vertical on desktop */}
            <nav className="flex md:flex-col gap-2 p-2 md:p-4 overflow-x-auto md:overflow-x-visible flex-1 scrollbar-thin scrollbar-thumb-primary-cerulean scrollbar-track-transparent">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-3 
                      p-3 rounded transition-all duration-300 min-w-[80px] md:min-w-0
                      ${
                        item.enabled
                          ? 'pixel-btn pixel-btn-primary hover:scale-105 hover:shadow-lg hover:shadow-primary-process/50'
                          : 'bg-gray-800 text-gray-500 cursor-not-allowed pointer-events-none border border-gray-700 opacity-60'
                      }
                    `}
                  >
                    <IconComponent className="text-2xl md:text-xl" />
                    <span className="font-bold text-[10px] md:text-sm text-center md:text-right leading-tight">
                      {item.label}
                    </span>
                    {!item.enabled && <FaLock className="text-xs md:text-sm md:ml-auto" />}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-2 md:p-4 flex flex-row md:flex-col gap-2 border-t border-primary-cerulean border-opacity-30">
              <Link
                to="/"
                className="flex-1 pixel-btn pixel-btn-primary py-2 md:py-3 flex items-center justify-center gap-2 text-sm md:text-base hover:scale-105 transition-transform"
              >
                <FaArrowLeft className="text-lg" />
                <span className="hidden md:inline">بازگشت</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex-1 pixel-btn pixel-btn-danger py-2 md:py-3 flex items-center justify-center gap-2 text-sm md:text-base hover:scale-105 transition-transform"
              >
                <FaSignOutAlt className="text-lg" />
                <span className="hidden md:inline">خروج</span>
              </button>
            </div>
          </PixelFrame>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
