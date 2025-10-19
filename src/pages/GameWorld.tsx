import { useRef, useEffect, useState } from 'react';

import GameJamFloor from '@/components/floors/GameJamFloor';
import InPersonFloor from '@/components/floors/InPersonFloor';
import LandingFloor from '@/components/floors/LandingFloor';
import SponsorsFloor from '@/components/floors/SponsorsFloor';
import TeamFloor from '@/components/floors/TeamFloor';
import WorkshopsFloor from '@/components/floors/WorkshopsFloor';
import HUD from '@/components/HUD';
import '@/styles/gameworld.css';

export default function GameWorld() {
  const floorRefs = useRef<(HTMLElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFloor, setCurrentFloor] = useState(0);
  const isScrolling = useRef(false);

  const scrollToFloor = (index: number) => {
    if (isScrolling.current) return;
    isScrolling.current = true;
    setCurrentFloor(index);
    floorRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      isScrolling.current = false;
    }, 1000);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastScrollTime = 0;
    const scrollDelay = 600;

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling.current) {
        e.preventDefault();
        return;
      }

      const now = Date.now();
      if (now - lastScrollTime < scrollDelay) {
        e.preventDefault();
        return;
      }

      if (Math.abs(e.deltaY) > 10) {
        e.preventDefault();
        lastScrollTime = now;

        if (e.deltaY > 0 && currentFloor < 5) {
          scrollToFloor(currentFloor + 1);
        } else if (e.deltaY < 0 && currentFloor > 0) {
          scrollToFloor(currentFloor - 1);
        }
      }
    };

    let touchStartY = 0;
    let touchStartTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling.current) return;

      const touchEndY = e.changedTouches[0].clientY;
      const touchEndTime = Date.now();
      const diff = touchStartY - touchEndY;
      const timeDiff = touchEndTime - touchStartTime;

      if (Math.abs(diff) > 80 && timeDiff < 500) {
        if (diff > 0 && currentFloor < 5) {
          scrollToFloor(currentFloor + 1);
        } else if (diff < 0 && currentFloor > 0) {
          scrollToFloor(currentFloor - 1);
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentFloor]);

  return (
    <>
      <HUD onFloorNavigate={scrollToFloor} currentFloor={currentFloor} />
      <div ref={containerRef} className="game-world-container">
        <LandingFloor ref={(el) => (floorRefs.current[0] = el)} />
        <InPersonFloor ref={(el) => (floorRefs.current[1] = el)} />
        <GameJamFloor ref={(el) => (floorRefs.current[2] = el)} />
        <WorkshopsFloor ref={(el) => (floorRefs.current[3] = el)} />
        <SponsorsFloor ref={(el) => (floorRefs.current[4] = el)} />
        <TeamFloor ref={(el) => (floorRefs.current[5] = el)} />
      </div>
    </>
  );
}
