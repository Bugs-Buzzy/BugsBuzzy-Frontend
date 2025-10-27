import { useRef, useEffect, useState } from 'react';

import HUD from '@/components/HUD';
import GameJamFloor from '@/pages/floors/GameJamFloor';
import InPersonFloor from '@/pages/floors/InPersonFloor';
import LandingFloor from '@/pages/floors/LandingFloor';
import SponsorsFloor from '@/pages/floors/SponsorsFloor';
import TeamFloor from '@/pages/floors/TeamFloor';
import WorkshopsFloor from '@/pages/floors/WorkshopsFloor';
import '@/styles/gameworld.css';

const floorNames = ['', 'inperson', 'gamejam', 'workshops', 'sponsors', 'team'];

const WHEEL_DELAY = 300;
const SNAP_WHEEL_DELAY = 300;
const SNAP_TOUCH_DELAY = 400;
const SCROLL_DEBOUNCE_DELAY = 100;
const HASH_CHANGE_DELAY = 50;
const SCROLL_THRESHOLD = 0.1;

export default function GameWorld() {
  const floorRefs = useRef<(HTMLElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFloor, setCurrentFloor] = useState(0);
  const isSnapping = useRef(false);
  const lastFloor = useRef(0);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout>>();
  const snapReleaseTimeout = useRef<ReturnType<typeof setTimeout>>();
  const snapLockDuration = useRef(SNAP_WHEEL_DELAY);

  const scheduleSnapRelease = (duration?: number) => {
    if (duration !== undefined) {
      snapLockDuration.current = duration;
    }

    clearTimeout(snapReleaseTimeout.current);
    snapReleaseTimeout.current = setTimeout(() => {
      isSnapping.current = false;
    }, duration ?? snapLockDuration.current);
  };

  const scrollToFloor = (index: number, snapDuration = SNAP_WHEEL_DELAY) => {
    isSnapping.current = true;
    scheduleSnapRelease(snapDuration);
    setCurrentFloor(index);
    lastFloor.current = index;
    window.history.replaceState(null, '', `#${floorNames[index]}`);
    floorRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
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

        let targetFloor = lastFloor.current;
        if (e.deltaY > 0 && lastFloor.current < 5) {
          targetFloor = lastFloor.current + 1;
        } else if (e.deltaY < 0 && lastFloor.current > 0) {
          targetFloor = lastFloor.current - 1;
        }

        if (targetFloor !== lastFloor.current) {
          scrollToFloor(targetFloor, SNAP_WHEEL_DELAY);
        }
      }
    };

    const handleScroll = () => {
      if (isSnapping.current) {
        scheduleSnapRelease();
        return;
      }

      clearTimeout(scrollTimeout.current);

      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      const currentPosition = scrollPosition / viewportHeight;
      let targetFloor = Math.round(currentPosition);

      const diff = targetFloor - lastFloor.current;
      if (Math.abs(diff) > 1) {
        targetFloor = lastFloor.current + (diff > 0 ? 1 : -1);
      }

      targetFloor = Math.max(0, Math.min(5, targetFloor));

      scrollTimeout.current = setTimeout(() => {
        const scrollDiff = Math.abs(currentPosition - targetFloor);

        if (scrollDiff > SCROLL_THRESHOLD) {
          scrollToFloor(targetFloor, SNAP_TOUCH_DELAY);
        } else {
          if (targetFloor !== lastFloor.current) {
            lastFloor.current = targetFloor;
            setCurrentFloor(targetFloor);
            window.history.replaceState(null, '', `#${floorNames[targetFloor]}`);
          }
        }
      }, SCROLL_DEBOUNCE_DELAY);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout.current);
      clearTimeout(snapReleaseTimeout.current);
    };
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const floorIndex = floorNames.indexOf(hash);
        if (floorIndex !== -1 && floorIndex !== currentFloor) {
          setTimeout(() => {
            scrollToFloor(floorIndex, SNAP_WHEEL_DELAY);
          }, HASH_CHANGE_DELAY);
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
