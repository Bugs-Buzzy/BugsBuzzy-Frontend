import { forwardRef, useState } from 'react';
import { FaClock, FaTrophy } from 'react-icons/fa';

import PixelModal from '@/components/modals/PixelModal';
import PixelFrame from '@/components/PixelFrame';

const CompetitionsFloor = forwardRef<HTMLElement>((props, ref) => {
  const [modalContent, setModalContent] = useState<string | null>(null);

  const timeline = [
    { date: '6 آبان', title: 'پایان مهلت ثبت‌نام' },
    { date: '8 و 9 آبان', title: 'برگزاری رویداد' },
  ];

  const competitions = [
    {
      id: 'onsite',
      title: 'رقابت حضوری',
      description: 'یک رقابت هیجان‌انگیز حضوری برای توسعه‌دهندگان',
      details: 'جزئیات کامل رقابت حضوری...',
    },
    {
      id: 'gamejam',
      title: 'گیم‌جم مجازی',
      description: 'یک گیم‌جم آنلاین برای خلق بازی‌های پیکسلی',
      details: 'جزئیات کامل گیم‌جم مجازی...',
    },
  ];

  return (
    <>
      <section ref={ref} className="floor bg-gradient-to-b from-amber-900 to-orange-900">
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-7xl mx-auto px-4">
            <h2 className="text-5xl font-bold text-white font-pixel mb-8">🏆 رقابت‌ها</h2>

            {/* Prize Section */}
            <div className="mb-12">
              <PixelFrame className="bg-orange-800 inline-block px-8 py-4 animate-pulse">
                <div className="flex items-center justify-center gap-4">
                  <FaTrophy className="text-4xl text-yellow-400" />
                  <p className="text-2xl font-bold text-white font-pixel">بیش از 300 تتر جایزه!</p>
                </div>
              </PixelFrame>
            </div>

            {/* Timeline */}
            <div className="mb-12 flex justify-center gap-8">
              {timeline.map((item, index) => (
                <PixelFrame key={index} className="bg-orange-800 px-6 py-3">
                  <div className="flex items-center gap-3">
                    <FaClock className="text-orange-200" />
                    <div className="text-right">
                      <p className="text-orange-200 text-sm">{item.title}</p>
                      <p className="text-white font-bold">{item.date}</p>
                    </div>
                  </div>
                </PixelFrame>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 max-w-5xl mx-auto">
              {competitions.map((comp) => (
                <PixelFrame
                  key={comp.id}
                  className="bg-orange-800 cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setModalContent(comp.details)}
                >
                  <h3 className="text-2xl font-bold text-white mb-4 font-pixel">{comp.title}</h3>
                  <p className="text-orange-200 font-normal">{comp.description}</p>
                </PixelFrame>
              ))}
            </div>
          </div>
        </div>
      </section>

      {modalContent && (
        <PixelModal onClose={() => setModalContent(null)}>
          <div className="text-white font-pixel">
            <h3 className="text-3xl font-bold mb-4">جزئیات رقابت</h3>
            <p className="text-lg font-normal">{modalContent}</p>
          </div>
        </PixelModal>
      )}
    </>
  );
});

CompetitionsFloor.displayName = 'CompetitionsFloor';

export default CompetitionsFloor;
