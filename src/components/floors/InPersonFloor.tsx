import { forwardRef, useState } from 'react';
import { FaTrophy } from 'react-icons/fa';

import bgInPerson from '@/assets/bkg-inperson.png';
import PixelModal from '@/components/modals/PixelModal';
import PixelFrame from '@/components/PixelFrame';

const InPersonFloor = forwardRef<HTMLElement>((props, ref) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <section
        ref={ref}
        className="floor bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgInPerson})` }}
      >
        <div className="flex items-center justify-center h-full px-4">
          <PixelFrame
            className="bg-orange-800 bg-opacity-90 max-w-4xl w-full cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setShowModal(true)}
          >
            <div className="text-center">
              <FaTrophy className="text-4xl md:text-6xl mb-4 md:mb-6 mx-auto" />
              <h2 className="text-3xl md:text-5xl font-bold text-white font-pixel mb-4 md:mb-6">
                رقابت حضوری
              </h2>
              <p className="text-lg md:text-2xl text-orange-200 font-normal leading-relaxed">
                یک رقابت هیجان‌انگیز حضوری برای توسعه‌دهندگان
                <br className="hidden md:block" />
                با جوایز ویژه و تجربه‌ای فراموش‌نشدنی
              </p>
              <p className="text-orange-300 font-pixel text-xs md:text-sm mt-4 md:mt-6">
                برای اطلاعات بیشتر کلیک کنید
              </p>
            </div>
          </PixelFrame>
        </div>
      </section>

      {showModal && (
        <PixelModal onClose={() => setShowModal(false)}>
          <div className="text-white font-pixel">
            <FaTrophy className="text-4xl md:text-6xl mb-4 mx-auto" />
            <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
              رقابت حضوری Bitcoin Hunt
            </h3>
            <div className="font-normal space-y-3 md:space-y-4 text-base md:text-lg leading-7 md:leading-8">
              <p>
                در این رقابت حضوری، توسعه‌دهندگان به صورت تیمی یا انفرادی در چالش‌های برنامه‌نویسی و
                توسعه بازی شرکت می‌کنند.
              </p>
              <p>
                با حل مسائل پیچیده، ایجاد بازی‌های خلاقانه و رقابت با دیگر توسعه‌دهندگان، شانس کسب
                جوایز ارزشمند را خواهید داشت.
              </p>
              <div className="bg-orange-900 p-3 md:p-4 rounded mt-4 md:mt-6">
                <h4 className="font-pixel text-lg md:text-xl mb-2 md:mb-3">جوایز ویژه:</h4>
                <ul className="list-disc list-inside space-y-1 md:space-y-2 text-sm md:text-base">
                  <li>جوایز نقدی</li>
                  <li>گواهینامه شرکت در رویداد</li>
                  <li>فرصت‌های شغلی</li>
                </ul>
              </div>
            </div>
          </div>
        </PixelModal>
      )}
    </>
  );
});

InPersonFloor.displayName = 'InPersonFloor';

export default InPersonFloor;
