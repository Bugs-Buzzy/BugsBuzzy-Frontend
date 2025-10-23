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

  // Preload images during loading screen
  const { loaded: imagesLoaded, progress: imageProgress } = useImagePreloader(imagesToPreload);

  // Progress bar animation - combines time-based and image loading progress
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const timeProgress = Math.min((elapsed / duration) * 100, 100);

      // Combine time progress (70% weight) with image loading progress (30% weight)
      // This ensures loading completes even if images fail
      const combinedProgress =
        imagesToPreload.length > 0 ? timeProgress * 0.7 + imageProgress * 0.3 : timeProgress;

      setProgress(combinedProgress);

      // Complete when both time has elapsed AND images are loaded (or no images to load)
      const shouldComplete = timeProgress >= 100 && (imagesToPreload.length === 0 || imagesLoaded);

      if (shouldComplete) {
        clearInterval(interval);
        if (onComplete) {
          setTimeout(onComplete, 200);
        }
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [duration, onComplete, imageProgress, imagesLoaded, imagesToPreload.length]);

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
      <div className="mb-16 md:mb-20 animate-pulse">
        <img src={logo} alt="BugsBuzzy" className="w-40 h-40 md:w-56 md:h-56 drop-shadow-lg" />
      </div>

      {/* Loading Text with animated dots */}
      <div className="text-center mb-20 md:mb-28">
        <p
          className="text-5xl md:text-7xl font-pixel text-white tracking-widest min-h-[3.5rem] md:min-h-[6rem]"
          style={
            {
              WebkitTextStroke: '2px rgba(0,0,0,0.5)',
              paintOrder: 'stroke fill',
            } as CSSProperties
          }
        >
          درحال بارگزاری
          <span className="inline-block w-10 md:w-20 text-right">{dots}</span>
        </p>
      </div>

      {/* Progress Bar Container */}
      <div className="w-80 md:w-full md:max-w-2xl px-4 md:px-0 mb-20 md:mb-28">
        {/* Progress Bar Background */}
        <div className="relative h-4 md:h-6 bg-gray-700 rounded-full overflow-hidden border-2 md:border-3 border-gray-600 shadow-lg">
          {/* Progress Bar Fill - Left to Right */}
          <div
            className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 rounded-full transition-all duration-100 shadow-lg"
            style={{ width: `${progress}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer" />
          </div>
        </div>

        {/* Progress percentage */}
        <p className="text-center text-gray-300 font-pixel text-base md:text-lg mt-4">
          {Math.round(progress)}%
        </p>
      </div>

      {/* Sponsors/Partners Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-20">
        {/* Sharif Image */}
        <div className="flex flex-col items-center">
          <img
            src={sharifImg}
            alt="Sharif University"
            className="h-24 md:h-32 object-contain drop-shadow-lg hover:drop-shadow-xl transition-all"
          />
        </div>

        {/* Ramz Image */}
        <div className="flex flex-col items-center">
          <img
            src={ramzImg}
            alt="Ramz"
            className="h-24 md:h-32 object-contain drop-shadow-lg hover:drop-shadow-xl transition-all"
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
