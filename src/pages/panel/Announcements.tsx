import PixelFrame from '@/components/PixelFrame';

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  type: 'info' | 'warning' | 'success';
}

const mockAnnouncements: Announcement[] = [];

export default function Announcements() {
  const getTypeStyles = (type: Announcement['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-900 bg-opacity-30 border-green-500';
      case 'warning':
        return 'bg-yellow-900 bg-opacity-30 border-yellow-500';
      case 'info':
      default:
        return 'bg-blue-900 bg-opacity-30 border-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
        <h1 className="text-3xl font-bold text-primary-sky mb-4">📢 اطلاعیه‌ها</h1>
        <p className="text-primary-aero">آخرین اخبار و اطلاعیه‌های رویداد باگزبازی</p>
      </PixelFrame>

      <div className="space-y-4">
        {mockAnnouncements.map((announcement) => (
          <PixelFrame key={announcement.id} className={`${getTypeStyles(announcement.type)}`}>
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-xl font-bold text-white">{announcement.title}</h2>
              <span className="text-gray-400 text-sm">{announcement.date}</span>
            </div>
            <p className="text-gray-300">{announcement.content}</p>
          </PixelFrame>
        ))}
      </div>

      <PixelFrame className="bg-gray-800 bg-opacity-30">
        <p className="text-gray-400 text-center text-sm">
          🔔 اطلاعیه‌های جدید به محض انتشار در اینجا نمایش داده خواهند شد.
        </p>
      </PixelFrame>
    </div>
  );
}
