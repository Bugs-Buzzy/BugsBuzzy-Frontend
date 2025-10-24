import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import PixelFrame from '@/components/PixelFrame';
import { useAuth } from '@/context/AuthContext';
import { teamsService, type Team } from '@/services/teams.service';

interface DashboardStats {
  profileCompleted: boolean;
  inPersonTeam: Team | null;
  onlineTeam: Team | null;
  inPersonRegistered: boolean;
  onlineRegistered: boolean;
  inPersonPaid: boolean;
  onlinePaid: boolean;
  purchasedItems: string[];
  totalSpent: number;
}

export default function Dashboard() {
  const { user, profileCompleted, isVerified } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    profileCompleted: false,
    inPersonTeam: null,
    onlineTeam: null,
    inPersonRegistered: false,
    onlineRegistered: false,
    inPersonPaid: false,
    onlinePaid: false,
    purchasedItems: [],
    totalSpent: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user) return;

      try {
        const [teamsData, purchasedData] = await Promise.all([
          teamsService.getAllTeams(),
          import('@/services/payments.service').then((m) => m.paymentsService.getPurchasedItems()),
        ]);

        const inPersonTeam = teamsData.teams.find((t) => t.team_type === 'in_person');
        const onlineTeam = teamsData.teams.find((t) => t.team_type === 'online');

        setStats({
          profileCompleted,
          inPersonTeam: inPersonTeam || null,
          onlineTeam: onlineTeam || null,
          inPersonRegistered: !!inPersonTeam,
          onlineRegistered: !!onlineTeam,
          inPersonPaid: purchasedData.purchased_items.includes('inperson'),
          onlinePaid: purchasedData.purchased_items.includes('gamejam'),
          purchasedItems: purchasedData.purchased_items,
          totalSpent: purchasedData.total_spent,
        });
      } catch (error) {
        console.error('خطا در بارگذاری داشبورد:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user, profileCompleted]);

  if (!isVerified) {
    return (
      <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-primary-sky mb-4">⚠️ ایمیل تایید نشده</h2>
          <p className="text-primary-aero mb-4">
            لطفاً ابتدا ایمیل خود را تایید کنید تا به امکانات پنل دسترسی داشته باشید.
          </p>
        </div>
      </PixelFrame>
    );
  }

  if (loading) {
    return (
      <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
        <div className="text-center py-8">
          <p className="text-primary-aero">در حال بارگذاری...</p>
        </div>
      </PixelFrame>
    );
  }

  const nextPresentation = {
    title: '',
    speaker: '',
    date: '',
    time: '',
    platform: '',
  };

  return (
    <div className="space-y-6">
      <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-primary-sky mb-2">📊 داشبورد</h1>
            <p className="text-primary-aero">
              به پنل کاربری BugsBuzzy خوش آمدید، <span className="font-pixel">{user?.email}</span>
            </p>
          </div>
          <div className="text-left">
            <p className="text-gray-400 text-sm mb-1">پروفایل</p>
            <p className="text-white font-normal text-lg">
              {user?.first_name && user?.last_name
                ? `${user.first_name} ${user.last_name}`
                : 'ناقص'}
            </p>
            <Link
              to="/panel/profile"
              className="text-primary-aero hover:text-primary-sky text-sm underline mt-1 inline-block"
            >
              {profileCompleted ? 'ویرایش پروفایل' : 'تکمیل پروفایل →'}
            </Link>
          </div>
        </div>
      </PixelFrame>

      {!profileCompleted && (
        <PixelFrame className="bg-secondary-golden bg-opacity-20 border-secondary-orangePantone">
          <div className="flex items-start gap-4">
            <span className="text-3xl">⚠️</span>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-secondary-orangeCrayola mb-2">
                پروفایل تکمیل نشده
              </h3>
              <p className="text-primary-aero mb-4">
                برای دسترسی به امکانات ثبت‌نام و تشکیل تیم، ابتدا پروفایل خود را تکمیل کنید.
              </p>
              <Link
                to="/panel/profile"
                className="pixel-btn pixel-btn-primary inline-block px-6 py-2"
              >
                تکمیل پروفایل
              </Link>
            </div>
          </div>
        </PixelFrame>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🏆</span>
            <h2 className="text-xl font-bold text-primary-sky">رقابت حضوری</h2>
          </div>
          <div className="space-y-2 text-primary-aero">
            <div>
              <div className="flex justify-between">
                <span>وضعیت پرداخت:</span>
                <span className={stats.inPersonPaid ? 'text-green-400' : 'text-gray-400'}>
                  {stats.inPersonPaid ? '✅ پرداخت شده' : '❌ پرداخت نشده'}
                </span>
              </div>
              {stats.inPersonPaid && (
                <p className="text-xs text-primary-aero mt-1">
                  ناهار: روز اول {stats.purchasedItems.includes('thursday_lunch') ? '✓' : '✗'} | روز
                  دوم {stats.purchasedItems.includes('friday_lunch') ? '✓' : '✗'}
                </p>
              )}
            </div>
            <div className="flex justify-between">
              <span>وضعیت تیم:</span>
              <span className={stats.inPersonRegistered ? 'text-green-400' : 'text-gray-400'}>
                {stats.inPersonRegistered ? '✅ دارد' : '❌ ندارد'}
              </span>
            </div>
            {stats.inPersonTeam && (
              <div className="flex justify-between text-sm">
                <span>نام تیم:</span>
                <span className="text-white font-normal">{stats.inPersonTeam.name}</span>
              </div>
            )}
          </div>
          {profileCompleted && (
            <Link
              to="/panel/inperson"
              className="pixel-btn pixel-btn-primary w-full mt-4 text-center block"
            >
              {stats.inPersonRegistered ? 'مشاهده جزئیات' : 'ثبت‌نام'}
            </Link>
          )}
        </PixelFrame>

        <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🎮</span>
            <h2 className="text-xl font-bold text-primary-sky">گیم‌جم مجازی</h2>
          </div>
          <div className="space-y-2 text-primary-aero">
            <div className="flex justify-between">
              <span>وضعیت تیم:</span>
              <span className={stats.onlineRegistered ? 'text-green-400' : 'text-gray-400'}>
                {stats.onlineRegistered ? '✅ دارد' : '❌ ندارد'}
              </span>
            </div>
            {stats.onlineTeam && (
              <>
                <div className="flex justify-between text-sm">
                  <span>نام تیم:</span>
                  <span className="text-white font-normal">{stats.onlineTeam.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>نوع:</span>
                  <span className="text-primary-aero">
                    {stats.onlinePaid ? '💰 تیم پولی (سازنده)' : '🆓 تیم رایگان (عضو)'}
                  </span>
                </div>
              </>
            )}
          </div>
          {profileCompleted && (
            <Link
              to="/panel/gamejam"
              className="pixel-btn pixel-btn-primary w-full mt-4 text-center block"
            >
              {stats.onlineRegistered ? 'مشاهده جزئیات' : 'ثبت‌نام'}
            </Link>
          )}
        </PixelFrame>

        <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📢</span>
            <h2 className="text-xl font-bold text-primary-sky">اطلاعیه‌ها</h2>
          </div>
          <p className="text-primary-aero mb-4">آخرین اخبار و اطلاعیه‌های رویداد</p>
          <Link
            to="/panel/announcements"
            className="pixel-btn pixel-btn-primary w-full text-center block"
          >
            مشاهده اطلاعیه‌ها
          </Link>
        </PixelFrame>

        <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📺</span>
            <h2 className="text-xl font-bold text-primary-sky">ارائه پیش‌رو</h2>
          </div>
          <div className="space-y-3">
            <div>
              <h3 className="text-white font-bold mb-2">{nextPresentation.title}</h3>
              <div className="text-primary-aero text-sm space-y-1">
                <p>👤 {nextPresentation.speaker}</p>
                <p className="font-pixel" dir="ltr">
                  📅 {nextPresentation.date} | ⏰ {nextPresentation.time}
                </p>
                <p>🎥 {nextPresentation.platform}</p>
              </div>
            </div>
            <Link
              to="/panel/presentations"
              className="pixel-btn pixel-btn-primary w-full text-center block"
            >
              مشاهده همه ارائه‌ها
            </Link>
          </div>
        </PixelFrame>
      </div>
    </div>
  );
}
