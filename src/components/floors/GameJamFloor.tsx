import { forwardRef, useState } from 'react';
import { FaGamepad, FaClock, FaTrophy } from 'react-icons/fa';

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
          <div className="max-w-5xl w-full space-y-6">
            {/* Prize Banner */}
            <div className="flex justify-center">
              <PixelFrame className="bg-blue-900/90 px-8 py-6 transform transition-all duration-300 hover:scale-105">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <FaTrophy className="text-4xl md:text-5xl text-yellow-400 animate-pulse relative z-10" />
                      <div className="absolute inset-0 text-4xl md:text-5xl text-yellow-300 animate-ping opacity-75">
                        <FaTrophy />
                      </div>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white font-pixel">
                      جوایز نقدی
                    </h3>
                  </div>

                  <div className="grid grid-cols-3 gap-4 md:gap-8">
                    {/* First Place */}
                    <div className="flex flex-col items-center group">
                      <div className="relative mb-2">
                        <FaTrophy className="text-3xl md:text-4xl text-yellow-400 group-hover:scale-110 transition-transform" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold">
                          1
                        </span>
                      </div>
                      <div className="bg-blue-800/50 backdrop-blur-sm px-3 py-2 rounded-lg text-center group-hover:bg-blue-700/50 transition-colors">
                        <p className="text-yellow-400 font-bold font-pixel text-lg md:text-xl">
                          400
                        </p>
                        <p className="text-yellow-300 text-sm">USDT</p>
                      </div>
                    </div>

                    {/* Second Place */}
                    <div className="flex flex-col items-center group">
                      <div className="relative mb-2">
                        <FaTrophy className="text-3xl md:text-4xl text-gray-300 group-hover:scale-110 transition-transform" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold">
                          2
                        </span>
                      </div>
                      <div className="bg-blue-800/50 backdrop-blur-sm px-3 py-2 rounded-lg text-center group-hover:bg-blue-700/50 transition-colors">
                        <p className="text-gray-300 font-bold font-pixel text-lg md:text-xl">200</p>
                        <p className="text-gray-200 text-sm">USDT</p>
                      </div>
                    </div>

                    {/* Third Place */}
                    <div className="flex flex-col items-center group">
                      <div className="relative mb-2">
                        <FaTrophy className="text-3xl md:text-4xl text-amber-700 group-hover:scale-110 transition-transform" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-700 rounded-full flex items-center justify-center text-xs font-bold">
                          3
                        </span>
                      </div>
                      <div className="bg-blue-800/50 backdrop-blur-sm px-3 py-2 rounded-lg text-center group-hover:bg-blue-700/50 transition-colors">
                        <p className="text-amber-700 font-bold font-pixel text-lg md:text-xl">
                          100
                        </p>
                        <p className="text-amber-600 text-sm">USDT</p>
                      </div>
                    </div>
                  </div>
                </div>
              </PixelFrame>
            </div>

            {/* Unified Timeline */}
            <div className="relative h-32 mx-auto mb-8">
              <div className="relative w-full max-w-[90%] md:max-w-4xl mx-auto">
                {/* Timeline Line */}
                <div className="absolute w-[calc(100%-24px)] h-0.5 md:h-1 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/70 to-transparent">
                    <div className="absolute inset-0 animate-pulse opacity-50 bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
                  </div>
                  <div className="absolute inset-0 blur-sm opacity-20 bg-blue-400" />
                </div>

                {/* Timeline Points */}
                <div className="relative flex justify-between items-center h-full px-3">
                  {/* Registration End */}
                  <div className="relative text-center group">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg 
                          mb-3 transition-transform duration-300 group-hover:scale-110 animate-pulse group-hover:animate-none 
                          group-hover:from-blue-300 group-hover:to-blue-500 relative z-10"
                      >
                        <FaClock className="w-full h-full p-2 text-white" />
                      </div>
                      <div
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-blue-900/90 backdrop-blur-sm rounded-lg shadow-xl
                        px-3 py-2 transform transition-all duration-300 group-hover:scale-105 group-hover:bg-blue-800/90 
                        min-w-[110px] md:min-w-[130px] whitespace-nowrap"
                      >
                        <p className="text-blue-200 text-xs md:text-sm mb-0.5 group-hover:text-blue-100">
                          پایان مهلت ثبت‌نام
                        </p>
                        <p className="text-white font-bold text-sm md:text-base">14 آبان</p>
                      </div>
                    </div>
                  </div>

                  {/* Opening Step */}
                  <div className="relative text-center group -mt-12">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg 
                          mb-3 transition-transform duration-300 group-hover:scale-110 animate-pulse group-hover:animate-none 
                          group-hover:from-blue-300 group-hover:to-blue-500 relative z-10"
                      >
                        <FaGamepad className="w-full h-full p-2 text-white" />
                      </div>
                      <div
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-blue-900/90 backdrop-blur-sm rounded-lg shadow-xl
                        px-3 py-2 transform transition-all duration-300 group-hover:scale-105 group-hover:bg-blue-800/90 
                        min-w-[110px] md:min-w-[130px] whitespace-nowrap"
                      >
                        <p className="text-blue-200 text-xs md:text-sm mb-0.5 group-hover:text-blue-100">
                          افتتاحیه و اعلام تم
                        </p>
                        <p className="text-white font-bold text-sm md:text-base">14 آبان</p>
                      </div>
                    </div>
                  </div>

                  {/* Submission Step */}
                  <div className="relative text-center group">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg 
                          mb-3 transition-transform duration-300 group-hover:scale-110 animate-pulse group-hover:animate-none 
                          group-hover:from-blue-300 group-hover:to-blue-500 relative z-10"
                      >
                        <FaGamepad className="w-full h-full p-2 text-white rotate-90" />
                      </div>
                      <div
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-blue-900/90 backdrop-blur-sm rounded-lg shadow-xl
                        px-3 py-2 transform transition-all duration-300 group-hover:scale-105 group-hover:bg-blue-800/90 
                        min-w-[110px] md:min-w-[130px] whitespace-nowrap"
                      >
                        <p className="text-blue-200 text-xs md:text-sm mb-0.5 group-hover:text-blue-100">
                          مهلت ارسال آثار
                        </p>
                        <p className="text-white font-bold text-sm md:text-base">24 آبان</p>
                      </div>
                    </div>
                  </div>

                  {/* Closing Step */}
                  <div className="relative text-center group -mt-12">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg 
                          mb-3 transition-transform duration-300 group-hover:scale-110 animate-pulse group-hover:animate-none 
                          group-hover:from-blue-300 group-hover:to-blue-500 relative z-10"
                      >
                        <FaTrophy className="w-full h-full p-2 text-white" />
                      </div>
                      <div
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-blue-900/90 backdrop-blur-sm rounded-lg shadow-xl
                        px-3 py-2 transform transition-all duration-300 group-hover:scale-105 group-hover:bg-blue-800/90 
                        min-w-[110px] md:min-w-[130px] whitespace-nowrap"
                      >
                        <p className="text-blue-200 text-xs md:text-sm mb-0.5 group-hover:text-blue-100">
                          اختتامیه
                        </p>
                        <p className="text-white font-bold text-sm md:text-base">28 آبان</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Card */}
            <PixelFrame
              className="bg-blue-900/90 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setShowModal(true)}
            >
              <div className="text-center">
                <FaGamepad className="text-4xl md:text-6xl mb-4 md:mb-6 mx-auto text-blue-400" />
                <h2 className="text-3xl md:text-5xl font-bold text-white font-pixel mb-4 md:mb-6">
                  گیم‌جم مجازی
                </h2>
                <p className="text-lg md:text-2xl text-blue-200 font-normal leading-relaxed">
                  یک گیم‌جم آنلاین برای خلق بازی‌های پیکسلی
                  <br className="hidden md:block" />
                  از هر کجای دنیا در رقابت شرکت کنید
                </p>
                <p className="text-blue-300 font-pixel text-xs md:text-sm mt-4 md:mt-6">
                  برای اطلاعات بیشتر کلیک کنید
                </p>
              </div>
            </PixelFrame>
          </div>
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
              <div className="bg-blue-900 p-3 md:p-4 rounded mt-4 md:mt-6">
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
