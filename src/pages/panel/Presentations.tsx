import { FaCheckCircle } from 'react-icons/fa';

import PixelFrame from '@/components/PixelFrame';

interface Presentation {
  id: number;
  title: string;
  speaker: string;
  date: string;
  time: string;
  platform: string;
  link?: string;
  status: 'upcoming' | 'live' | 'completed';
}

const mockPresentations: Presentation[] = [];

export default function Presentations() {
  const getStatusBadge = (status: Presentation['status']) => {
    switch (status) {
      case 'live':
        return <span className="pixel-btn pixel-btn-danger px-3 py-1 text-sm">🔴 در حال پخش</span>;
      case 'upcoming':
        return <span className="pixel-btn pixel-btn-warning px-3 py-1 text-sm">⏰ به زودی</span>;
      case 'completed':
        return (
          <span className="pixel-btn pixel-btn-success px-3 py-1 text-sm flex items-center gap-1">
            <FaCheckCircle />
            تمام شده
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
        <h1 className="text-3xl font-bold text-primary-sky mb-4">📺 ارائه‌ها و کارگاه‌ها</h1>
        <p className="text-primary-aero">لیست ارائه‌ها و کارگاه‌های آموزشی رویداد</p>
      </PixelFrame>

      <div className="space-y-4">
        {mockPresentations.map((presentation) => (
          <PixelFrame key={presentation.id} className="bg-primary-oxfordblue bg-opacity-90">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-2">{presentation.title}</h2>
                <p className="text-gray-400 text-sm mb-1">
                  👤 {presentation.speaker} | 📅 {presentation.date} | ⏰ {presentation.time}
                </p>
                <p className="text-gray-400 text-sm">🎥 {presentation.platform}</p>
              </div>
              <div>{getStatusBadge(presentation.status)}</div>
            </div>

            {presentation.status === 'live' && (
              <button
                onClick={() => window.open(presentation.link, '_blank')}
                className="pixel-btn pixel-btn-primary w-full py-3 mt-4"
              >
                🎥 ورود به جلسه
              </button>
            )}

            {presentation.status === 'upcoming' && (
              <div className="bg-gray-800 rounded p-3 mt-4">
                <p className="text-gray-300 text-sm text-center">
                  لینک ورود به جلسه در زمان شروع فعال خواهد شد
                </p>
              </div>
            )}

            {presentation.status === 'completed' && (
              <button className="pixel-btn pixel-btn-success w-full py-3 mt-4">
                📹 مشاهده ضبط شده
              </button>
            )}
          </PixelFrame>
        ))}
      </div>

      <PixelFrame className="bg-gray-800 bg-opacity-30">
        <p className="text-gray-400 text-center text-sm">
          📚 ارائه‌های جدید به محض برنامه‌ریزی در اینجا اضافه خواهند شد.
        </p>
      </PixelFrame>
    </div>
  );
}
