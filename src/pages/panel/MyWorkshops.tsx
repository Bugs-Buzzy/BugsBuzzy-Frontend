import PixelFrame from '@/components/PixelFrame';

export default function MyWorkshops() {
  const workshops = [
    {
      id: 1,
      title: '',
      status: '',
      date: '',
    },
  ];

  return (
    <div className="max-w-4xl">
      <PixelFrame className="bg-black bg-opacity-50">
        <h2 className="text-3xl font-bold text-white font-pixel mb-6">🔬 کارگاه‌های من</h2>

        {workshops.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg font-normal">
              هنوز در هیچ کارگاهی ثبت‌نام نکرده‌اید
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {workshops.map((workshop) => (
              <PixelFrame
                key={workshop.id}
                className="bg-primary-midnight flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 font-pixel">{workshop.title}</h3>
                  <p className="text-primary-aero text-sm font-normal">📅 {workshop.date}</p>
                </div>
                <div className="pixel-btn pixel-btn-success py-2 px-4">{workshop.status}</div>
              </PixelFrame>
            ))}
          </div>
        )}
      </PixelFrame>
    </div>
  );
}
