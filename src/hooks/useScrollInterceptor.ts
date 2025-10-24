import React, { useEffect, useRef, useState } from 'react';

interface ScrollInterceptorOptions {
  onLeft?: () => void;
  onRight?: () => void;
  lockParentScroll?: boolean;
}

export function useScrollInterceptor(
  ref: React.RefObject<HTMLElement>,
  options: ScrollInterceptorOptions = {},
) {
  const { onLeft, onRight, lockParentScroll = true } = options;
  const [isActive, setIsActive] = useState(false);
  const isActiveRef = useRef(isActive);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      { threshold: [0.4], root: document.querySelector('.game-world-container') },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    let lastScrollTime = 0;
    const SCROLL_COOLDOWN = 500; // میلی‌ثانیه - تنظیم کن به دلخواه

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      const { scrollTop, scrollHeight, clientHeight } = container;
      const atTop = scrollTop === 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

      // تشخیص اسکرول افقی
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        e.stopPropagation();

        // جلوگیری از رگباری شدن
        if (now - lastScrollTime < SCROLL_COOLDOWN) return;
        lastScrollTime = now;

        if (e.deltaX > 3 && onRight) onRight();
        else if (e.deltaX < -3 && onLeft) onLeft();
        return;
      }

      // محدود کردن اسکرول عمودی درون المنت
      if (lockParentScroll) {
        e.stopPropagation();
        if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
          e.preventDefault();
        }
      }
    };

    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      e.stopPropagation();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;
      e.stopPropagation();

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 100) {
        e.preventDefault();
        if (diffX > 0 && onRight) {
          onRight();
        } else if (diffX < 0 && onLeft) {
          onLeft();
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActiveRef.current) return;
      if (e.key === 'ArrowLeft' && onLeft) {
        e.preventDefault();
        onLeft();
      } else if (e.key === 'ArrowRight' && onRight) {
        e.preventDefault();
        onRight();
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [ref, onLeft, onRight, lockParentScroll]);
}
