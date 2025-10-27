import { useEffect, useState } from 'react';
import {
  FaCheckCircle,
  FaUser,
  FaCalendar,
  FaClock,
  FaMapMarker,
  FaVideo,
  FaPlay,
} from 'react-icons/fa';

import Loading from '@/components/Loading';
import PixelFrame from '@/components/PixelFrame';
import { Workshop, workshopService } from '@/services/workshop.service';

const getWorkshopStatus = (workshop: Workshop): 'upcoming' | 'live' | 'completed' => {
  const now = new Date();
  const startTime = new Date(workshop.start_datetime);
  const endTime = new Date(startTime.getTime() + workshop.duration * 60000);

  if (now < startTime) return 'upcoming';
  if (now >= startTime && now <= endTime) return 'live';
  return 'completed';
};

const formatDateTime = (dateTimeString: string) => {
  const date = new Date(dateTimeString);
  return {
    date: date.toLocaleDateString('fa-IR'),
    time: date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    weekday: date.toLocaleDateString('fa-IR', { weekday: 'long' }),
  };
};

const getStatusBadge = (status: 'upcoming' | 'live' | 'completed') => {
  const baseClasses = 'px-4 py-2 rounded-lg font-bold text-sm border-2';

  switch (status) {
    case 'live':
      return (
        <div
          className={`${baseClasses} bg-red-500 bg-opacity-20 border-red-500 text-red-300 flex items-center gap-2`}
        >
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          در حال برگزاری
        </div>
      );
    case 'upcoming':
      return (
        <div
          className={`${baseClasses} bg-yellow-500 bg-opacity-20 border-yellow-500 text-yellow-300 flex items-center gap-2`}
        >
          <FaClock className="text-sm" />
          به زودی
        </div>
      );
    case 'completed':
      return (
        <div
          className={`${baseClasses} bg-green-500 bg-opacity-20 border-green-500 text-green-300 flex items-center gap-2`}
        >
          <FaCheckCircle />
          تمام شده
        </div>
      );
  }
};

const getActionButton = (workshop: Workshop, status: 'upcoming' | 'live' | 'completed') => {
  if (status === 'live' && workshop.vc_link) {
    return (
      <button
        onClick={() => window.open(workshop.vc_link!, '_blank')}
        className="pixel-btn pixel-btn-primary w-full py-4 mt-4 flex items-center justify-center gap-3 text-lg font-bold hover:scale-105 transition-transform"
      >
        <FaPlay />
        ورود به جلسه زنده
      </button>
    );
  }

  if (status === 'completed' && workshop.record_link) {
    return (
      <button
        onClick={() => window.open(workshop.record_link!, '_blank')}
        className="pixel-btn pixel-btn-success w-full py-4 mt-4 flex items-center justify-center gap-3 text-lg font-bold hover:scale-105 transition-transform"
      >
        <FaVideo />
        مشاهده ضبط شده
      </button>
    );
  }

  if (status === 'upcoming') {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 bg-opacity-10 rounded-xl p-4 mt-4 border border-blue-500 border-opacity-30">
        <p className="text-blue-300 text-center text-sm flex items-center justify-center gap-2">
          <FaCalendar />
          {workshop.vc_link
            ? 'لینک ورود به جلسه در زمان شروع فعال خواهد شد'
            : `مکان برگزاری: ${workshop.place || 'تعیین خواهد شد'}`}
        </p>
      </div>
    );
  }

  if (status === 'live' && workshop.place) {
    return (
      <div className="bg-gradient-to-r from-cyan-800 to-green-900 bg-opacity-10 rounded-xl p-4 mt-4 border border-blue-500 border-opacity-30">
        <p className="text-white text-center text-sm flex items-center justify-center gap-2">
          این جلسه به صورت حضوری در حال برگزاری است
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-700 bg-opacity-50 rounded-xl p-4 mt-4">
      <p className="text-gray-400 text-center text-sm">ضبط شده این جلسه در دسترس نیست</p>
    </div>
  );
};

