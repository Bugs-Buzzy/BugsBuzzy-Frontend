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
    }, 250);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastScrollTime = 0;
    const scrollDelay = 600;

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.team-scrollbar')) {
        return;
      }

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

    let lastTouchY: number | null = null;
    let touchMoveDistance = 0;
    const touchThreshold = 80;

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.team-scrollbar')) {
        return;
      }

      if (isScrolling.current) {
        e.preventDefault();
        return;
      }

      const currentTouchY = e.touches[0].clientY;

      // Initialize lastTouchY on first move
      if (lastTouchY === null) {
        lastTouchY = currentTouchY;
        return;
      }

      const deltaY = lastTouchY - currentTouchY;
      touchMoveDistance += deltaY;
      lastTouchY = currentTouchY;

      // Check if we've moved enough to trigger floor change
      if (Math.abs(touchMoveDistance) > touchThreshold) {
        e.preventDefault();

        if (touchMoveDistance > 0 && currentFloor < 5) {
          scrollToFloor(currentFloor + 1);
          touchMoveDistance = 0;
          lastTouchY = null; // Reset for next gesture
        } else if (touchMoveDistance < 0 && currentFloor > 0) {
          scrollToFloor(currentFloor - 1);
          touchMoveDistance = 0;
          lastTouchY = null; // Reset for next gesture
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchmove', handleTouchMove);
    };
  }, [currentFloor]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const index = floorRefs.current.indexOf(entry.target as HTMLElement);
            if (index !== -1 && index !== currentFloor) {
              setCurrentFloor(index);
            }
          }
        });
      },
      { threshold: [0.5, 0.75, 1.0] },
    );

    floorRefs.current.forEach((floor) => {
      if (floor) observer.observe(floor);
    });

    return () => observer.disconnect();
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
