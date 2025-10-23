import { forwardRef, useEffect, useRef, useState } from 'react';
import { FaTrophy, FaClock, FaCoins } from 'react-icons/fa';

import bgInPerson from '@/assets/bkg-inperson.png';
import PixelModal from '@/components/modals/PixelModal';
import PixelFrame from '@/components/PixelFrame';
import { useScrollInterceptor } from '@/hooks/useScrollInterceptor';

const InPersonFloor = forwardRef<HTMLElement>((props, ref) => {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  useScrollInterceptor(modalRef, {});

  useEffect(() => {
    const container = modalRef.current;
    if (!container) return;

    if (showModal) {
      document.body.style.overflow = 'hidden';
      container.focus();
    } else {
      document.body.style.overflow = '';
    }

    const preventScroll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };
    container.addEventListener('wheel', preventScroll, { passive: false });
    container.addEventListener('touchmove', preventScroll, { passive: false });
    container.addEventListener('keydown', preventScroll, { passive: false });

    return () => {
      document.body.style.overflow = '';
      container.removeEventListener('wheel', preventScroll);
      container.removeEventListener('touchmove', preventScroll);
      container.removeEventListener('keydown', preventScroll);
    };
  }, [showModal]);

  return (
    <>
      <section
        ref={ref}
        className="floor bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgInPerson})` }}
      >
        <div className="flex items-center justify-center h-full px-4">
          <div className="max-w-5xl w-full space-y-6">
            {/* Prize Banner */}
            <div className="flex justify-center">
              <PixelFrame className="bg-primary-process px-8 py-4 transform transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-4">
                  <FaCoins className="text-3xl text-yellow-400 animate-bounce" />
                  <p className="text-xl md:text-2xl font-bold text-white font-pixel">
                    بیش از ۴۰۰ تتر جایزه
                  </p>
                </div>
              </PixelFrame>
            </div>

            {/* Unified Timeline */}
            <div className="relative h-32 mx-auto mb-8">
              <div className="relative w-full max-w-[90%] md:max-w-3xl mx-auto flex justify-between items-start">
                {/* Timeline Path */}
                <div className="absolute w-[calc(100%-12px)] h-0.5 md:h-1 bg-gradient-to-l from-primary-process to-primary-sky left-1/2 top-[14px] md:top-[18px] -translate-x-1/2 z-0" />

                {/* Registration Step */}
                <div className="relative text-center group z-10">
                  <div className="mb-2 md:mb-4 transition-transform duration-300 group-hover:scale-125">
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-primary-process rounded-lg animate-pulse group-hover:animate-none group-hover:bg-sky-400">
                      <FaClock className="w-full h-full p-1.5 text-white" />
                    </div>
                  </div>
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 md:mt-3 bg-primary-cerulean backdrop-blur-sm rounded 
                    px-2 py-1 md:px-3 md:py-2 transform transition-all duration-300 group-hover:scale-110 
                    group-hover:bg-primary-process min-w-[100px] md:min-w-[120px] whitespace-nowrap"
                  >
                    <p className="text-primary-nonphoto text-xs md:text-sm mb-0.5 md:mb-1 group-hover:text-primary-columbia select-none">
                      مهلت ثبت‌نام
                    </p>
                    <p className="text-white font-bold text-sm md:text-base select-none">۶ آبان</p>
                  </div>
                </div>

                {/* Event Step */}
                <div className="relative text-center group z-10">
                  <div className="mb-2 md:mb-4 transition-transform duration-300 group-hover:scale-125">
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-primary-process rounded-lg animate-pulse group-hover:animate-none group-hover:bg-primary-sky">
                      <FaTrophy className="w-full h-full p-1.5 text-white" />
                    </div>
                  </div>
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 md:mt-3 bg-primary-cerulean backdrop-blur-sm rounded 
                    px-2 py-1 md:px-3 md:py-2 transform transition-all duration-300 group-hover:scale-110 
                    group-hover:bg-primary-process min-w-[100px] md:min-w-[120px] whitespace-nowrap"
                  >
                    <p className="text-primary-nonphoto text-xs md:text-sm mb-0.5 md:mb-1 group-hover:text-primary-columbia select-none">
                      روزهای برگزاری
                    </p>
                    <p className="text-white font-bold text-sm md:text-base select-none">
                      ۸ و ۹ آبان
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Card */}
            <PixelFrame
              className="bg-primary-cerulean cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setShowModal(true)}
            >
              <div className="text-center">
                <FaTrophy className="text-4xl md:text-6xl mb-4 md:mb-6 mx-auto text-primary-sky" />
                <h2 className="text-3xl md:text-5xl font-bold text-white font-pixel mb-4 md:mb-6">
                  رقابت حضوری
                </h2>
                <p className="text-lg md:text-2xl text-primary-nonphoto font-normal leading-relaxed">
                  با جوایز ویژه و تجربه‌ای فراموش‌نشدنی
                </p>
                <p className="text-primary-sky font-pixel text-xs md:text-sm mt-4 md:mt-6">
                  برای اطلاعات بیشتر کلیک کنید
                </p>
              </div>
            </PixelFrame>
          </div>
        </div>
      </section>

      {showModal && (
        <PixelModal onClose={() => setShowModal(false)}>
          <div
            className="text-white font-pixel max-h-[70vh] overflow-y-auto p-4 md:p-6"
            ref={modalRef}
            tabIndex={-1}
          >
            <FaTrophy className="text-4xl md:text-6xl mb-4 mx-auto" />
            <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
              رقابت حضوری Bitcoin Hunt
            </h3>

            <div className="font-normal space-y-3 md:space-y-4 text-sm md:text-base md:text-lg leading-7 md:leading-8">
              <p>
                این مسابقه در قالب تیم های ۳ نفره برگزار میشود و به شکلی طراحی شده است که کسانی که
                تجربه زیادی در بازی‌سازی هم ندارند در کنار آشنایی با موتور بازی‌سازی Godot شانس خوبی
                برای پیروزی و برنده شدن جوایز متعدد داشته باشند. اگر به دنبال یک تجربه مفرح و
                تکرارنشدنی در کنار یادگیری بازی‌سازی هستید به هیچ عنوان این بخش از رویداد را از دست
                ندهید.
              </p>
              <p>
                <b>
                  توجه!!! ظرفیت این بخش محدود می‌باشد و اولویت با افرادی می باشد که تیم خود را
                  سریعتر تکمیل کنند.
                </b>
              </p>

              <p>در این مسابقه از موتور بازی‌سازی Godot 4.5 استفاده می‌شود.</p>

              <div className="bg-orange-900 p-3 md:p-4 rounded mt-4 md:mt-6">
                <h4 className="font-pixel text-lg md:text-xl mb-2 md:mb-3">جوایز ویژه:</h4>
                <ul className="list-disc list-inside space-y-1 md:space-y-2 text-sm md:text-base">
                  <li>بیت‌کوین</li>
                  <li>جوایز نقدی</li>
                  <li>مسکات رویداد</li>
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
