import PixelFrame from '@/components/PixelFrame';

export default function GameJamCompetition() {
  return (
    <div className="max-w-5xl mx-auto">
      <PixelFrame className="bg-primary-midnight bg-opacity-90">
        <h3 className="text-primary-sky font-bold text-2xl mb-4">🔒 ثبت‌نام بسته است</h3>
        <p className="text-gray-300 text-lg">
          ثبت‌نام برای رقابت گیم‌جم مجازی در حال حاضر بسته است.
        </p>
      </PixelFrame>
    </div>
  );
}
