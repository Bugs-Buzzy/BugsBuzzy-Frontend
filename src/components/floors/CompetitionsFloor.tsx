import { forwardRef, useState } from 'react';

import PixelModal from '@/components/modals/PixelModal';
import PixelFrame from '@/components/PixelFrame';

const CompetitionsFloor = forwardRef<HTMLElement>((props, ref) => {
  const [modalContent, setModalContent] = useState<string | null>(null);

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
          <div className="text-center">
            <h2 className="text-5xl font-bold text-white font-pixel mb-12">🏆 رقابت‌ها</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8">
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
