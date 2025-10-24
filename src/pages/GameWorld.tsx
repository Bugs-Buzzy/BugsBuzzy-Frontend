import { useRef, useEffect, useState } from 'react';

import GameJamFloor from '@/components/floors/GameJamFloor';
import InPersonFloor from '@/components/floors/InPersonFloor';
import LandingFloor from '@/components/floors/LandingFloor';
import SponsorsFloor from '@/components/floors/SponsorsFloor';
import TeamFloor from '@/components/floors/TeamFloor';
import WorkshopsFloor from '@/components/floors/WorkshopsFloor';
import HUD from '@/components/HUD';
import '@/styles/gameworld.css';

const floorNames = ['', 'inperson', 'gamejam', 'workshops', 'sponsors', 'team'];

export default function GameWorld() {
  const floorRefs = useRef<(HTMLElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFloor, setCurrentFloor] = useState(0);
  const isSnapping = useRef(false);
  const lastFloor = useRef(0);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout>>();

  const scrollToFloor = (index: number) => {
    setCurrentFloor(index);
    lastFloor.current = index;
    window.history.replaceState(null, '', `#${floorNames[index]}`);
    floorRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastWheelTime = 0;
    const wheelDelay = 600;

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.team-scrollbar')) {
        return;
      }

      e.preventDefault();

      if (isSnapping.current) return;

      const now = Date.now();
      if (now - lastWheelTime < wheelDelay) return;

      if (Math.abs(e.deltaY) > 10) {
        lastWheelTime = now;
        isSnapping.current = true;

        let targetFloor = lastFloor.current;
        if (e.deltaY > 0 && lastFloor.current < 5) {
          targetFloor = lastFloor.current + 1;
        } else if (e.deltaY < 0 && lastFloor.current > 0) {
          targetFloor = lastFloor.current - 1;
        }

        if (targetFloor !== lastFloor.current) {
          scrollToFloor(targetFloor);
          setTimeout(() => {
            isSnapping.current = false;
          }, 500);
        } else {
          isSnapping.current = false;
        }
      }
    };

    const handleScroll = () => {
      if (isSnapping.current) return;

      clearTimeout(scrollTimeout.current);

      const scrollPosition = container.scrollTop;
      const viewportHeight = container.clientHeight;
      const currentPosition = scrollPosition / viewportHeight;
      let targetFloor = Math.round(currentPosition);

      // محدود کردن به یک طبقه در هر اسکرول
      const diff = targetFloor - lastFloor.current;
      if (Math.abs(diff) > 1) {
        targetFloor = lastFloor.current + (diff > 0 ? 1 : -1);
      }

      targetFloor = Math.max(0, Math.min(5, targetFloor));

      scrollTimeout.current = setTimeout(() => {
        const scrollDiff = Math.abs(currentPosition - targetFloor);

        if (scrollDiff > 0.05) {
          isSnapping.current = true;
          scrollToFloor(targetFloor);
          setTimeout(() => {
            isSnapping.current = false;
          }, 200);
        } else {
          if (targetFloor !== lastFloor.current) {
            lastFloor.current = targetFloor;
            setCurrentFloor(targetFloor);
            window.history.replaceState(null, '', `#${floorNames[targetFloor]}`);
          }
        }
      }, 150);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout.current);
    };
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const floorIndex = floorNames.indexOf(hash);
        if (floorIndex !== -1 && floorIndex !== currentFloor) {
          setCurrentFloor(floorIndex);
          setTimeout(() => {
            floorRefs.current[floorIndex]?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
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
