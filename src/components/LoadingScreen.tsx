import { type CSSProperties, useEffect, useState } from 'react';

import bgLoading from '@/assets/bkg_loading.png';
import logo from '@/assets/logo.svg';
import ramzImg from '@/assets/ramz.png';
import sharifImg from '@/assets/Sharif.png';
import { useImagePreloader } from '@/hooks/useImagePreloader';

interface LoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
  imagesToPreload?: string[];
}

export default function LoadingScreen({
  onComplete,
  duration = 4000,
  imagesToPreload = [],
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');

  const { loaded: imagesLoaded, progress: imageProgress } = useImagePreloader(imagesToPreload);

  // Progress logic - never decrease
  useEffect(() => {
    const startTime = Date.now();
    let lastProgress = 0;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const timeProgress = Math.min((elapsed / duration) * 100, 100);
      const combinedProgress =
        imagesToPreload.length > 0 ? timeProgress * 0.7 + imageProgress * 0.3 : timeProgress;

      const newProgress = Math.max(lastProgress, combinedProgress);
      lastProgress = newProgress;
      setProgress(newProgress);

      const shouldComplete = timeProgress >= 100 && (imagesToPreload.length === 0 || imagesLoaded);
      if (shouldComplete) {
        clearInterval(interval);
        if (onComplete) setTimeout(onComplete, 200);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [duration, onComplete, imageProgress, imagesLoaded, imagesToPreload.length]);

  // Animated dots
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev: string) => (prev.length < 3 ? prev + '.' : ''));
    }, 500);
    return () => clearInterval(dotInterval);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center bg-cover bg-center bg-no-repeat overflow-hidden relative w-screen h-screen p-100"
      style={{
        backgroundImage: `url(${bgLoading})`,
      }}
    >
      {/* Background overlay to avoid bottom color line */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      {/* Container with proper spacing */}
      <div className="w-full h-full flex flex-col items-center px-2 sm:px-4 relative z-10 justify-around sm:py-100">
        {/* Top: Logo */}
        <div className="animate-pulse pt-2 sm:pt-3 md:pt-4 flex-shrink-0">
          <img
            src={logo}
            alt="BugsBuzzy"
            className="w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 drop-shadow-lg mx-auto mt-100"
          />
        </div>

        {/* Middle: Text + Progress */}
        <div className="flex flex-col items-center justify-center text-center w-full px-3">
          <p
            className="text-3xl sm:text-5xl md:text-6xl font-pixel text-white tracking-widest mb-6 sm:mb-8 md:mb-10"
            style={
              {
                WebkitTextStroke: '1.5px rgba(0,0,0,0.5)',
                paintOrder: 'stroke fill',
              } as CSSProperties
            }
          >
            درحال بارگذاری
            <span className="inline-block w-7 sm:w-10 md:w-16 text-right">{dots}</span>
          </p>

          <div className="w-full max-w-sm sm:max-w-md md:max-w-2xl px-3">
            <div className="relative h-3 sm:h-4 md:h-6 bg-gray-700 rounded-full overflow-hidden border-2 md:border-3 border-gray-600 shadow-lg">
              <div
                className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 rounded-full transition-all duration-100 shadow-lg relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-shimmer" />
              </div>
            </div>
            <p className="text-center text-gray-300 font-pixel text-sm sm:text-base md:text-lg mt-3">
              {Math.round(progress)}%
            </p>
          </div>
        </div>

        {/* Bottom: Logos */}
        <div className="flex flex-row items-center justify-center gap-6 sm:gap-12 md:gap-16 pb-6 sm:pb-8 md:pb-10 flex-wrap flex-shrink-0 mb-100">
          <img
            src={sharifImg}
            alt="Sharif University"
            className="h-20 sm:h-28 md:h-32 object-contain drop-shadow-lg hover:drop-shadow-xl transition-all"
          />
          <img
            src={ramzImg}
            alt="Ramz"
            className="h-20 sm:h-28 md:h-32 object-contain drop-shadow-lg hover:drop-shadow-xl transition-all"
          />
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-orange-400/10 animate-float"
            style={{
              width: Math.random() * 80 + 40 + 'px',
              height: Math.random() * 80 + 40 + 'px',
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
