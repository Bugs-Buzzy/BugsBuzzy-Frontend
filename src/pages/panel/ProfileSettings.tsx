import { FormEvent, useState } from 'react';

import PixelFrame from '@/components/PixelFrame';
import { useAuth } from '@/context/AuthContext';

export default function ProfileSettings() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      updateUser({
        name,
        phone,
        is_validated: !!(name && phone),
      });

      alert('اطلاعات با موفقیت ذخیره شد!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <PixelFrame className="bg-black bg-opacity-50">
        <h2 className="text-3xl font-bold text-white font-pixel mb-6">⚙️ تنظیمات پروفایل</h2>

        {!user?.is_validated && (
          <PixelFrame className="bg-yellow-900 mb-6">
            <p className="text-yellow-200 text-sm font-normal">
              ⚠️ برای فعال‌سازی بخش‌های دیگر (ثبت‌نام کارگاه، تیم‌سازی) لطفاً پروفایل خود را کامل
              کنید.
            </p>
          </PixelFrame>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white font-bold mb-2 font-pixel">ایمیل</label>
            <input
              type="email"
              value={user?.email}
              disabled
              className="w-full pixel-input bg-gray-800 text-gray-400 border-gray-600 p-3 font-pixel"
            />
          </div>

          <div>
            <label className="block text-white font-bold mb-2 font-pixel">
              نام و نام خانوادگی *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="نام خود را وارد کنید"
              className="w-full pixel-input bg-gray-800 text-white border-gray-600 p-3 font-normal"
              required
            />
          </div>

          <div>
            <label className="block text-white font-bold mb-2 font-pixel">شماره موبایل *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09123456789"
              className="w-full pixel-input bg-gray-800 text-white border-gray-600 p-3 font-pixel"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="pixel-btn pixel-btn-success py-3 px-8"
          >
            {loading ? 'در حال ذخیره...' : '💾 ذخیره اطلاعات'}
          </button>
        </form>
      </PixelFrame>
    </div>
  );
}
