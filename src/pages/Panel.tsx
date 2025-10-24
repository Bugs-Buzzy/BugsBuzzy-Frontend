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
    <div className="min-h-screen bg-gradient-to-br from-primary-midnight via-primary-oxfordblue to-gray-900">
      <div className="flex flex-col md:flex-row min-h-screen">
        <PixelFrame className="w-full md:w-64 bg-black bg-opacity-50 flex flex-col">
          <div className="mb-4 md:mb-8">
            <h1 className="text-xl md:text-3xl font-bold text-white font-pixel">پنل کاربری</h1>
            <p className="text-gray-400 text-xs md:text-sm mt-2 font-pixel truncate">
              {user?.email}
            </p>
          </div>

          <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible flex-1">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
									flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 md:p-3 rounded pixel-btn font-normal whitespace-nowrap
                    ${
                      item.enabled
                        ? 'pixel-btn-primary'
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed pointer-events-none border-gray-700'
                    }
                  `}
                >
                  <IconComponent className="text-xl md:text-2xl" />
                  <span className="font-bold text-xs md:text-base">{item.label}</span>
                  {!item.enabled && <FaLock className="md:mr-auto" />}
                </Link>
              );
            })}
          </nav>

          <div className="flex md:flex-col gap-2 mt-4 md:mt-8">
            <Link
              to="/"
              className="flex-1 md:w-full pixel-btn pixel-btn-primary text-center py-2 md:py-3 text-sm md:text-base flex items-center justify-center gap-2"
            >
              <FaArrowLeft />
              <span>بازگشت</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex-1 md:w-full pixel-btn pixel-btn-danger py-2 md:py-3 text-sm md:text-base flex items-center justify-center gap-2"
            >
              <FaSignOutAlt />
              <span>خروج</span>
            </button>
          </div>
        </PixelFrame>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
