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

export default function ProgressBar({
  phases,
  currentPhase: _currentPhase,
  onPhaseClick,
}: ProgressBarProps) {
  return (
    <div className="bg-primary-midnight rounded-lg p-4 border border-primary-cerulean mb-6 overflow-x-auto">
      <div className="flex items-center justify-between min-w-max gap-2">
        {phases.map((phase, index) => (
          <div key={phase.id} className="flex items-center">
            {/* Phase Circle */}
            <button
              onClick={() => phase.isClickable && onPhaseClick(phase.id)}
              disabled={!phase.isClickable}
              className={`
                relative flex flex-col items-center gap-2 px-4 py-2 rounded-lg transition-all
                ${phase.status === 'locked' && 'opacity-50 cursor-not-allowed'}
                ${phase.status === 'current' && 'bg-primary-cerulean bg-opacity-20 border-2 border-primary-cerulean'}
                ${phase.status === 'completed' && 'bg-green-900 bg-opacity-30 border border-green-500'}
                ${phase.status === 'available' && phase.isClickable && 'hover:bg-primary-oxfordblue cursor-pointer border border-primary-aero'}
                ${!phase.isClickable && 'cursor-default'}
              `}
            >
              {/* Icon */}
              <div
                className={`
                text-3xl
                ${phase.status === 'current' && 'animate-bounce'}
                ${phase.status === 'completed' && 'opacity-100'}
              `}
              >
                {phase.status === 'completed' ? '✅' : phase.icon}
              </div>

              {/* Title */}
              <div className="text-center">
                <p
                  className={`
                  text-sm font-bold whitespace-nowrap
                  ${phase.status === 'locked' && 'text-gray-500'}
                  ${phase.status === 'current' && 'text-primary-sky'}
                  ${phase.status === 'completed' && 'text-green-400'}
                  ${phase.status === 'available' && 'text-primary-aero'}
                `}
                >
                  {phase.title}
                </p>

                {/* Status Badge */}
                {phase.status === 'locked' && (
                  <span className="text-xs text-gray-600 mt-1 block">🔒 قفل</span>
                )}
                {phase.status === 'current' && (
                  <span className="text-xs text-primary-cerulean mt-1 block">▶ فعلی</span>
                )}
              </div>
            </button>

            {/* Connector Line */}
            {index < phases.length - 1 && (
              <div
                className={`
                h-0.5 w-8 mx-2
                ${
                  phases[index + 1].status === 'completed' || phases[index + 1].status === 'current'
                    ? 'bg-green-500'
                    : 'bg-gray-600'
                }
              `}
              />
            )}
          </div>
        ))}
      </div>

      {/* Mobile Hint */}
      <div className="md:hidden mt-3 text-center text-xs text-gray-500">
        ← برای دیدن مراحل بیشتر، به چپ و راست بکشید →
      </div>
    </div>
  );
}
