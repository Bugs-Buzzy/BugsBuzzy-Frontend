import { useEffect, useMemo, useState } from 'react';

import Loading from '@/components/Loading';
import PixelFrame from '@/components/PixelFrame';
import { announcementService, type UserAnnouncement } from '@/services/announcement.service';
import { type ApiError } from '@/services/api';

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
  return diffInHours <= 72;
};

interface AnnouncementCard {
  id: number;
  title: string;
  description: string | null;
  createdAt: string;
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<UserAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await announcementService.getMyAnnouncements();
        if (!isMounted) return;
        setAnnouncements(data);
      } catch (err) {
        if (!isMounted) return;
        const apiError = err as ApiError;
        setError(apiError?.message || 'خطا در دریافت اطلاعیه‌ها. دوباره تلاش کنید.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchAnnouncements();

    return () => {
      isMounted = false;
    };
  }, []);

  const mappedAnnouncements = useMemo<AnnouncementCard[]>(() => {
    return announcements.map((item) => ({
      id: item.id,
      title: item.announcement.title ?? 'بدون عنوان',
      description: item.announcement.description ?? null,
      createdAt: item.announcement.created_at || item.created_at,
    }));
  }, [announcements]);

  return (
    <div className="space-y-6">
      <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
        <h1 className="text-3xl font-bold text-primary-sky mb-4">📢 اطلاعیه‌ها</h1>
        <p className="text-primary-aero">آخرین اخبار و اطلاعیه‌های رویداد باگزبازی</p>
      </PixelFrame>

      {loading ? (
        <PixelFrame className="bg-primary-oxfordblue bg-opacity-60">
          <div className="py-10">
            <Loading text="در حال دریافت اطلاعیه‌ها..." />
          </div>
        </PixelFrame>
      ) : error ? (
        <PixelFrame className="bg-red-900 bg-opacity-30 border border-red-500/60">
          <p className="text-red-200 text-center text-base">{error}</p>
        </PixelFrame>
      ) : mappedAnnouncements.length === 0 ? (
        <PixelFrame className="bg-gray-800 bg-opacity-40 border border-gray-700/60">
          <p className="text-gray-300 text-center text-sm">
            🔔 هنوز اطلاعیه‌ای برای شما ثبت نشده است. به محض انتشار، در اینجا نمایش داده خواهد شد.
          </p>
        </PixelFrame>
      ) : (
        <div className="space-y-4">
          {mappedAnnouncements.map((announcement) => (
            <PixelFrame
              key={announcement.id}
              className="bg-primary-oxfordblue bg-opacity-80 border border-primary-sky/40"
            >
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="text-xl font-bold text-white">{announcement.title}</h2>
                  <div
                    className="flex items-center gap-2 text-sm text-primary-aero font-pixel"
                    dir="ltr"
                  >
                    {isRecentAnnouncement(announcement.createdAt) && (
                      <span className="px-2 py-0.5 rounded bg-secondary-orangePantone/20 text-secondary-orangeCrayola text-xs font-bold">
                        جدید
                      </span>
                    )}
                    <span>{formatDateTime(announcement.createdAt)}</span>
                  </div>
                </div>
                {announcement.description ? (
                  <p className="text-primary-aero leading-relaxed whitespace-pre-wrap">
                    {announcement.description}
                  </p>
                ) : (
                  <p className="text-primary-aero text-sm">بدون توضیحات</p>
                )}
              </div>
            </PixelFrame>
          ))}
        </div>
      )}
    </div>
  );
}
