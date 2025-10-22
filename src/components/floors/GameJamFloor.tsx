import { forwardRef, useState, useEffect, useRef } from 'react';
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
        'در این بخش باگزبازی میتوانید در قالب تیم های 1 الی 6 نفره در مسابقه شرکت کنید و بر اساس تم مسابقه بازی های خود را از ایده تا اجرا پیش ببرید',
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
        <div className="w-full h-full overflow-y-auto">
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {[
              { place: 1, amount: 400, color: 'yellow', emoji: '🥇' },
              { place: 2, amount: 200, color: 'slate', emoji: '🥈' },
              { place: 3, amount: 100, color: 'amber', emoji: '🥉' },
            ].map((prize) => (
              <div key={prize.place} className="flex flex-col items-center group">
                {/* Trophy with animation */}
                <div className="relative mb-2 md:mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  <div className={`absolute inset-0 rounded-full blur-lg opacity-50 animate-pulse ${
                    prize.place === 1 ? 'bg-yellow-400' : prize.place === 2 ? 'bg-gray-300' : 'bg-orange-500'
                  }`}></div>
                  <div className="relative text-2xl md:text-5xl lg:text-6xl">{prize.emoji}</div>
                </div>
                
                {/* Prize card with glow */}
                <div className="relative w-full">
                  <div className={`absolute inset-0 rounded-lg md:rounded-2xl blur-lg opacity-40 animate-pulse ${
                    prize.place === 1 ? 'bg-yellow-400' : prize.place === 2 ? 'bg-gray-400' : 'bg-orange-500'
                  }`}></div>
                  <div className={`relative bg-gradient-to-br from-blue-900/80 to-blue-950/80 backdrop-blur-sm px-2 md:px-4 py-3 md:py-6 rounded-lg md:rounded-2xl text-center border border-2 group-hover:border-orange-400 transition-all ${
                    prize.place === 1 ? 'border-yellow-400/50' : prize.place === 2 ? 'border-gray-400/50' : 'border-orange-500/50'
                  }`}>
                    <p className={`text-lg md:text-3xl lg:text-4xl font-bold font-pixel ${
                      prize.place === 1 ? 'text-yellow-400' : prize.place === 2 ? 'text-gray-300' : 'text-orange-500'
                    }`}>
                      {prize.amount}
                    </p>
                    <p className={`text-xs md:text-sm font-pixel mt-0.5 md:mt-1 ${
                      prize.place === 1 ? 'text-yellow-300' : prize.place === 2 ? 'text-gray-200' : 'text-orange-400'
                    }`}>
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
        <div className="w-full h-full px-2 md:px-0">
          {/* Mobile Layout - Vertical timeline */}
          <div className="md:hidden">
            <div className="flex flex-col gap-4 py-4 px-2">
              {[
                { label: 'پایان ثبت‌نام', date: '14 آبان', icon: <FaEdit className="text-white text-lg" /> },
                { label: 'افتتاحیه و اعلام تم', date: '14 آبان', icon: <FaFlag className="text-white text-lg" /> },
                { label: 'مهلت ارسال آثار', date: '24 آبان', icon: <FaUpload className="text-white text-lg" /> },
                { label: 'اختتامیه و اعلام برندگان', date: '28 آبان', icon: <FaMedal className="text-white text-lg" /> },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  {/* Vertical line and circle */}
                  <div className="flex flex-col items-center">
                    {idx > 0 && <div className="w-0.5 h-8 bg-gradient-to-b from-orange-400 to-transparent"></div>}
                    <div className="relative">
                      <div className="absolute inset-0 bg-orange-400 rounded-full blur opacity-50 animate-pulse"></div>
                      <div className="relative w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center border-2 border-gray-900 shadow-lg">
                        {item.icon}
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 bg-gradient-to-br from-blue-900/60 to-blue-800/60 backdrop-blur-sm rounded-lg p-3 border border-blue-700/50 hover:border-orange-400/50 transition-all group mt-1">
                    <p className="text-orange-400 font-pixel font-bold text-sm group-hover:text-orange-300 transition-colors">
                      {item.label}
                    </p>
                    <p className="text-white font-pixel text-base font-bold mt-1 group-hover:text-orange-200 transition-colors">
                      {item.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Layout - 2x2 Grid with connecting lines */}
          <div className="hidden md:flex md:flex-col md:h-full md:justify-center">
            <div className="relative px-4 py-8">
              {/* Connecting lines container */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ left: 0, top: 0 }}>
                {/* Top-left to top-right line */}
                <line x1="15%" y1="25%" x2="85%" y2="25%" stroke="url(#gradient1)" strokeWidth="2" />
                {/* Top-right to bottom-right line */}
                <line x1="85%" y1="25%" x2="85%" y2="75%" stroke="url(#gradient1)" strokeWidth="2" />
                {/* Bottom-right to bottom-left line */}
                <line x1="85%" y1="75%" x2="15%" y2="75%" stroke="url(#gradient1)" strokeWidth="2" />
                {/* Bottom-left to start line */}
                <line x1="15%" y1="75%" x2="15%" y2="25%" stroke="url(#gradient1)" strokeWidth="2" />
                
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgb(249, 115, 22)" stopOpacity="1" />
                    <stop offset="50%" stopColor="rgb(251, 191, 36)" stopOpacity="1" />
                    <stop offset="100%" stopColor="rgb(249, 115, 22)" stopOpacity="1" />
                  </linearGradient>
                </defs>
              </svg>

              {/* 2x2 Grid */}
              <div className="grid grid-cols-2 gap-6 relative z-10">
                {/* Top-Right: پایان ثبت‌نام */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-orange-400 rounded-full blur opacity-60 animate-pulse"></div>
                    <div className="relative w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center border-3 border-gray-900 shadow-lg">
                      <FaEdit className="text-white text-xl" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-900/70 to-blue-800/70 backdrop-blur-sm rounded-xl p-4 border border-blue-700/50 hover:border-orange-400/50 transition-all group w-full text-center min-h-24 flex flex-col justify-center">
                    <p className="text-orange-400 font-pixel font-bold text-sm group-hover:text-orange-300 transition-colors">
                      پایان ثبت‌نام
                    </p>
                    <p className="text-white font-pixel text-lg font-bold mt-2 group-hover:text-orange-200 transition-colors">
                      14 آبان
                    </p>
                  </div>
                </div>

                {/* Top-Left: افتتاحیه و اعلام تم */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-orange-400 rounded-full blur opacity-60 animate-pulse"></div>
                    <div className="relative w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center border-3 border-gray-900 shadow-lg">
                      <FaFlag className="text-white text-xl" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-900/70 to-blue-800/70 backdrop-blur-sm rounded-xl p-4 border border-blue-700/50 hover:border-orange-400/50 transition-all group w-full text-center min-h-24 flex flex-col justify-center">
                    <p className="text-orange-400 font-pixel font-bold text-sm group-hover:text-orange-300 transition-colors">
                      افتتاحیه و اعلام تم
                    </p>
                    <p className="text-white font-pixel text-lg font-bold mt-2 group-hover:text-orange-200 transition-colors">
                      14 آبان
                    </p>
                  </div>
                </div>

                {/* Bottom-Left: مهلت ارسال آثار */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-orange-400 rounded-full blur opacity-60 animate-pulse"></div>
                    <div className="relative w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center border-3 border-gray-900 shadow-lg">
                      <FaUpload className="text-white text-xl" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-900/70 to-blue-800/70 backdrop-blur-sm rounded-xl p-4 border border-blue-700/50 hover:border-orange-400/50 transition-all group w-full text-center min-h-24 flex flex-col justify-center">
                    <p className="text-orange-400 font-pixel font-bold text-sm group-hover:text-orange-300 transition-colors">
                      مهلت ارسال آثار
                    </p>
                    <p className="text-white font-pixel text-lg font-bold mt-2 group-hover:text-orange-200 transition-colors">
                      24 آبان
                    </p>
                  </div>
                </div>

                {/* Bottom-Right: اختتامیه و اعلام برندگان */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-orange-400 rounded-full blur opacity-60 animate-pulse"></div>
                    <div className="relative w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center border-3 border-gray-900 shadow-lg">
                      <FaMedal className="text-white text-xl" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-900/70 to-blue-800/70 backdrop-blur-sm rounded-xl p-4 border border-blue-700/50 hover:border-orange-400/50 transition-all group w-full text-center min-h-24 flex flex-col justify-center">
                    <p className="text-orange-400 font-pixel font-bold text-sm group-hover:text-orange-300 transition-colors">
                      اختتامیه و اعلام برندگان
                    </p>
                    <p className="text-white font-pixel text-lg font-bold mt-2 group-hover:text-orange-200 transition-colors">
                      28 آبان
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      icon: <FaClock className="text-4xl md:text-6xl text-orange-400 animate-pulse" />,
    },
  ];

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setAnimDirection('right');
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setAnimDirection('left');
      setCurrentPage((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (isAnimatingOut) {
      const timeout = setTimeout(() => {
        setCurrentPage((prev) => (animDirection === 'right' ? prev + 1 : prev - 1));
        setIsAnimatingOut(false); // triggers animate in automatically
      }, 250); // duration of animate-out CSS
      return () => clearTimeout(timeout);
    }
  }, [isAnimatingOut, animDirection]);

  const messageRef = useRef<HTMLDivElement>(null);
  useScrollInterceptor(messageRef, { onLeft: prevPage, onRight: nextPage });

  return (
    <section
      ref={ref}
      className="floor bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{ backgroundImage: `url(${bgGameJam})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div className="relative h-full flex flex-col items-center justify-start py-4 md:py-8 px-4 md:px-8">
        {/* Always visible title - lower on mobile */}
        <div className="text-center w-full mb-2 md:mb-6">
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold text-white font-pixel mb-2 md:mb-4 animate-pulse">
            Game Jam
          </h1>
          <div className="w-full max-w-2xl h-0.5 md:h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto"></div>
        </div>

        {/* Prize Pool - Only show on first page */}
        <div className={`transition-all duration-500 mb-2 md:mb-6 ${
          currentPage === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 rounded-xl md:rounded-2xl blur opacity-75 animate-pulse"></div>
            <div className="relative bg-gradient-to-b from-gray-900 to-black rounded-xl md:rounded-2xl px-4 md:px-8 py-2 md:py-4 border-2 border-orange-400">
              <p className="text-orange-400 font-pixel text-xs md:text-sm">TOTAL PRIZE POOL</p>
              <p className="text-xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 font-pixel mt-1">
                700+ USDT
              </p>
            </div>
          </div>
        </div>

        {/* Content - Flex-1 to fill available space */}
        <div
          className="flex-1 w-full flex items-center justify-center relative px-2 md:px-4 min-h-0"
          ref={messageRef}
        >
          {/* Navigation Buttons */}
          <button
            onClick={nextPage}
            className={`absolute left-0 p-1.5 md:p-3 rounded-full bg-primary-oxfordblue hover:bg-primary-cerulean transition z-10 flex-shrink-0 ${
              currentPage === pages.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={currentPage === pages.length - 1}
          >
            <FaChevronLeft className="text-lg md:text-2xl text-white" />
          </button>

          <PixelFrame className="bg-primary-midnight w-full md:max-w-2xl mx-2 md:mx-12 flex-1 max-h-full overflow-y-auto">
            <div
              key={currentPage}
              className={`p-3 md:p-8 flex flex-col items-center gap-3 md:gap-6 text-center animate-page-change-${animDirection}`}
            >
              {pages[currentPage].icon}
              <div className="text-white text-sm md:text-lg lg:text-xl leading-relaxed overflow-y-auto max-h-96">
                {pages[currentPage].content}
              </div>
            </div>
          </PixelFrame>

          <button
            onClick={prevPage}
            className={`absolute right-0 p-1.5 md:p-3 rounded-full bg-primary-oxfordblue hover:bg-primary-cerulean transition z-10 flex-shrink-0 ${
              currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={currentPage === 0}
          >
            <FaChevronRight className="text-lg md:text-2xl text-white" />
          </button>
        </div>

        {/* Page Indicators */}
        <div className="mt-3 md:mt-6 flex gap-2">
          {pages.map((page) => (
            <div
              key={page.id}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 cursor-pointer ${
                currentPage === page.id
                  ? 'bg-primary-sky w-4 md:w-6'
                  : 'bg-primary-oxfordblue hover:bg-primary-midnight'
              }`}
              onClick={() => {
                setCurrentPage(page.id);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

export default GameJamFloor;
