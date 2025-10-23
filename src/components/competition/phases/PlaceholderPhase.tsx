import PixelFrame from '@/components/PixelFrame';

interface PlaceholderPhaseProps {
  phaseNumber: number;
  phaseName: string;
  startDate?: string;
  description?: string;
  icon?: string;
}

export default function PlaceholderPhase({
  phaseNumber: _phaseNumber,
  phaseName,
  startDate,
  description,
  icon = '🎯',
}: PlaceholderPhaseProps) {
  return (
    <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
      <div className="text-center py-12">
        <div className="text-6xl mb-6 opacity-50">{icon}</div>

        <h2 className="text-3xl font-bold text-primary-sky mb-4 font-pixel">{phaseName}</h2>

        {description ? (
          <p className="text-primary-aero mb-6 text-lg max-w-2xl mx-auto">{description}</p>
        ) : (
          <p className="text-primary-aero mb-6 text-lg">این فاز به‌زودی باز خواهد شد</p>
        )}

        {startDate && (
          <div className="bg-primary-midnight rounded-lg p-4 border border-primary-cerulean inline-block">
            <p className="text-primary-aero text-sm mb-1">زمان شروع:</p>
            <p className="text-primary-sky font-bold text-lg font-pixel">{startDate}</p>
          </div>
        )}

        {!startDate && (
          <div className="bg-yellow-900 bg-opacity-30 rounded-lg p-4 border border-yellow-600 max-w-md mx-auto">
            <p className="text-yellow-300 text-sm">🕐 اطلاعات بیشتر به‌زودی اعلام خواهد شد</p>
          </div>
        )}
      </div>
    </PixelFrame>
  );
}
