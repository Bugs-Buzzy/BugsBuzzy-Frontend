import { useState, useEffect, useCallback, useRef } from 'react';
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

const REGISTRATION_CLOSED = true;

const MiniGamePage = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsLandscape, setNeedsLandscape] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { success, error } = useToast();
  const navigate = useNavigate();

  const checkMinigameStatus = async () => {
    try {
      const response = await apiClient.get<MinigameStatusResponse>('/minigame/status/');
      setHasPlayed(response.has_played);
      if (response.has_played && response.result) setGameResult(response.result);
    } catch (err) {
      console.error('Error checking minigame status:', err);
      error('خطا در بررسی وضعیت بازی');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkMinigameStatus();
  }, []);

  useEffect(() => {
    const mobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
    setIsMobile(mobile);

    if (mobile) {
      const isLandscape = window.innerWidth > window.innerHeight;
      setNeedsLandscape(!isLandscape);

      const handleResize = () => {
        setNeedsLandscape(!(window.innerWidth > window.innerHeight));
      };
      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleResize);
      };
    }
  }, []);

  useEffect(() => {
    if (gameStarted && iframeRef.current) {
      setTimeout(() => {
        iframeRef.current?.contentWindow?.focus();
        iframeRef.current?.focus();
      }, 150);

      if (isMobile && document.documentElement.requestFullscreen) {
        document.documentElement
          .requestFullscreen()
          .catch((err) => console.log('Fullscreen request failed:', err));
      }
    }
  }, [gameStarted, isMobile]);

  const handleGameEnd = useCallback(
    async (carrotCount: number, coinCount: number) => {
      try {
        const response = await apiClient.post<MinigameSubmitResponse>('/minigame/submit/', {
          carrot_count: carrotCount,
          coin_count: coinCount,
        });

        setGameResult(response.result);
        setHasPlayed(true);

        const discountText =
          response.discount_percentage >= 0
            ? `تبریک! کوپن تخفیف ${response.discount_percentage}% شما: ${response.coupon_code}`
            : `متأسفانه به دلیل امتیاز پایین، کد افزایش قیمت ${Math.abs(
                response.discount_percentage,
              )}% دریافت کردید`;

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

  const handleStartGame = () => {
    if (isMobile && needsLandscape) return;
    setGameStarted(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-2xl">در حال بارگذاری...</div>
      </div>
    );
  }

  if (hasPlayed && gameResult) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
        <div className="text-center p-6 sm:p-8 bg-gray-800 rounded-2xl shadow-lg max-w-md w-full">
          <h1 className="text-3xl sm:text-4xl font-bold text-red-500 mb-6">
            شما قبلاً بازی کرده‌اید!
          </h1>
          <div className="text-lg sm:text-xl text-white space-y-3 mb-6">
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
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            بازگشت به صفحه اصلی
          </button>
        </div>
      </div>
    );
  }

  if (REGISTRATION_CLOSED) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
        <div className="text-center p-6 sm:p-8 bg-gray-800 rounded-2xl shadow-lg max-w-md w-full">
          <h1 className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-6">
            مهلت ثبت‌نام به پایان رسیده است
          </h1>
          <p className="text-lg sm:text-xl text-gray-100 mb-6 leading-relaxed">
            از علاقه‌مندی شما برای شرکت در مینی‌گیم باگزبازی ممنونیم. ثبت‌نام در حال حاضر بسته شده
            است و به‌زودی اطلاعات دوره‌های بعدی را اطلاع‌رسانی خواهیم کرد.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            بازگشت به صفحه اصلی
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Overlay menu / instructions */}
      {!gameStarted && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="text-center p-6 sm:p-10 bg-gray-800 rounded-2xl shadow-lg max-w-lg mx-4 w-full">
            <h1 className="text-3xl sm:text-5xl font-bold text-green-500 mb-6">
              مینی‌گیم باگزبازی
            </h1>
            <p className="text-xl sm:text-2xl text-white mb-6">
              هویج و سکه جمع کنید تا کوپن تخفیف دریافت کنید!
            </p>
            <div className="text-base sm:text-lg text-gray-300 space-y-2 mb-6">
              <p>🥕 هر چه هویج بیشتر، تخفیف بالاتر!</p>
              <p>🪙 سکه‌ها ارزش بیشتری دارند</p>
              <p className="text-yellow-300 font-bold mt-4">
                امتیاز شما تخفیف تا 40% به شما می‌دهد
              </p>
              <p className="text-sm text-gray-400 mt-2">
                فقط یک شانس دارید، پس بهترین تلاشتان را بکنید!
              </p>
            </div>

            {isMobile && needsLandscape && (
              <div className="mb-6 p-4 bg-yellow-600/80 rounded-lg text-white">
                <p className="text-2xl mb-2">📱</p>
                <p className="text-lg font-bold">لطفاً دستگاه را افقی کنید</p>
                <p className="text-sm mt-2">برای تجربه بهتر، صفحه را افقی نگه دارید</p>
              </div>
            )}

            <button
              onClick={handleStartGame}
              disabled={isMobile && needsLandscape}
              className={`w-full px-8 py-4 text-xl sm:text-2xl rounded-lg font-bold transition ${
                isMobile && needsLandscape
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              شروع بازی
            </button>
          </div>
        </div>
      )}

      {/* Responsive Game Frame */}
      {gameStarted && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{
              aspectRatio: '16 / 9',
              maxWidth: '100vw',
              maxHeight: '100vh',
            }}
          >
            <iframe
              ref={iframeRef}
              src="/mini-game/index.html"
              title="BugsBuzzy Mini-Game"
              className="w-full h-full border-none rounded-lg"
              allow="fullscreen"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniGamePage;
