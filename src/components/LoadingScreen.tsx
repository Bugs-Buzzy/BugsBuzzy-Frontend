import { useEffect, useState } from 'react';

import bgLoading from '@/assets/bkg_loading.png';
import logo from '@/assets/logo.svg';
import ramzImg from '@/assets/ramz.png';
import sharifImg from '@/assets/Sharif.png';

interface LoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export default function LoadingScreen({ onComplete, duration = 7000 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');

  // Progress bar animation
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        if (onComplete) {
          setTimeout(onComplete, 200);
        }
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  // Animated dots
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev: string) => {
        if (prev.length < 3) return prev + '.';
        return '';
      });
    }, 500);

    return () => clearInterval(dotInterval);
  }, []);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgLoading})` }}
    >
      {/* Logo */}
      <div className="mb-12 md:mb-16 animate-pulse">
        <img src={logo} alt="BugsBuzzy" className="w-32 h-32 md:w-48 md:h-48 drop-shadow-lg" />
      </div>

      {/* Loading Text with animated dots */}
      <div className="text-center mb-16 md:mb-20">
        <p 
          className="text-4xl md:text-6xl font-pixel text-white tracking-widest min-h-[3.5rem] md:min-h-[5rem]"
          style={{
            textStroke: '2px rgba(0,0,0,0.5)',
            WebkitTextStroke: '2px rgba(0,0,0,0.5)',
            paintOrder: 'stroke fill',
          }}
        >
          Loading<span className="inline-block w-16 md:w-24 text-left">{dots}</span>
        </p>
      </div>

      {/* Progress Bar Container */}
      <div className="w-72 md:w-96 mb-16 md:mb-20">
        {/* Progress Bar Background */}
        <div className="relative h-3 md:h-4 bg-gray-700 rounded-full overflow-hidden border-2 border-gray-600 shadow-lg">
          {/* Progress Bar Fill - RTL (Right to Left) */}
          <div
            className="h-full bg-gradient-to-l from-orange-400 via-orange-500 to-orange-400 rounded-full transition-all duration-100 shadow-lg"
            style={{ width: `${progress}%`, marginLeft: 'auto' }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white to-transparent opacity-50 animate-shimmer" />
          </div>
        </div>

        {/* Progress percentage */}
        <p className="text-center text-gray-300 font-pixel text-sm md:text-base mt-3">{Math.round(progress)}%</p>
      </div>

      {/* Sponsors/Partners Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16 mt-12">
        {/* Sharif Image */}
        <div className="flex flex-col items-center">
          <img
            src={sharifImg}
            alt="Sharif University"
            className="h-20 md:h-28 object-contain drop-shadow-lg hover:drop-shadow-xl transition-all"
          />
        </div>

        {/* Ramz Image */}
        <div className="flex flex-col items-center">
          <img
            src={ramzImg}
            alt="Ramz"
            className="h-20 md:h-28 object-contain drop-shadow-lg hover:drop-shadow-xl transition-all"
          />
        </div>
      </div>

      {/* Optional: Floating particles background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-orange-400/10 animate-float"
            style={{
              width: Math.random() * 100 + 50 + 'px',
              height: Math.random() * 100 + 50 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 2 + 's',
            }}
          />
        ))}
      </div>
    </div>
  );
}
