import { useEffect, useRef } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

export interface Phase {
  id: number;
  title: string;
  icon: string;
  status: 'locked' | 'current' | 'completed' | 'available';
  isClickable: boolean;
}

interface ProgressBarProps {
  phases: Phase[];
  currentPhase: number;
  onPhaseClick: (phaseId: number) => void;
}

export default function ProgressBar({ phases, currentPhase, onPhaseClick }: ProgressBarProps) {
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const currentPhaseButtonRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to current phase on mobile
  useEffect(() => {
    if (currentPhaseButtonRef.current && mobileScrollRef.current) {
      setTimeout(() => {
        currentPhaseButtonRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }, 100);
    }
  }, [currentPhase]);

  return (
    <div className="relative">
      {/* Container with pixel border */}
      <div className="bg-primary-oxfordblue rounded-lg p-6 border-4 border-primary-cerulean shadow-xl relative overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px)`,
            }}
          />
        </div>

        {/* Progress Track */}
        <div className="relative">
          {/* Desktop View */}
          <div className="hidden md:flex overflow-x-auto items-center justify-center gap-4">
            {phases.map((phase, index) => (
              <div key={phase.id} className="flex items-center">
                {/* Phase Node */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => phase.isClickable && onPhaseClick(phase.id)}
                    disabled={!phase.isClickable}
                    className={`
                      group relative
                      ${phase.isClickable ? 'cursor-pointer' : 'cursor-default'}
                    `}
                  >
                    {/* Node Circle */}
                    <div
                      className={`
                      relative w-20 h-20 rounded-lg flex items-center justify-center
                      border-4 transition-all duration-300
                      ${phase.status === 'locked' && 'bg-gray-800 border-gray-700 opacity-50'}
                      ${phase.status === 'available' && 'bg-primary-midnight border-primary-aero'}
                      ${phase.status === 'current' && 'bg-primary-cerulean border-primary-sky shadow-lg shadow-primary-cerulean/50 animate-pulse'}
                      ${phase.status === 'completed' && 'bg-green-900 border-green-500 shadow-lg shadow-green-500/30'}
                      ${phase.isClickable && 'group-hover:scale-110 group-hover:shadow-2xl'}
                    `}
                    >
                      {/* Icon/Status */}
                      <div
                        className={`
                        text-4xl transition-transform
                        ${phase.status === 'current' && 'animate-bounce'}
                      `}
                      >
                        {phase.status === 'completed' ? (
                          <FaCheckCircle className="text-green-400" />
                        ) : phase.status === 'locked' ? (
                          '🔒'
                        ) : (
                          phase.icon
                        )}
                      </div>

                      {/* Glow effect for current phase */}
                      {phase.status === 'current' && (
                        <div className="absolute inset-0 rounded-lg bg-primary-sky opacity-20 animate-pulse" />
                      )}
                    </div>

                    {/* Phase Title */}
                    <div className="mt-3 text-center">
                      <p
                        className={`
                        text-sm font-bold font-pixel whitespace-nowrap
                        ${phase.status === 'locked' && 'text-gray-600'}
                        ${phase.status === 'available' && 'text-primary-aero'}
                        ${phase.status === 'current' && 'text-primary-sky'}
                        ${phase.status === 'completed' && 'text-green-400'}
                      `}
                      >
                        {phase.title}
                      </p>

                      {/* Status Badge */}
                      <div className="mt-1">
                        {phase.status === 'locked' && (
                          <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-500 font-pixel">
                            قفل
                          </span>
                        )}
                        {phase.status === 'current' && (
                          <span className="text-xs px-2 py-0.5 rounded bg-primary-cerulean text-white font-pixel animate-pulse">
                            فعال
                          </span>
                        )}
                        {phase.status === 'available' && phase.isClickable && (
                          <span className="text-xs px-2 py-0.5 rounded bg-primary-aero bg-opacity-30 text-primary-aero font-pixel">
                            قابل دسترس
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                </div>

                {/* Connector */}
                {index < phases.length - 1 && (
                  <div className="px-4 flex items-center">
                    <div className="w-16 relative h-2">
                      {/* Background track */}
                      <div className="absolute inset-0 bg-gray-700 rounded-full" />

                      {/* Progress fill */}
                      <div
                        className={`
                          absolute inset-0 rounded-full transition-all duration-500
                          ${
                            phase.status === 'completed' ||
                            phases[index + 1].status === 'current' ||
                            phases[index + 1].status === 'completed'
                              ? 'bg-gradient-to-r from-green-500 to-green-400 shadow-lg shadow-green-500/50'
                              : 'bg-gray-700'
                          }
                        `}
                      />

                      {/* Animated dots for active connection */}
                      {phase.status === 'current' && phases[index + 1].status !== 'locked' && (
                        <div className="absolute inset-0 flex items-center justify-around">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="w-1 h-1 bg-white rounded-full animate-pulse"
                              style={{
                                animationDelay: `${i * 0.2}s`,
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile View - Horizontal Scroll */}
          <div className="md:hidden overflow-x-auto pb-4 scroll-smooth" ref={mobileScrollRef}>
            <div className="flex items-center gap-3 min-w-max px-2">
              {phases.map((phase, index) => (
                <div key={phase.id} className="flex items-center">
                  <button
                    ref={phase.status === 'current' ? currentPhaseButtonRef : null}
                    onClick={() => phase.isClickable && onPhaseClick(phase.id)}
                    disabled={!phase.isClickable}
                    className={`
                      flex flex-col items-center gap-2 min-w-[80px]
                      ${phase.isClickable ? 'cursor-pointer' : 'cursor-default'}
                    `}
                  >
                    {/* Compact Node */}
                    <div
                      className={`
                      w-16 h-16 rounded-lg flex items-center justify-center
                      border-3 transition-all
                      ${phase.status === 'locked' && 'bg-gray-800 border-gray-700 opacity-50'}
                      ${phase.status === 'available' && 'bg-primary-midnight border-primary-aero'}
                      ${phase.status === 'current' && 'bg-primary-cerulean border-primary-sky shadow-lg'}
                      ${phase.status === 'completed' && 'bg-green-900 border-green-500'}
                    `}
                    >
                      <div className="text-2xl">
                        {phase.status === 'completed' ? (
                          <FaCheckCircle className="text-green-400" />
                        ) : phase.status === 'locked' ? (
                          '🔒'
                        ) : (
                          phase.icon
                        )}
                      </div>
                    </div>

                    {/* Compact Title */}
                    <p
                      className={`
                      text-xs font-bold font-pixel text-center max-w-[80px]
                      ${phase.status === 'locked' && 'text-gray-600'}
                      ${phase.status === 'available' && 'text-primary-aero'}
                      ${phase.status === 'current' && 'text-primary-sky'}
                      ${phase.status === 'completed' && 'text-green-400'}
                    `}
                    >
                      {phase.title}
                    </p>
                  </button>

                  {/* Mobile Connector */}
                  {index < phases.length - 1 && (
                    <div className="flex items-center px-1">
                      <div
                        className={`
                        w-8 h-1 rounded-full
                        ${
                          phase.status === 'completed' || phases[index + 1].status === 'current'
                            ? 'bg-green-500'
                            : 'bg-gray-700'
                        }
                      `}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Helper Text */}
        <div className="mt-4 text-center">
          <p className="text-xs text-primary-aero font-pixel">
            {phases.find((p) => p.id === currentPhase)?.status === 'current' && (
              <span className="inline-flex items-center gap-1">
                <span className="animate-ping inline-block w-2 h-2 rounded-full bg-primary-sky"></span>
                <span>در حال انجام: {phases.find((p) => p.id === currentPhase)?.title}</span>
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Legend - Only on Desktop */}
      <div className="hidden md:flex items-center justify-center gap-6 mt-3 text-xs">
        <div className="flex items-center gap-2 text-gray-500">
          <div className="w-3 h-3 rounded bg-gray-800 border border-gray-700"></div>
          <span className="font-pixel">قفل</span>
        </div>
        <div className="flex items-center gap-2 text-primary-aero">
          <div className="w-3 h-3 rounded bg-primary-midnight border border-primary-aero"></div>
          <span className="font-pixel">قابل دسترس</span>
        </div>
        <div className="flex items-center gap-2 text-primary-sky">
          <div className="w-3 h-3 rounded bg-primary-cerulean border border-primary-sky"></div>
          <span className="font-pixel">در حال انجام</span>
        </div>
        <div className="flex items-center gap-2 text-green-400">
          <div className="w-3 h-3 rounded bg-green-900 border border-green-500"></div>
          <span className="font-pixel">تکمیل شده</span>
        </div>
      </div>
    </div>
  );
}
