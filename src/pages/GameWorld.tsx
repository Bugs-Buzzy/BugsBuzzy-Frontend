import { useRef, useEffect, useState } from 'react';

import HUD from '@/components/HUD';
import GameJamFloor from '@/pages/floors/GameJamFloor';
import LandingFloor from '@/pages/floors/LandingFloor';
import QnAFloor from '@/pages/floors/QnAFloor';
import SponsorsFloor from '@/pages/floors/SponsorsFloor';
import TeamFloor from '@/pages/floors/TeamFloor';
import WorkshopsFloor from '@/pages/floors/WorkshopsFloor';
import '@/styles/gameworld.css';

const floorNames = ['', 'inperson', 'gamejam', 'workshops', 'sponsors', 'team'];

const WHEEL_DELAY = 600;
const SNAP_WHEEL_DELAY = 600;

export default function GameWorld() {
  const floorRefs = useRef<(HTMLElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFloor, setCurrentFloor] = useState(0);
  const forcedChange = useRef(false);
  const isSnapping = useRef(false);
  const lastFloor = useRef(0);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout>>();

  const changeFloor = (index: number, scroll: boolean) => {
    setCurrentFloor(index);
    lastFloor.current = index;
    window.history.replaceState(null, '', `#${floorNames[index]}`);
    forcedChange.current = true;
    if (scroll) {
      floorRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastWheelTime = 0;

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.team-scrollbar')) {
        return;
      }

      e.preventDefault();

      if (isSnapping.current) return;

      const now = Date.now();
      if (now - lastWheelTime < WHEEL_DELAY) return;

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
          changeFloor(targetFloor, true);
          setTimeout(() => {
            isSnapping.current = false;
          }, SNAP_WHEEL_DELAY);
        } else {
          isSnapping.current = false;
        }
      }
    };

    const handleScroll = () => {
      const scrollPosition = container.scrollTop;
      const viewportHeight = container.clientHeight;
      const currentPosition = scrollPosition / viewportHeight;
      let targetFloor = Math.round(currentPosition);

      const diff = targetFloor - lastFloor.current;
      if (Math.abs(diff) > 1) {
        targetFloor = lastFloor.current + (diff > 0 ? 1 : -1);
      }

      targetFloor = Math.max(0, Math.min(5, targetFloor));
      changeFloor(targetFloor, false);
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
          changeFloor(floorIndex, !forcedChange.current);
        }
        forcedChange.current = false;
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <>
      <HUD onFloorNavigate={changeFloor} currentFloor={currentFloor} />
      <div ref={containerRef} className="game-world-container">
        <LandingFloor ref={(el) => (floorRefs.current[0] = el)} />
        <GameJamFloor ref={(el) => (floorRefs.current[1] = el)} />
        <QnAFloor ref={(el) => (floorRefs.current[2] = el)} />
        <WorkshopsFloor ref={(el) => (floorRefs.current[3] = el)} />
        <SponsorsFloor ref={(el) => (floorRefs.current[4] = el)} />
        <TeamFloor ref={(el) => (floorRefs.current[5] = el)} />
      </div>
    </>
  );
}
