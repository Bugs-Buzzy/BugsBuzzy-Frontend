import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useToast } from '@/context/ToastContext';
import { apiClient } from '@/services/api';

interface GameResult {
  carrot_count: number;
  coin_count: number;
  discount_percentage: number;
  coupon_code?: {
    code: string;
  };
  created_at: string;
}

interface MinigameStatusResponse {
  has_played: boolean;
  result?: GameResult;
  message?: string;
}

interface MinigameSubmitResponse {
  success: boolean;
  message: string;
  result: GameResult;
  coupon_code: string;
  discount_percentage: number;
}

const MiniGamePage = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkMinigameStatus();
  }, []);

  const checkMinigameStatus = async () => {
    try {
      const response = await apiClient.get<MinigameStatusResponse>('minigame/status/');
      setHasPlayed(response.has_played);
      if (response.has_played && response.result) {
        setGameResult(response.result);
      }
    } catch (err) {
      console.error('Error checking minigame status:', err);
      error('خطا در بررسی وضعیت بازی');
    } finally {
      setLoading(false);
    }
  };

  const handleGameEnd = useCallback(
    async (carrotCount: number, coinCount: number) => {
      try {
        const response = await apiClient.post<MinigameSubmitResponse>('minigame/submit/', {
          carrot_count: carrotCount,
          coin_count: coinCount,
        });

        setGameResult(response.result);
        setHasPlayed(true);

        const discountText =
          response.discount_percentage >= 0
            ? `تبریک! کوپن تخفیف ${response.discount_percentage}% شما: ${response.coupon_code}`
            : `متأسفانه به دلیل امتیاز پایین، کد افزایش قیمت ${Math.abs(response.discount_percentage)}% دریافت کردید`;

        success(discountText);
      } catch (err: any) {
        console.error('Error submitting game results:', err);
        error(err.response?.data?.error || 'خطا در ارسال نتایج بازی');
      }
    },
    [success, error],
  );

  useEffect(() => {
    if (!gameStarted) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'GAME_END') {
        handleGameEnd(event.data.carrotCount, event.data.coinCount);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [gameStarted, handleGameEnd]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-2xl">در حال بارگذاری...</div>
      </div>
    );
  }

  if (hasPlayed && gameResult) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center p-8 bg-gray-800 rounded-lg max-w-md">
          <h1 className="text-4xl font-bold text-red-500 mb-6">شما قبلاً بازی کرده‌اید!</h1>
          <div className="text-xl text-white space-y-3 mb-6">
            <p>🥕 هویج: {gameResult.carrot_count}</p>
            <p>🪙 سکه: {gameResult.coin_count}</p>
            <p className="text-2xl font-bold text-green-400">
              {gameResult.discount_percentage >= 0 ? '🎉' : '😢'} تخفیف:{' '}
              {gameResult.discount_percentage}%
            </p>
            {gameResult.coupon_code && (
              <p className="text-lg text-yellow-300 font-mono bg-gray-700 p-3 rounded">
                کد: {gameResult.coupon_code.code}
              </p>
            )}
          </div>
          <p className="text-gray-400 mb-4">هر کاربر فقط یک بار می‌تواند بازی کند</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            بازگشت به صفحه اصلی
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {!gameStarted && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="text-center p-8 bg-gray-800 rounded-lg max-w-lg">
            <h1 className="text-5xl font-bold text-green-500 mb-6">مینی‌گیم باگزبازی</h1>
            <p className="text-2xl text-white mb-6">
              هویج و سکه جمع کنید تا کوپن تخفیف دریافت کنید!
            </p>
            <div className="text-lg text-gray-300 space-y-2 mb-6">
              <p>• هر هویج: 0.2% تخفیف</p>
              <p>• هر سکه: 2% تخفیف</p>
              <p className="text-yellow-300 font-bold">
                • فرمول: (هویج ÷ 5) + (سکه × 2) = درصد تخفیف
              </p>
            </div>
            <button
              onClick={() => setGameStarted(true)}
              className="px-8 py-4 text-2xl bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition"
            >
              شروع بازی
            </button>
          </div>
        </div>
      )}

      {gameStarted && (
        <iframe
          src="/mini-game/index.html"
          title="BugsBuzzy Mini-Game"
          className="w-full h-full border-none"
        />
      )}
    </div>
  );
};

export default MiniGamePage;
