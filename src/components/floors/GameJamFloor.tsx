import { forwardRef, useState, useEffect } from 'react';
import {
  FaGamepad,
  FaClock,
  FaTrophy,
  FaUsers,
  FaLightbulb,
  FaCode,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';

import bgGameJam from '@/assets/bkg-gamejam.png';
import PixelFrame from '@/components/PixelFrame';

const GameJamFloor = forwardRef<HTMLElement>((props, ref) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const pages = [
    {
      id: 0,
      content: 'جای خالی یک گیم‌جم بزرگ، حرفه‌ای و ساختارمند در کشور همیشه احساس می‌شده است؛',
      icon: <FaGamepad className="text-4xl md:text-6xl text-blue-400" />,
    },
    {
      id: 1,
      content:
        'رویدادی که بتواند تیم‌های بازی‌سازی را گرد هم بیاورد و بستر لازم برای بروز خلاقیت، تجربه‌ی عملی و رقابت جدی را فراهم کند.',
      icon: <FaUsers className="text-4xl md:text-6xl text-blue-400" />,
    },
    {
      id: 2,
      content:
        'بخش گیم‌جم مجازی باگز بازی دقیقاً با همین هدف طراحی شده است تا تجربه‌ای نزدیک به گیم‌جم‌های بین‌المللی را برای علاقه‌مندان و فعالان این حوزه رقم بزند.',
      icon: <FaLightbulb className="text-4xl md:text-6xl text-blue-400" />,
    },
    {
      id: 3,
      content:
        'در این بخش باگزبازی میتوانید در غالب تیم های 1 الی 6 نفره در مسابقه شرکت کنید و بر اساس تم مسابقه بازی های خود را از ایده تا اجرا پیش ببرید',
      icon: <FaCode className="text-4xl md:text-6xl text-blue-400" />,
    },
    {
      id: 4,
      content:
        'در تمامی طول مسیر تیم علمی رویداد کنار شما خواهد بود تا شما را در مسیر توسعه‌ی بازی‌های بهتر هدایت کند، نقاط ضعف را شناسایی کند و به شما کمک کند ایده‌هایتان را به سطح بالاتری برسانید',
      icon: <FaUsers className="text-4xl md:text-6xl text-blue-400" />,
    },
    {
      id: 5,
      content: (
        <div className="grid grid-cols-3 gap-4">
          {[
            { place: 1, amount: 400, color: 'yellow' },
            { place: 2, amount: 200, color: 'slate' },
            { place: 3, amount: 100, color: 'amber' },
          ].map((prize) => (
            <div key={prize.place} className="flex flex-col items-center group">
              <div className="relative mb-2">
                <FaTrophy
                  className={`text-3xl md:text-4xl ${
                    prize.place === 1
                      ? 'text-yellow-400'
                      : prize.place === 2
                        ? 'text-gray-300'
                        : 'text-orange-700'
                  } group-hover:scale-110 transition-transform`}
                />
                <span
                  className={`absolute -top-1 -right-1 w-4 h-4 ${
                    prize.place === 1
                      ? 'bg-yellow-400'
                      : prize.place === 2
                        ? 'bg-gray-300'
                        : 'bg-orange-700'
                  } rounded-full flex items-center justify-center text-xs font-bold`}
                >
                  {prize.place}
                </span>
              </div>
              <div className="bg-blue-800/50 backdrop-blur-sm px-3 py-2 rounded-lg text-center">
                <p
                  className={`${
                    prize.place === 1
                      ? 'text-yellow-400'
                      : prize.place === 2
                        ? 'text-gray-300'
                        : 'text-orange-700'
                  } font-bold font-pixel text-lg md:text-xl`}
                >
                  {prize.amount}
                </p>
                <p
                  className={`${
                    prize.place === 1
                      ? 'text-yellow-300'
                      : prize.place === 2
                        ? 'text-gray-200'
                        : 'text-orange-600'
                  } text-sm`}
                >
                  USDT
                </p>
              </div>
            </div>
          ))}
        </div>
      ),
      icon: <FaTrophy className="text-4xl md:text-6xl text-yellow-400" />,
    },
    {
      id: 6,
      content: (
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-2 gap-2 text-sm md:text-base">
            <div className="font-bold">پایان ثبت‌نام:</div>
            <div>14 آبان</div>
            <div className="font-bold">افتتاحیه و اعلام تم:</div>
            <div>14 آبان</div>
            <div className="font-bold">مهلت ارسال آثار:</div>
            <div>24 آبان</div>
            <div className="font-bold">اختتامیه:</div>
            <div>28 آبان</div>
          </div>
        </div>
      ),
      icon: <FaClock className="text-4xl md:text-6xl text-blue-400" />,
    },
  ];

  const nextPage = () => {
    if (!isTransitioning && currentPage < pages.length - 1) {
      setIsTransitioning(true);
      setCurrentPage((prev: number) => prev + 1);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const prevPage = () => {
    if (!isTransitioning && currentPage > 0) {
      setIsTransitioning(true);
      setCurrentPage((prev: number) => prev - 1);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        prevPage();
      } else if (e.key === 'ArrowLeft') {
        nextPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, isTransitioning]);

  return (
    <section
      ref={ref}
      className="floor bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{ backgroundImage: `url(${bgGameJam})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div className="relative h-full flex flex-col items-center justify-between py-8 px-4">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white font-pixel mb-4 animate-pulse mt-16 md:mt-24">
            Game Jam
          </h1>
          <div className="w-full max-w-md h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto"></div>
        </div>

        {/* Content */}
        <div className="flex-1 w-full max-w-4xl mx-auto flex items-center justify-center relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevPage}
            className={`absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-blue-900/80 hover:bg-blue-800 transition z-10 ${
              currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={currentPage === 0}
          >
            <FaChevronLeft className="text-2xl text-white" />
          </button>

          <PixelFrame className="bg-blue-900/90 w-full mx-12">
            <div className="p-6 md:p-8">
              <div className="flex flex-col items-center gap-6 text-center">
                {pages[currentPage].icon}
                <div
                  className={`text-white text-lg md:text-xl leading-relaxed transition-all duration-500 ${
                    isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                  }`}
                >
                  {pages[currentPage].content}
                </div>
              </div>
            </div>
          </PixelFrame>

          <button
            onClick={nextPage}
            className={`absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-blue-900/80 hover:bg-blue-800 transition z-10 ${
              currentPage === pages.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={currentPage === pages.length - 1}
          >
            <FaChevronRight className="text-2xl text-white" />
          </button>
        </div>

        {/* Page Indicators */}
        <div className="mt-8 flex gap-2">
          {pages.map((page) => (
            <div
              key={page.id}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentPage === page.id ? 'bg-blue-400 w-6' : 'bg-blue-900 hover:bg-blue-800'
              }`}
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true);
                  setCurrentPage(page.id);
                  setTimeout(() => setIsTransitioning(false), 500);
                }
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

export default GameJamFloor;
