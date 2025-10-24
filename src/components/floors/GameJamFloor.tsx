import { forwardRef, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  FaGamepad,
  FaClock,
  FaTrophy,
  FaUsers,
  FaLightbulb,
  FaCode,
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaFlag,
  FaUpload,
  FaMedal,
} from 'react-icons/fa';

import bgGameJam from '@/assets/bkg-gamejam.png';
import PixelFrame from '@/components/PixelFrame';
import { useScrollInterceptor } from '@/hooks/useScrollInterceptor';

const GameJamFloor = forwardRef<HTMLElement>((props, ref) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [animDirection, setAnimDirection] = useState<'left' | 'right'>('right');
  const contentRef = useRef<HTMLDivElement>(null);

  const pages = [
    {
      id: 0,
      content: 'جای خالی یک گیم‌جم بزرگ، حرفه‌ای و ساختارمند در کشور همیشه احساس می‌شده است؛',
      icon: <FaGamepad className="text-4xl md:text-6xl text-primary-process" />,
    },
    {
      id: 1,
      content:
        'رویدادی که بتواند تیم‌های بازی‌سازی را گرد هم بیاورد و بستر لازم برای بروز خلاقیت، تجربه‌ی عملی و رقابت جدی را فراهم کند.',
      icon: <FaUsers className="text-4xl md:text-6xl text-primary-process" />,
    },
    {
      id: 2,
      content:
        'بخش گیم‌جم مجازی باگز بازی دقیقاً با همین هدف طراحی شده است تا تجربه‌ای نزدیک به گیم‌جم‌های بین‌المللی را برای علاقه‌مندان و فعالان این حوزه رقم بزند.',
      icon: <FaLightbulb className="text-4xl md:text-6xl text-primary-process" />,
    },
    {
      id: 3,
      content:
        'در این بخش باگزبازی میتوانید در قالب تیم های ۱ الی ۶ نفره در مسابقه شرکت کنید و بر اساس تم مسابقه بازی های خود را از ایده تا اجرا پیش ببرید',
      icon: <FaCode className="text-4xl md:text-6xl text-primary-process" />,
    },
    {
      id: 4,
      content:
        'در تمامی طول مسیر تیم علمی رویداد کنار شما خواهد بود تا شما را در مسیر توسعه‌ی بازی‌های بهتر هدایت کند، نقاط ضعف را شناسایی کند و به شما کمک کند ایده‌هایتان را به سطح بالاتری برسانید',
      icon: <FaUsers className="text-4xl md:text-6xl text-primary-process" />,
    },
    {
      id: 5,
      content: (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6">
          {/* Prize Cards */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 w-full">
            {[
              { place: 1, amount: 400, amountFa: '400', emoji: '🥇', color: 'yellow' },
              { place: 2, amount: 200, amountFa: '200', emoji: '🥈', color: 'slate' },
              { place: 3, amount: 100, amountFa: '100', emoji: '🥉', color: 'orange' },
            ].map((prize) => (
              <div key={prize.place} className="flex flex-col items-center group">
                {/* Trophy Emoji */}
                <div className="relative mb-2 md:mb-3 text-2xl md:text-4xl transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">
                  <div
                    className={`absolute inset-0 rounded-full blur-lg opacity-50 animate-pulse ${
                      prize.place === 1
                        ? 'bg-yellow-400'
                        : prize.place === 2
                          ? 'bg-gray-300'
                          : 'bg-orange-400'
                    }`}
                  ></div>
                  <div className="relative">{prize.emoji}</div>
                </div>

                {/* Prize Card */}
                <div className="relative w-full">
                  <div
                    className={`absolute inset-0 rounded-lg blur-md opacity-40 animate-pulse ${
                      prize.place === 1
                        ? 'bg-yellow-400'
                        : prize.place === 2
                          ? 'bg-gray-400'
                          : 'bg-orange-400'
                    }`}
                  ></div>
                  <div
                    className={`relative bg-gradient-to-br from-blue-900/80 to-blue-950/80 backdrop-blur-sm px-2 md:px-3 py-2 md:py-3 rounded-lg border border-2 group-hover:border-orange-300 transition-all duration-300 ${
                      prize.place === 1
                        ? 'border-yellow-400/60'
                        : prize.place === 2
                          ? 'border-gray-400/60'
                          : 'border-orange-400/60'
                    }`}
                  >
                    <p
                      className={`text-sm md:text-2xl font-bold font-sans ${
                        prize.place === 1
                          ? 'text-yellow-400'
                          : prize.place === 2
                            ? 'text-gray-300'
                            : 'text-orange-400'
                      }`}
                    >
                      {prize.amountFa}
                    </p>
                    <p
                      className={`text-xs md:text-xs font-pixel ${
                        prize.place === 1
                          ? 'text-yellow-300'
                          : prize.place === 2
                            ? 'text-gray-200'
                            : 'text-orange-300'
                      }`}
                    >
                      USDT
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
      icon: <FaTrophy className="text-4xl md:text-6xl text-yellow-400 animate-bounce" />,
    },
    {
      id: 6,
      content: (
        <div className="w-full h-full flex items-center justify-center">
          {/* Timeline */}
          <div className="w-full">
            {/* Mobile Layout */}
            <div className="md:hidden flex flex-col gap-3 py-2">
              {[
                {
                  label: 'پایان ثبت‌نام',
                  date: '۱۴ آبان',
                  icon: <FaEdit className="text-white text-base" />,
                },
                {
                  label: 'افتتاحیه و اعلام تم',
                  date: '۱۴ آبان',
                  icon: <FaFlag className="text-white text-base" />,
                },
                {
                  label: 'مهلت ارسال آثار',
                  date: '۲۴ آبان',
                  icon: <FaUpload className="text-white text-base" />,
                },
                {
                  label: 'اختتامیه و اعلام برندگان',
                  date: '۲۸ آبان',
                  icon: <FaMedal className="text-white text-base" />,
                },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="flex flex-col items-center flex-shrink-0 pt-1">
                    {idx > 0 && (
                      <div className="w-0.5 h-4 bg-gradient-to-b from-orange-400 to-transparent mb-1"></div>
                    )}
                    <div className="relative">
                      <div className="absolute inset-0 bg-orange-400 rounded-full blur opacity-40 animate-pulse"></div>
                      <div className="relative w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center border-2 border-gray-900 shadow-lg z-10">
                        {item.icon}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 bg-gradient-to-br from-blue-900/60 to-blue-800/60 backdrop-blur-sm rounded-md p-2 border border-blue-700/50 hover:border-orange-400/50 transition-all group">
                    <p className="text-orange-400 font-pixel font-bold text-xs group-hover:text-orange-300 transition-colors">
                      {item.label}
                    </p>
                    <p className="text-white font-pixel text-sm font-bold mt-0.5 group-hover:text-orange-200 transition-colors">
                      {item.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Layout - 2x2 Grid */}
            <div className="hidden md:block">
              <div className="relative w-full py-4 px-2">
                {/* SVG Connecting Lines */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="timelineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgb(249, 115, 22)" />
                      <stop offset="50%" stopColor="rgb(251, 191, 36)" />
                      <stop offset="100%" stopColor="rgb(249, 115, 22)" />
                    </linearGradient>
                  </defs>

                  {/* Top line */}
                  <line
                    x1="12%"
                    y1="22%"
                    x2="88%"
                    y2="22%"
                    stroke="url(#timelineGrad)"
                    strokeWidth="2"
                  />
                  {/* Right line */}
                  <line
                    x1="88%"
                    y1="22%"
                    x2="88%"
                    y2="78%"
                    stroke="url(#timelineGrad)"
                    strokeWidth="2"
                  />
                  {/* Bottom line */}
                  <line
                    x1="88%"
                    y1="78%"
                    x2="12%"
                    y2="78%"
                    stroke="url(#timelineGrad)"
                    strokeWidth="2"
                  />
                  {/* Left line */}
                  <line
                    x1="12%"
                    y1="78%"
                    x2="12%"
                    y2="22%"
                    stroke="url(#timelineGrad)"
                    strokeWidth="2"
                  />
                </svg>

                {/* Timeline Items Grid */}
                <div className="grid grid-cols-2 gap-6 relative z-10">
                  {[
                    {
                      label: 'پایان ثبت‌نام',
                      date: '۱۴ آبان',
                      icon: <FaEdit className="text-white text-lg" />,
                    },
                    {
                      label: 'افتتاحیه و اعلام تم',
                      date: '۱۴ آبان',
                      icon: <FaFlag className="text-white text-lg" />,
                    },
                    {
                      label: 'مهلت ارسال آثار',
                      date: '۲۴ آبان',
                      icon: <FaUpload className="text-white text-lg" />,
                    },
                    {
                      label: 'اختتامیه و اعلام برندگان',
                      date: '۲۸ آبان',
                      icon: <FaMedal className="text-white text-lg" />,
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="relative mb-3 flex flex-col items-center">
                        <div className="absolute -inset-2 bg-orange-400 rounded-full blur opacity-40 animate-pulse"></div>
                        <div className="relative w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center border-2 border-gray-900 shadow-lg z-20">
                          {item.icon}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-900/70 to-blue-800/70 backdrop-blur-sm rounded-lg p-3 border border-blue-700/50 hover:border-orange-400/50 transition-all group w-full text-center min-h-20 flex flex-col justify-center">
                        <p className="text-orange-400 font-pixel font-bold text-xs group-hover:text-orange-300 transition-colors line-clamp-2">
                          {item.label}
                        </p>
                        <p className="text-white font-pixel text-sm font-bold mt-1.5 group-hover:text-orange-200 transition-colors">
                          {item.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      icon: <FaClock className="text-4xl md:text-6xl text-orange-400 animate-pulse" />,
    },
  ];

  const reversedPages = useMemo(() => [...pages].reverse(), [pages]);

  const nextPage = useCallback(() => {
    if (currentPage < pages.length - 1) {
      setAnimDirection('right');
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, pages.length]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      setAnimDirection('left');
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  // Add swipe/horizontal scroll support
  useScrollInterceptor(contentRef, {
    onLeft: nextPage,
    onRight: prevPage,
  });

  useEffect(() => {
    if (isAnimatingOut) {
      const timeout = setTimeout(() => {
        setCurrentPage((prev) => (animDirection === 'right' ? prev + 1 : prev - 1));
        setIsAnimatingOut(false); // triggers animate in automatically
      }, 250); // duration of animate-out CSS
      return () => clearTimeout(timeout);
    }
  }, [isAnimatingOut, animDirection]);

  return (
    <section
      ref={ref}
      className="floor bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{ backgroundImage: `url(${bgGameJam})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div className="relative h-full flex flex-col items-center justify-between py-4 md:py-8 px-4">
        {/* Title */}
        <div className="text-center mb-2 md:mb-4">
          <h1 className="text-4xl md:text-7xl font-bold text-white font-pixel mb-2 md:mb-4 animate-pulse mt-8 md:mt-24">
            Game Jam
          </h1>
          <div className="w-full max-w-md h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto"></div>
        </div>

        {/* Prize Pool - Always visible except on timeline page */}
        {currentPage !== 6 && (
          <div className="w-full flex justify-center px-4 mb-2">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 rounded-lg blur-lg opacity-75 animate-pulse"></div>
              <div className="relative bg-gradient-to-b from-gray-900 to-black rounded-lg px-6 md:px-8 py-2 md:py-3 border-2 border-orange-400 shadow-lg">
                <p className="text-orange-400 font-pixel text-xs md:text-sm font-bold flex justify-center">
                  TOTAL PRIZE POOL
                </p>
                <p className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 font-sans font-extrabold animate-pulse">
                  700+ USDT
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div
          className="flex-1 w-full max-w-4xl mx-auto flex items-center justify-center relative"
          ref={contentRef}
        >
          {/* Navigation Buttons */}
          <button
            onClick={nextPage}
            className={`absolute left-0 p-3 rounded-full bg-primary-oxfordblue hover:bg-primary-cerulean transition z-10 ${
              currentPage === pages.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={currentPage === pages.length - 1}
          >
            <FaChevronLeft className="text-2xl text-white" />
          </button>

          <PixelFrame className="bg-primary-midnight w-full mx-12">
            <div
              key={currentPage}
              className={`p-6 md:p-8 flex flex-col items-center gap-6 text-center animate-page-change-${animDirection}`}
            >
              {pages[currentPage].icon}
              <div className="text-white text-lg md:text-xl leading-relaxed">
                {pages[currentPage].content}
              </div>
            </div>
          </PixelFrame>

          <button
            onClick={prevPage}
            className={`absolute right-0 p-3 rounded-full bg-primary-oxfordblue hover:bg-primary-cerulean transition z-10 ${
              currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={currentPage === 0}
          >
            <FaChevronRight className="text-2xl text-white" />
          </button>
        </div>

        {/* Page Indicators */}
        <div className="mt-4 md:mt-8 mb-2 md:mb-0 flex gap-2 cursor-pointer">
          {reversedPages.map((page, reversedIndex) => {
            const index = pages.length - 1 - reversedIndex;
            return (
              <div
                key={page.id}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentPage === index
                    ? 'bg-primary-sky w-6'
                    : 'bg-primary-oxfordblue hover:bg-primary-midnight'
                }`}
                onClick={() => {
                  setAnimDirection(index > currentPage ? 'right' : 'left');
                  setCurrentPage(index);
                }}
              />
            );
          })}
        </div>

        {/* Swipe hint text */}
        <p className="text-white font-normal text-xs md:text-sm opacity-75 mb-2">
          → اسکرول افقی برای تغییر صفحه ←
        </p>
      </div>
    </section>
  );
});

export default GameJamFloor;
