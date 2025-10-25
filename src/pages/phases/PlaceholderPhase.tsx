import { Countdown } from '@/components/Countdown';
import PixelFrame from '@/components/PixelFrame';

interface PlaceholderPhaseProps {
  phaseNumber: number;
  phaseName: string;
  startDate?: string | null;
  endDate?: string | null;
  description?: string;
  icon?: string;
  isActive?: boolean;
}

export default function PlaceholderPhase({
  phaseNumber: _phaseNumber,
  phaseName,
  startDate,
  endDate,
  description,
  icon = '🎯',
  isActive = false,
}: PlaceholderPhaseProps) {
  const now = new Date();
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  const hasStarted = start ? now >= start : false;
  const hasEnded = end ? now >= end : false;

  return (
    <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
      <div className="text-center py-12">
        <div className="text-6xl mb-6 opacity-50">{icon}</div>

        <h2 className="text-3xl font-bold text-primary-sky mb-4 font-pixel">{phaseName}</h2>

        {/* Phase Status Badge */}
        {isActive && hasStarted && !hasEnded && (
          <div className="inline-block mb-4">
            <span className="pixel-btn pixel-btn-success px-4 py-2 text-sm animate-pulse">
              🔴 در حال برگزاری
            </span>
          </div>
        )}

        {hasEnded && (
          <div className="inline-block mb-4">
            <span className="pixel-btn bg-gray-700 text-gray-300 px-4 py-2 text-sm">
              ✓ پایان یافته
            </span>
          </div>
        )}

        {description ? (
          <p className="text-primary-aero mb-6 text-lg max-w-2xl mx-auto">{description}</p>
        ) : (
          <p className="text-primary-aero mb-6 text-lg">این فاز به‌زودی باز خواهد شد</p>
        )}

        {/* Countdown to Start */}
        {start && !hasStarted && (
          <div className="mb-6">
            <p className="text-primary-aero text-sm mb-4">شروع فاز تا:</p>
            <Countdown target={start} />
          </div>
        )}

        {/* Countdown to End (if active) */}
        {isActive && hasStarted && !hasEnded && end && (
          <div className="mb-6">
            <p className="text-yellow-400 text-sm mb-4">⏰ زمان باقی‌مانده:</p>
            <Countdown target={end} />
          </div>
        )}

        {/* Date Info */}
        {(start || end) && (
          <div className="bg-primary-midnight rounded-lg p-4 border border-primary-cerulean inline-block max-w-md">
            {start && (
              <div className="mb-2">
                <p className="text-primary-aero text-sm">شروع:</p>
                <p className="text-primary-sky font-bold font-pixel" dir="ltr">
                  {new Date(start).toLocaleString('fa-IR')}
                </p>
              </div>
            )}
            {end && (
              <div>
                <p className="text-primary-aero text-sm">پایان:</p>
                <p className="text-primary-sky font-bold font-pixel" dir="ltr">
                  {new Date(end).toLocaleString('fa-IR')}
                </p>
              </div>
            )}
          </div>
        )}

        {!start && !end && (
          <div className="bg-yellow-900 bg-opacity-30 rounded-lg p-4 border border-yellow-600 max-w-md mx-auto mt-6">
            <p className="text-yellow-300 text-sm">🕐 زمان‌بندی به‌زودی اعلام خواهد شد</p>
          </div>
        )}
      </div>
    </PixelFrame>
  );
}
