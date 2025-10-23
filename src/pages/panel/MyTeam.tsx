import PixelFrame from '@/components/PixelFrame';

export default function MyTeam() {
  const hasTeam = false;

  return (
    <div className="max-w-4xl">
      <PixelFrame className="bg-black bg-opacity-50">
        <h2 className="text-3xl font-bold text-white font-pixel mb-6">👥 تیم من</h2>

        {!hasTeam ? (
          <div className="text-center py-12 space-y-6">
            <p className="text-gray-400 text-lg font-normal">هنوز تیمی ایجاد نکرده‌اید</p>
            <button className="pixel-btn pixel-btn-primary py-3 px-8">➕ ایجاد تیم جدید</button>
          </div>
        ) : (
          <div>
            <PixelFrame className="bg-primary-midnight mb-6">
              <h3 className="text-2xl font-bold text-white mb-4 font-pixel">نام تیم</h3>
              <div className="space-y-2 font-normal">
                <div className="flex justify-between text-white">
                  <span>تعداد اعضا:</span>
                  <span className="font-bold">3</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>وضعیت:</span>
                  <span className="font-bold text-green-400">فعال</span>
                </div>
              </div>
            </PixelFrame>
          </div>
        )}
      </PixelFrame>
    </div>
  );
}
