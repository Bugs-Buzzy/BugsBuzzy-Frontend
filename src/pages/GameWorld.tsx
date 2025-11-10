import { useRef, useEffect, useState, useCallback } from 'react';

import HUD from '@/components/HUD';
import TelegramSupportWidget from '@/components/TelegramSupportWidget';
import { TELEGRAM_CHANNEL_URL, TELEGRAM_SUPPORT_URL } from '@/constants/links';
import { useAuth } from '@/context/AuthContext';
import GameJamFloor from '@/pages/floors/GameJamFloor';
import LandingFloor from '@/pages/floors/LandingFloor';
import QnAFloor from '@/pages/floors/QnAFloor';
import SponsorsFloor from '@/pages/floors/SponsorsFloor';
import TeamFloor from '@/pages/floors/TeamFloor';
import WorkshopsFloor from '@/pages/floors/WorkshopsFloor';
import PromoModal from '@/pages/modals/PromoModal';
import { gamejamService } from '@/services/gamejam.service';
import '@/styles/gameworld.css';

const floorNames = ['', 'inperson', 'gamejam', 'workshops', 'sponsors', 'team'];

const WHEEL_DELAY = 600;
const SNAP_WHEEL_DELAY = 600;
const PROMO_GUEST_SUPPRESS_KEY = 'bugsbuzzy.promo.guestCooldown';
const PROMO_DEADLINE_ISO = '2025-11-11T20:00:00+03:30'; // Tehran time (UTC+3:30)
const GUEST_PROMO_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour cooldown for guests
const PROMO_POPUP_DELAY_MS = 6000; // show after 6 seconds
const PROMO_DISCOUNT_CODE = 'BUGS-ENDING30';
const PROMO_DEADLINE_MS = new Date(PROMO_DEADLINE_ISO).getTime();

export default function GameWorld() {
  const floorRefs = useRef<(HTMLElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const promoTimerRef = useRef<number>();
  const [currentFloor, setCurrentFloor] = useState(0);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [promoDeadline, setPromoDeadline] = useState<Date | null>(null);
  const forcedChange = useRef(false);
  const isSnapping = useRef(false);
  const lastFloor = useRef(0);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout>>();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [teamStatus, setTeamStatus] = useState<'unknown' | 'none' | 'inactive' | 'other'>(
    'unknown',
  );
  const [teamFetched, setTeamFetched] = useState(false);

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

  useEffect(() => {
    if (authLoading) {
      return;
    }

    let cancelled = false;

    if (!isAuthenticated) {
      setTeamStatus('none');
      setTeamFetched(true);
      return () => {
        cancelled = true;
      };
    }

    setTeamFetched(false);
    setTeamStatus('unknown');

    (async () => {
      try {
        const response = await gamejamService.getMyTeam();
        if (cancelled) return;

        if (!response.team) {
          setTeamStatus('none');
        } else if (response.team.status === 'inactive') {
          setTeamStatus('inactive');
        } else {
          setTeamStatus('other');
        }
      } catch (error) {
        if (!cancelled) {
          console.warn('Unable to fetch team info for promo eligibility', error);
          setTeamStatus('other');
        }
      } finally {
        if (!cancelled) {
          setTeamFetched(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (promoTimerRef.current !== undefined) {
      window.clearTimeout(promoTimerRef.current);
      promoTimerRef.current = undefined;
    }

    setShowPromoModal(false);

    if (isAuthenticated && !teamFetched) {
      return;
    }

    let eligible = false;

    if (isAuthenticated) {
      eligible = teamStatus === 'none' || teamStatus === 'inactive';
    } else {
      try {
        const suppressUntil = localStorage.getItem(PROMO_GUEST_SUPPRESS_KEY);
        eligible = !suppressUntil || Number(suppressUntil) <= Date.now();
      } catch (error) {
        console.warn('Unable to read guest promo cooldown', error);
        eligible = true;
      }
    }

    if (!eligible || Date.now() >= PROMO_DEADLINE_MS) {
      setPromoDeadline(null);
      return;
    }

    setPromoDeadline(new Date(PROMO_DEADLINE_MS));

    promoTimerRef.current = window.setTimeout(() => {
      setShowPromoModal(true);
      if (!isAuthenticated) {
        try {
          localStorage.setItem(
            PROMO_GUEST_SUPPRESS_KEY,
            String(Date.now() + GUEST_PROMO_COOLDOWN_MS),
          );
        } catch (error) {
          console.warn('Unable to persist guest promo cooldown', error);
        }
      }
    }, PROMO_POPUP_DELAY_MS);

    return () => {
      if (promoTimerRef.current !== undefined) {
        window.clearTimeout(promoTimerRef.current);
        promoTimerRef.current = undefined;
      }
    };
  }, [authLoading, isAuthenticated, teamFetched, teamStatus]);

  const handlePromoClose = useCallback(() => {
    setShowPromoModal(false);
  }, []);

  return (
    <>
      <TelegramSupportWidget supportUrl={TELEGRAM_SUPPORT_URL} />
      <HUD onFloorNavigate={changeFloor} currentFloor={currentFloor} />
      {showPromoModal && promoDeadline && (
        <PromoModal
          onClose={handlePromoClose}
          deadline={promoDeadline}
          discountCode={PROMO_DISCOUNT_CODE}
          supportUrl={TELEGRAM_SUPPORT_URL}
          channelUrl={TELEGRAM_CHANNEL_URL}
        />
      )}
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
