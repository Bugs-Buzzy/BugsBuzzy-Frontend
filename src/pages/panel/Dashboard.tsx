import { useEffect, useState } from 'react';
import {
  FaChartBar,
  FaExclamationTriangle,
  FaTrophy,
  FaGamepad,
  FaBullhorn,
  FaCheckCircle,
  FaTimesCircle,
  FaUsers,
  FaChalkboardTeacher,
  FaUser,
  FaCalendar,
  FaClock,
  FaMapMarker,
  FaVideo,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

import Loading from '@/components/Loading';
import PixelFrame from '@/components/PixelFrame';
import { useAuth } from '@/context/AuthContext';
import { announcementService, type UserAnnouncement } from '@/services/announcement.service';
import { gamejamService, type OnlineTeam } from '@/services/gamejam.service';
import { inpersonService, type InPersonTeam } from '@/services/inperson.service';
import { workshopService, type Workshop } from '@/services/workshop.service';

interface DashboardStats {
  profileCompleted: boolean;
  inPersonTeam: InPersonTeam | null;
  inPersonRegistered: boolean;
  inPersonPaid: boolean;
  onlineTeam: OnlineTeam | null;
  onlineRegistered: boolean;
  onlinePaid: boolean;
  purchasedItems: string[];
  totalSpent: number;
  workshops: Workshop[];
  nextWorkshop: Workshop | null;
  announcements: UserAnnouncement[];
  latestAnnouncement: UserAnnouncement | null;
}

const formatDateTime = (isoDate: string) => {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleString('fa-IR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const isRecentAnnouncement = (isoDate: string) => {
  const createdAt = new Date(isoDate);
  if (Number.isNaN(createdAt.getTime())) return false;
  const now = new Date();
  const diffInHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
  return diffInHours <= 4;
};

const markdownToPlainText = (markdown: string): string => {
  if (!markdown) return '';

  return (
    markdown
      // Remove headings
      .replace(/^#+\s+/gm, '')
      // Remove bold/italic
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/__(.+?)__/g, '$1')
      .replace(/_(.+?)_/g, '$1')
      // Remove links [text](url) -> text
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`(.+?)`/g, '$1')
      // Remove lists
      .replace(/^[*\-+]\s+/gm, '')
      .replace(/^\d+\.\s+/gm, '')
      // Remove images
      .replace(/!\[.+?\]\(.+?\)/g, '')
      // Remove HTML tags
      .replace(/<[^>]*>/g, '')
      // Clean up extra whitespace
      .replace(/\n\n+/g, '\n')
      .trim()
  );
};

export default function Dashboard() {
  const { user, profileCompleted, isVerified } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    profileCompleted: false,
    inPersonTeam: null,
    inPersonRegistered: false,
    inPersonPaid: false,
    onlineTeam: null,
    onlineRegistered: false,
    onlinePaid: false,
    purchasedItems: [],
    totalSpent: 0,
    workshops: [],
    nextWorkshop: null,
    announcements: [],
    latestAnnouncement: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user) return;

      try {
        const [inPersonTeamData, onlineTeamData, purchasedData, workshopsData, announcementsData] =
          await Promise.all([
            inpersonService.getMyTeam(),
            gamejamService.getMyTeam(),
            import('@/services/payments.service').then((m) =>
              m.paymentsService.getPurchasedItems(),
            ),
            workshopService.getWorkshops(),
            announcementService.getMyAnnouncements(),
          ]);

        const now = new Date();
        const upcomingWorkshops = workshopsData
          .filter((w) => new Date(w.start_datetime) > now)
          .sort(
            (a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime(),
          );

        // Find latest announcement (newest first)
        const sortedAnnouncements = [...announcementsData].sort((a, b) => {
          const dateA = new Date(a.announcement.created_at || a.created_at).getTime();
          const dateB = new Date(b.announcement.created_at || b.created_at).getTime();
          return dateB - dateA;
        });

        const latestAnnouncement = sortedAnnouncements[0] || null;

        setStats({
          profileCompleted,
          inPersonTeam: inPersonTeamData.team || null,
          inPersonRegistered: !!inPersonTeamData.team,
          inPersonPaid: purchasedData.purchased_items.includes('inperson'),
          onlineTeam: onlineTeamData.team || null,
          onlineRegistered: !!onlineTeamData.team,
          onlinePaid: purchasedData.purchased_items.includes('gamejam'),
          purchasedItems: purchasedData.purchased_items,
          totalSpent: purchasedData.total_spent,
          workshops: workshopsData,
          nextWorkshop: upcomingWorkshops[0] || null,
          announcements: announcementsData,
          latestAnnouncement,
        });
      } catch (error) {
        console.error('خطا در بارگذاری داشبورد:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user, profileCompleted]);

  const formatWorkshopDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('fa-IR'),
      time: date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  if (!isVerified) {
    return (
      <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FaExclamationTriangle className="text-secondary-orangeCrayola text-xl" />
            <h2 className="text-2xl font-bold text-primary-sky">ایمیل تایید نشده</h2>
          </div>
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
        <div className="py-8">
          <Loading text="در حال بارگذاری..." />
        </div>
      </PixelFrame>
    );
  }

  return (
    <div className="space-y-6">
      <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaChartBar className="text-primary-sky text-2xl" />
              <h1 className="text-3xl font-bold text-primary-sky">داشبورد</h1>
            </div>
            <p className="text-primary-aero">
              <span className="font-pixel">{user?.email}</span>
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
            <FaExclamationTriangle className="text-secondary-orangeCrayola text-2xl mt-1 flex-shrink-0" />
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
            <FaBullhorn className="text-primary-sky text-2xl" />
            <h2 className="text-xl font-bold text-primary-sky">اطلاعیه‌ها</h2>
          </div>
          {stats.latestAnnouncement &&
          isRecentAnnouncement(
            stats.latestAnnouncement.announcement.created_at || stats.latestAnnouncement.created_at,
          ) ? (
            <div className="space-y-3">
              <div className="bg-secondary-orangePantone/10 border border-secondary-orangeCrayola/40 rounded p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-secondary-orangePantone/20 text-secondary-orangeCrayola text-xs font-bold">
                    جدید
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDateTime(
                      stats.latestAnnouncement.announcement.created_at ||
                        stats.latestAnnouncement.created_at,
                    )}
                  </span>
                </div>
                <h3 className="text-white font-bold mb-2">
                  {stats.latestAnnouncement.announcement.title || 'بدون عنوان'}
                </h3>
                {stats.latestAnnouncement.announcement.description && (
                  <div className="text-primary-aero text-sm line-clamp-2 whitespace-pre-wrap break-words">
                    {markdownToPlainText(stats.latestAnnouncement.announcement.description)}
                  </div>
                )}
              </div>
              <Link
                to="/panel/announcements"
                className="pixel-btn pixel-btn-primary w-full text-center block"
              >
                مشاهده تمام اطلاعیه‌ها
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-primary-aero mb-4">آخرین اخبار و اطلاعیه‌های رویداد</p>
              <Link
                to="/panel/announcements"
                className="pixel-btn pixel-btn-primary w-full text-center block"
              >
                مشاهده اطلاعیه‌ها
              </Link>
            </div>
          )}
        </PixelFrame>

        <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
          <div className="flex items-center gap-3 mb-4">
            <FaGamepad className="text-primary-sky text-2xl" />
            <h2 className="text-xl font-bold text-primary-sky">گیم‌جم مجازی</h2>
          </div>
          {stats.onlineRegistered ? (
            <div className="space-y-2 text-primary-aero">
              <div className="flex justify-between items-center">
                <span>وضعیت پرداخت:</span>
                <span
                  className={`flex items-center gap-1 ${stats.onlinePaid ? 'text-green-400' : 'text-gray-400'}`}
                >
                  {stats.onlinePaid ? <FaCheckCircle /> : <FaTimesCircle />}
                  {stats.onlinePaid ? 'پرداخت شده' : 'پرداخت نشده'}
                </span>
              </div>
              {stats.onlineTeam && (
                <>
                  <div className="flex justify-between items-center text-sm">
                    <span>نام تیم:</span>
                    <span className="text-white font-normal flex items-center gap-1">
                      <FaUsers className="text-primary-aero" />
                      {stats.onlineTeam.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>تعداد اعضا:</span>
                    <span className="text-primary-aero font-pixel" dir="ltr">
                      {stats.onlineTeam.member_count}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>وضعیت:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        stats.onlineTeam.status === 'completed' ||
                        stats.onlineTeam.status === 'attended'
                          ? 'bg-green-900 bg-opacity-30 text-green-400 border border-green-600'
                          : stats.onlineTeam.status === 'active'
                            ? 'bg-blue-900 bg-opacity-30 text-blue-400 border border-blue-600'
                            : 'bg-gray-800 text-gray-400 border border-gray-600'
                      }`}
                    >
                      {stats.onlineTeam.status === 'completed'
                        ? 'کامل'
                        : stats.onlineTeam.status === 'attended'
                          ? 'شرکت کرده'
                          : stats.onlineTeam.status === 'active'
                            ? 'فعال'
                            : 'پرداخت نشده'}
                    </span>
                  </div>
                </>
              )}
              <div className="pixel-btn bg-gray-500 text-gray-300 cursor-not-allowed w-full mt-4 text-center block opacity-70">
                رقابت به پایان رسیده
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-400">شما در این رویداد ثبت‌نام نکرده‌اید</p>
              <p className="text-xs text-gray-500 mt-2">مهلت ثبت‌نام تمام شده است</p>
            </div>
          )}
        </PixelFrame>

        <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
          <div className="flex items-center gap-3 mb-4">
            <FaChalkboardTeacher className="text-primary-sky text-2xl" />
            <h2 className="text-xl font-bold text-primary-sky">کارگاه‌ها و ارائه‌ها</h2>
          </div>
          <div className="space-y-3">
            {stats.nextWorkshop ? (
              <div>
                <h3 className="text-white font-bold mb-3">{stats.nextWorkshop.title}</h3>
                <div className="text-primary-aero text-sm space-y-2">
                  {stats.nextWorkshop.presenter && (
                    <div className="flex items-center gap-2">
                      <FaUser className="text-primary-sky" />
                      <span>{stats.nextWorkshop.presenter}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <FaCalendar className="text-primary-sky" />
                    <span className="font-pixel" dir="ltr">
                      {formatWorkshopDateTime(stats.nextWorkshop.start_datetime).date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-primary-sky" />
                    <span className="font-pixel" dir="ltr">
                      {formatWorkshopDateTime(stats.nextWorkshop.start_datetime).time}
                    </span>
                  </div>
                  {stats.nextWorkshop.place && (
                    <div className="flex items-center gap-2">
                      <FaMapMarker className="text-primary-sky" />
                      <span>{stats.nextWorkshop.place}</span>
                    </div>
                  )}
                  {stats.nextWorkshop.vc_link && (
                    <div className="flex items-center gap-2">
                      <FaVideo className="text-primary-sky" />
                      <span>آنلاین</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-400">کارگاه آینده‌ای در برنامه نیست</p>
              </div>
            )}
            <Link
              to="/panel/presentations"
              className="pixel-btn pixel-btn-primary w-full text-center block"
            >
              مشاهده همه ({stats.workshops.length})
            </Link>
          </div>
        </PixelFrame>

        <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
          <div className="flex items-center gap-3 mb-4">
            <FaTrophy className="text-primary-sky text-2xl" />
            <h2 className="text-xl font-bold text-primary-sky">رقابت حضوری</h2>
          </div>
          <div className="space-y-2 text-primary-aero">
            <div className="flex justify-between items-center">
              <span>وضعیت:</span>
              <span
                className={`flex items-center gap-1 ${stats.inPersonTeam && stats.inPersonTeam.status == 'attended' ? 'text-green-400' : 'text-gray-400'}`}
              >
                {stats.inPersonTeam && stats.inPersonTeam.status == 'attended' ? (
                  <FaCheckCircle />
                ) : (
                  <FaTimesCircle />
                )}
                {stats.inPersonTeam && stats.inPersonTeam.status == 'attended'
                  ? 'شرکت کرده'
                  : 'شرکت نکرده'}
              </span>
            </div>
            {stats.inPersonTeam && (
              <>
                <div className="flex justify-between items-center text-sm">
                  <span>نام تیم:</span>
                  <span className="text-white font-normal flex items-center gap-1">
                    <FaUsers className="text-primary-aero" />
                    {stats.inPersonTeam.name}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>تعداد اعضا:</span>
                  <span className="text-primary-aero font-pixel" dir="ltr">
                    {stats.inPersonTeam.member_count}
                  </span>
                </div>
              </>
            )}
          </div>
          <div className="pixel-btn bg-gray-500 text-gray-300 cursor-not-allowed w-full mt-4 text-center block opacity-70">
            رقابت به پایان رسیده
          </div>
        </PixelFrame>
      </div>
    </div>
  );
}
