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
        'در این بخش باگزبازی میتوانید در غالب تیم های 1 الی 6 نفره در مسابقه شرکت کنید و بر اساس تم مسابقه بازی های خود را از ایده تا اجرا پیش ببرید',
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
        <div className="w-full">
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            {[
              { place: 1, amount: 400, color: 'yellow', emoji: '🥇' },
              { place: 2, amount: 200, color: 'slate', emoji: '🥈' },
              { place: 3, amount: 100, color: 'amber', emoji: '🥉' },
            ].map((prize) => (
              <div key={prize.place} className="flex flex-col items-center group">
                {/* Trophy with animation */}
                <div className="relative mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  <div className={`absolute inset-0 rounded-full blur-lg opacity-50 animate-pulse ${
                    prize.place === 1 ? 'bg-yellow-400' : prize.place === 2 ? 'bg-gray-300' : 'bg-orange-500'
                  }`}></div>
                  <div className="relative text-4xl md:text-6xl">{prize.emoji}</div>
                </div>
                
                {/* Prize card with glow */}
                <div className="relative w-full">
                  <div className={`absolute inset-0 rounded-2xl blur-lg opacity-40 animate-pulse ${
                    prize.place === 1 ? 'bg-yellow-400' : prize.place === 2 ? 'bg-gray-400' : 'bg-orange-500'
                  }`}></div>
                  <div className={`relative bg-gradient-to-br from-blue-900/80 to-blue-950/80 backdrop-blur-sm px-4 py-6 rounded-2xl text-center border-2 group-hover:border-orange-400 transition-all border-${
                    prize.place === 1 ? 'yellow-400/50' : prize.place === 2 ? 'gray-400/50' : 'orange-500/50'
                  }`}>
                    <p className={`text-3xl md:text-4xl font-bold font-pixel ${
                      prize.place === 1 ? 'text-yellow-400' : prize.place === 2 ? 'text-gray-300' : 'text-orange-500'
                    }`}>
                      {prize.amount}
                    </p>
                    <p className={`text-xs md:text-sm font-pixel mt-1 ${
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
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* Vertical connecting line for mobile, horizontal for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent transform -translate-y-1/2"></div>
            <div className="md:hidden absolute top-0 bottom-0 left-1/2 w-0.5 bg-gradient-to-b from-transparent via-orange-400 to-transparent transform -translate-x-1/2"></div>
            
            {/* Timeline items */}
            {[
              { label: 'پایان ثبت‌نام', date: '14 آبان', icon: <FaEdit className="text-white text-lg md:text-2xl" /> },
              { label: 'افتتاحیه و اعلام تم', date: '14 آبان', icon: <FaFlag className="text-white text-lg md:text-2xl" /> },
              { label: 'مهلت ارسال آثار', date: '24 آبان', icon: <FaUpload className="text-white text-lg md:text-2xl" /> },
              { label: 'اختتامیه و اعلام برندگان', date: '28 آبان', icon: <FaMedal className="text-white text-lg md:text-2xl" /> },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center relative">
                {/* Circle with icon */}
                <div className="absolute -top-3 md:top-1/2 left-1/2 transform -translate-x-1/2 md:-translate-y-1/2 z-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-orange-400 rounded-full blur opacity-50 animate-pulse"></div>
                    <div className="relative w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center border-4 border-gray-900 shadow-lg">
                      {item.icon}
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="mt-10 md:mt-0 bg-gradient-to-br from-blue-900/50 to-blue-800/50 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-blue-700/50 hover:border-orange-400/50 transition-all group">
                  <p className="text-orange-400 font-pixel font-bold text-sm md:text-base group-hover:text-orange-300 transition-colors">
                    {item.label}
                  </p>
                  <p className="text-white font-pixel text-lg md:text-2xl font-bold mt-2 group-hover:text-orange-200 transition-colors">
                    {item.date}
                  </p>
                </div>
              </div>
            ))}
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

      <div className="relative h-full flex flex-col items-center justify-between py-8 px-4">
        {/* Title with Prize Animation - Only show on first page */}
        <div className={`text-center mb-8 mt-8 md:mt-12 transition-all duration-500 ${
          currentPage === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}>
          <h1 className="text-6xl md:text-8xl font-bold text-white font-pixel mb-6 animate-pulse">
            Game Jam
          </h1>
          
          {/* Prize Counter with Animation */}
          <div className="inline-block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 rounded-2xl blur opacity-75 animate-pulse"></div>
              <div className="relative bg-gradient-to-b from-gray-900 to-black rounded-2xl px-8 py-4 border-2 border-orange-400">
                <p className="text-orange-400 font-pixel text-sm">TOTAL PRIZE POOL</p>
                <p className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 font-pixel mt-2">
                  700+ USDT
                </p>
              </div>
            </div>
          </div>
          
          <div className="w-full max-w-2xl h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto mt-6"></div>
        </div>

        {/* Title - Show on other pages */}
        <div className={`text-center mb-8 mt-8 md:mt-12 transition-all duration-500 ${
          currentPage !== 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}>
          <h1 className="text-6xl md:text-8xl font-bold text-white font-pixel mb-6 animate-pulse">
            Game Jam
          </h1>
          <div className="w-full max-w-2xl h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto"></div>
        </div>

        {/* Content */}
        <div
          className="flex-1 w-full max-w-4xl mx-auto flex items-center justify-center relative"
          ref={messageRef}
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
        <div className="mt-8 flex gap-2">
          {pages.map((page) => (
            <div
              key={page.id}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentPage === page.id
                  ? 'bg-primary-sky w-6'
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
