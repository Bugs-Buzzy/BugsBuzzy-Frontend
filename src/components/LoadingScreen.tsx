import { useEffect, useState } from 'react';
import logo from '@/assets/logo.svg';
import sharifImg from '@/assets/images/sharif.png';
import ramzImg from '@/assets/images/ramz.png';

interface LoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export default function LoadingScreen({ onComplete, duration = 3000 }: LoadingScreenProps) {
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
      setDots((prev) => {
        if (prev.length < 3) return prev + '.';
        return '';
      });
    }, 500);

    return () => clearInterval(dotInterval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center z-50">
      {/* Logo */}
      <div className="mb-8 animate-pulse">
        <img src={logo} alt="BugsBuzzy" className="w-24 h-24 md:w-32 md:h-32 drop-shadow-lg" />
      </div>

      {/* Loading Text with animated dots */}
      <div className="text-center mb-12">
        <p className="text-2xl md:text-3xl font-pixel text-white tracking-widest min-h-[2.5rem]">
          Loading<span className="inline-block w-12 text-left">{dots}</span>
        </p>
      </div>

      {/* Progress Bar Container */}
      <div className="w-64 md:w-80 mb-12">
        {/* Progress Bar Background */}
        <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden border border-gray-600 shadow-lg">
          {/* Progress Bar Fill */}
          <div
            className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 rounded-full transition-all duration-100 shadow-lg"
            style={{ width: `${progress}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer" />
          </div>
        </div>

        {/* Progress percentage */}
        <p className="text-center text-gray-400 font-pixel text-xs mt-2">
          {Math.round(progress)}%
        </p>
      </div>

      {/* Sponsors/Partners Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 mt-8">
        {/* Sharif Image */}
        <div className="flex flex-col items-center">
          <img
            src={sharifImg}
            alt="Sharif University"
            className="h-12 md:h-16 object-contain drop-shadow-lg hover:drop-shadow-xl transition-all"
          />
        </div>

        {/* Ramz Image */}
        <div className="flex flex-col items-center">
          <img
            src={ramzImg}
            alt="Ramz"
            className="h-12 md:h-16 object-contain drop-shadow-lg hover:drop-shadow-xl transition-all"
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