const PresentationItem = ({ workshop }: { workshop: Workshop }) => {
  const status = getWorkshopStatus(workshop);
  const { date, time, weekday } = formatDateTime(workshop.start_datetime);
  const isOnline = !!workshop.vc_link;
  const isInPerson = !!workshop.place;

  return (
    <PixelFrame
      key={workshop.id}
      className="bg-primary-oxfordblue bg-opacity-90 transition-all duration-300 px-7 py-2"
    >
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-start gap-4">
            {/* Presenter Avatar */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-sky to-primary-aero rounded-xl flex items-center justify-center border-2 border-white border-opacity-20">
                {workshop.presenter_image ? (
                  <img
                    src={workshop.presenter_image}
                    alt={workshop.presenter || ''}
                    className="w-full h-full rounded-xl object-cover"
                  />
                ) : (
                  <FaUser className="text-2xl text-white opacity-70" />
                )}
              </div>
            </div>

            {/* Title and Basic Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{workshop.title}</h2>

              {workshop.presenter && (
                <div className="flex items-center gap-2 text-primary-aero mb-2">
                  <FaUser className="text-sm opacity-70" />
                  <span className="font-medium">ارائه‌دهنده: {workshop.presenter}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex-shrink-0">{getStatusBadge(status)}</div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 p-4 bg-black bg-opacity-20 rounded-xl">
        {/* Date */}
        <div className="flex items-center gap-3 text-sm">
          <div className="bg-blue-500 bg-opacity-20 p-2 rounded-lg">
            <FaCalendar className="text-blue-300" />
          </div>
          <div>
            <div className="text-gray-400 text-xs">تاریخ</div>
            <div className="text-white font-medium">{date}</div>
            <div className="text-gray-300 text-xs">{weekday}</div>
          </div>
        </div>

        {/* Time */}
        <div className="flex items-center gap-3 text-sm">
          <div className="bg-green-500 bg-opacity-20 p-2 rounded-lg">
            <FaClock className="text-green-300" />
          </div>
          <div>
            <div className="text-gray-400 text-xs">ساعت</div>
            <div className="text-white font-medium text-right">{time}</div>
            <div className="text-gray-300 text-xs">{workshop.duration} دقیقه</div>
          </div>
        </div>

        {/* Location/Platform */}
        <div className="flex items-center gap-3 text-sm">
          <div className="bg-purple-500 bg-opacity-20 p-2 rounded-lg">
            <FaMapMarker className="text-purple-300" />
          </div>
          <div>
            <div className="text-gray-400 text-xs">مکان برگزاری</div>
            <div className="text-white font-medium">
              {isOnline ? 'آنلاین' : isInPerson ? 'حضوری' : 'نامشخص'}
            </div>
            <div className="text-gray-300 text-xs">
              {workshop.place || (isOnline ? 'پلتفرم آنلاین' : '---')}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {workshop.description && (
        <div className="mb-4 p-4 bg-black bg-opacity-10 rounded-xl">
          <p className="text-gray-200 leading-relaxed text-justify">{workshop.description}</p>
        </div>
      )}

      {/* Action Button */}
      {getActionButton(workshop, status)}
    </PixelFrame>
  );
};

export default function Presentations() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        setLoading(true);
        const data = await workshopService.getWorkshops();
        setWorkshops(data);
      } catch (err) {
        setError('خطا در دریافت اطلاعات کارگاه‌ها');
        console.error('Error fetching workshops:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  return (
    <div className="space-y-6">
      <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-sky mb-4 drop-shadow-lg">
            کارگاه‌ها و ارائه‌ها
          </h1>
          <p className="text-primary-aero text-lg">لیست کامل کارگاه‌ها و ارائه‌های آموزشی رویداد</p>
        </div>
      </PixelFrame>

      <div className="space-y-6">
        {loading && (
          <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
            <div className="py-8">
              <Loading />
            </div>
          </PixelFrame>
        )}
        {error && (
          <PixelFrame className="bg-red-900 bg-opacity-90 border-2 border-red-500">
            <div className="text-center py-4">
              <p className="text-red-300">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="pixel-btn pixel-btn-danger mt-3"
              >
                تلاش مجدد
              </button>
            </div>
          </PixelFrame>
        )}
        {workshops.map((workshop) => (
          <PresentationItem key={workshop.id} workshop={workshop} />
        ))}
      </div>

      {workshops.length === 0 && (
        <PixelFrame className="bg-gradient-to-r from-gray-800 to-gray-700 border-2 border-gray-600">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">کارگاه‌ای موجود نیست</h3>
            <p className="text-gray-400">
              کارگاه‌های جدید به محض برنامه‌ریزی در اینجا اضافه خواهند شد.
            </p>
          </div>
        </PixelFrame>
      )}
    </div>
  );
}
