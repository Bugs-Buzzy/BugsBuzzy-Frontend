// src/pages/MiniGamePage.tsx
import React, { useState, useEffect } from 'react';

import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { apiClient as api } from '@/services/api';

// استایل برای اینکه آیفریم کل صفحه رو بگیره
const pageStyles: React.CSSProperties = {
  width: '100%',
  height: '100vh', // 100% ارتفاع صفحه
  overflow: 'hidden', // حذف اسکرول‌بار احتمالی
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
};

const iframeStyles: React.CSSProperties = {
  width: '100%',
  height: '100%',
  border: 'none',
};

const overlayStyles: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.8)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  color: 'white',
  fontFamily: 'Arial, sans-serif',
};

const buttonStyles: React.CSSProperties = {
  padding: '15px 30px',
  fontSize: '20px',
  background: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: 'bold',
  marginTop: '20px',
};

const MiniGamePage = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [gameResult, setGameResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user: _user } = useAuth();
  const { success, error } = useToast();

  useEffect(() => {
    checkMinigameStatus();
  }, []);

  const checkMinigameStatus = async () => {
    try {
      const response = await api.get<{ has_played: boolean; result?: any }>('/payments/minigame/');
      setHasPlayed(response.has_played);
      if (response.has_played && response.result) {
        setGameResult(response.result);
      }
    } catch (err) {
      console.error('Error checking minigame status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleGameEnd = async (carrotCount: number, coinCount: number) => {
    try {
      const response = await api.post<{
        result: any;
        discount_percentage: number;
        coupon_code: string;
      }>('/payments/minigame/', {
        carrot_count: carrotCount,
        coin_count: coinCount,
      });

      setGameResult(response.result);
      setHasPlayed(true);
      success(
        `تبریک! کوپن تخفیف ${response.discount_percentage}% شما تولید شد: ${response.coupon_code}`,
      );
    } catch (err: any) {
      console.error('Error submitting game results:', err);
      error(err.response?.data?.error || 'خطا در ارسال نتایج بازی');
    }
  };

  if (loading) {
    return (
      <div style={pageStyles}>
        <div style={overlayStyles}>
          <h2>در حال بارگذاری...</h2>
        </div>
      </div>
    );
  }

  if (hasPlayed && gameResult) {
    return (
      <div style={pageStyles}>
        <div style={overlayStyles}>
          <h1 style={{ fontSize: '48px', marginBottom: '20px', color: '#ff4444' }}>
            شما قبلاً بازی کرده‌اید!
          </h1>
          <div style={{ fontSize: '24px', textAlign: 'center', marginBottom: '30px' }}>
            <p>هویج: {gameResult.carrot_count}</p>
            <p>سکه: {gameResult.coin_count}</p>
            <p>تخفیف: {gameResult.discount_percentage}%</p>
          </div>
          <p style={{ fontSize: '18px', color: '#ccc' }}>هر کاربر فقط یک بار می‌تواند بازی کند</p>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyles}>
      {!gameStarted && (
        <div style={overlayStyles}>
          <h1 style={{ fontSize: '48px', marginBottom: '20px', color: '#4CAF50' }}>
            مینی‌گیم باگزبازی
          </h1>
          <p style={{ fontSize: '24px', textAlign: 'center', marginBottom: '30px' }}>
            هویج و سکه جمع کنید تا کوپن تخفیف دریافت کنید!
          </p>
          <div style={{ fontSize: '18px', textAlign: 'center', marginBottom: '20px' }}>
            <p>• هر هویج: 0.2% تخفیف</p>
            <p>• هر سکه: 2% تخفیف</p>
            <p>• فرمول: (هویج ÷ 5) + (سکه × 2) = درصد تخفیف</p>
          </div>
          <button style={buttonStyles} onClick={handleStartGame}>
            شروع بازی
          </button>
        </div>
      )}

      {gameStarted && (
        <iframe
          src="/mini-game/index.html"
          title="BugsBuzzy Mini-Game"
          style={iframeStyles}
          onLoad={() => {
            // Listen for game end events from the iframe
            window.addEventListener('message', (event) => {
              if (event.data.type === 'GAME_END') {
                handleGameEnd(event.data.carrotCount, event.data.coinCount);
              }
            });
          }}
        />
      )}
    </div>
  );
};

export default MiniGamePage;
