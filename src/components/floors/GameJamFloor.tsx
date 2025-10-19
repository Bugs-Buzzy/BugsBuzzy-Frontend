import { forwardRef, useState } from 'react';
import { FaGamepad } from 'react-icons/fa';

import bgGameJam from '@/assets/bkg-gamejam.png';
import PixelModal from '@/components/modals/PixelModal';
import PixelFrame from '@/components/PixelFrame';

const GameJamFloor = forwardRef<HTMLElement>((props, ref) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <section
        ref={ref}
        className="floor bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgGameJam})` }}
      >
        <div className="flex items-center justify-center h-full px-4">
          <PixelFrame
            className="bg-purple-800 bg-opacity-90 max-w-4xl w-full cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setShowModal(true)}
          >
            <div className="text-center">
              <FaGamepad className="text-4xl md:text-6xl mb-4 md:mb-6 mx-auto" />
              <h2 className="text-3xl md:text-5xl font-bold text-white font-pixel mb-4 md:mb-6">
                گیم‌جم مجازی
              </h2>
              <p className="text-lg md:text-2xl text-purple-200 font-normal leading-relaxed">
                یک گیم‌جم آنلاین برای خلق بازی‌های پیکسلی
                <br className="hidden md:block" />
                از هر کجای دنیا در رقابت شرکت کنید
              </p>
              <p className="text-purple-300 font-pixel text-xs md:text-sm mt-4 md:mt-6">
                برای اطلاعات بیشتر کلیک کنید
              </p>
            </div>
          </PixelFrame>
        </div>
      </section>

      {showModal && (
        <PixelModal onClose={() => setShowModal(false)}>
          <div className="text-white font-pixel">
            <FaGamepad className="text-4xl md:text-6xl mb-4 mx-auto" />
            <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">گیم‌جم مجازی Pixel Art</h3>
            <div className="font-normal space-y-3 md:space-y-4 text-base md:text-lg leading-7 md:leading-8">
              <p>
                در این گیم‌جم آنلاین، بازی‌سازان از سراسر جهان در مدت زمان محدود یک بازی کامل با تم
                Pixel Art می‌سازند.
              </p>
              <p>
                با استفاده از ابزارهای مورد علاقه‌تان و کار تیمی، یک بازی خلاقانه بسازید و آن را با
                جامعه به اشتراک بگذارید.
              </p>
              <div className="bg-purple-900 p-3 md:p-4 rounded mt-4 md:mt-6">
                <h4 className="font-pixel text-lg md:text-xl mb-2 md:mb-3">ویژگی‌ها:</h4>
                <ul className="list-disc list-inside space-y-1 md:space-y-2 text-sm md:text-base">
                  <li>رقابت آنلاین 48 ساعته</li>
                  <li>تم Pixel Art و Retro Gaming</li>
                  <li>جوایز برای بهترین بازی‌ها</li>
                  <li>امکان تیم‌سازی آنلاین</li>
                </ul>
              </div>
            </div>
          </div>
        </PixelModal>
      )}
    </>
  );
});

GameJamFloor.displayName = 'GameJamFloor';

export default GameJamFloor;
