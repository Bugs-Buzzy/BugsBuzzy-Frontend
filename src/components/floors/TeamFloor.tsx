import { forwardRef, useState, useRef, useEffect, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import bgStaff from '@/assets/bkg-staff.png';
import TeamMemberCard from '@/components/team/TeamMemberCard';
import { teams, type TeamName } from '@/data/teams';

const TeamFloor = forwardRef<HTMLElement>((props, ref) => {
  const teamNames = Object.keys(teams) as TeamName[];
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [animDirection, setAnimDirection] = useState<'left' | 'right'>('left');
  const [hasScroll, setHasScroll] = useState(false);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const currentTeamName = teamNames[currentTeamIndex];
  const currentMembers = teams[currentTeamName];

  const nextTeam = useCallback(() => {
    setAnimDirection('right');
    setCurrentTeamIndex((prev) => (prev + 1) % teamNames.length);
  }, [teamNames.length]);

  const prevTeam = useCallback(() => {
    setAnimDirection('left');
    setCurrentTeamIndex((prev) => (prev === 0 ? teamNames.length - 1 : prev - 1));
  }, [teamNames.length]);

  useEffect(() => {
    const container = listContainerRef.current;
    if (!container) return;

    let lastHorizontalScroll = 0;

    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const atTop = scrollTop === 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        e.stopPropagation();
        const now = Date.now();
        if (now - lastHorizontalScroll > 500) {
          lastHorizontalScroll = now;
          if (e.deltaX > 0) {
            nextTeam();
          } else if (e.deltaX < 0) {
            prevTeam();
          }
        }
        return;
      }

      if (!atTop && e.deltaY < 0) {
        e.stopPropagation();
      } else if (!atBottom && e.deltaY > 0) {
        e.stopPropagation();
      } else if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 100) {
        e.preventDefault();
        if (diffX > 0) {
          nextTeam();
        } else {
          prevTeam();
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        nextTeam();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        prevTeam();
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
  }, [nextTeam, prevTeam]);

  useEffect(() => {
    const checkScroll = () => {
      const container = listContainerRef.current;
      if (!container) return;
      setHasScroll(container.scrollHeight > container.clientHeight);
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [currentTeamIndex, currentMembers]);

  return (
    <section
      ref={ref}
      className="floor bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgStaff})` }}
    >
      <div className="flex flex-col items-center justify-center h-full px-4 py-8">
        <h1 className="text-3xl md:text-5xl font-bold text-white font-pixel mb-8">تیم برگزاری</h1>

        {/* کنترل انتخاب تیم */}
        <div className="flex items-center justify-center gap-6 mb-8 text-white font-pixel">
          <button
            onClick={nextTeam}
            className="p-3 rounded-full bg-gray-900 hover:bg-gray-700 transition"
            aria-label="بعدی"
          >
            <FaChevronRight className="text-2xl" />
          </button>

          <div className="relative min-w-[200px] md:min-w-[300px] h-10">
            <h2
              key={currentTeamIndex}
              className="flex items-center justify-center text-2xl md:text-4xl font-bold text-white font-pixel animate-simple-fade-in"
            >
              {currentTeamName}
            </h2>
          </div>

          <button
            onClick={prevTeam}
            className="p-3 rounded-full bg-gray-900 hover:bg-gray-700 transition"
            aria-label="قبلی"
          >
            <FaChevronLeft className="text-2xl" />
          </button>
        </div>

        <div className="relative w-full max-w-6xl">
          {/* Fade gradient top */}
          <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black via-black/50 to-transparent pointer-events-none z-10 rounded-t-2xl" />

          {/* Fade gradient bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none z-10 rounded-b-2xl" />

          <div
            ref={listContainerRef}
            className="w-full overflow-y-auto team-scrollbar bg-gradient-to-br from-gray-900/80 to-black/60 backdrop-blur-sm border-2 border-gray-700/50 rounded-2xl shadow-2xl"
            style={{ maxHeight: '60vh' }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div
              key={currentTeamIndex}
              className={`flex flex-wrap justify-center gap-4 md:gap-6 p-6 animate-team-change-${animDirection}`}
            >
              {currentMembers.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>

          {/* Scroll indicator */}
          {hasScroll && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none z-20">
              <div className="text-white/60 text-xs font-normal animate-bounce bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20 flex items-center gap-1">
                <span>پیمایش کنید</span>
                <span className="text-base">⬍</span>
              </div>
            </div>
          )}
        </div>

        <p className="text-white font-normal text-xs md:text-sm mt-4 opacity-75">
          → اسکرول افقی برای تغییر تیم ←
        </p>
      </div>
    </section>
  );
});

TeamFloor.displayName = 'TeamFloor';

export default TeamFloor;
