import { forwardRef, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import bgStaff from '@/assets/bkg-staff.png';
import TeamMemberCard from '@/components/TeamMemberCard';
import { teams, type TeamName } from '@/data/teams';
import { useScrollInterceptor } from '@/hooks/useScrollInterceptor';

const TeamFloor = forwardRef<HTMLElement>((props, ref) => {
  const teamNames = Object.keys(teams) as TeamName[];
  const reversedTeamNames = useMemo(() => [...teamNames].reverse(), [teamNames]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [animDirection, setAnimDirection] = useState<'left' | 'right'>('left');
  const [hasScroll, setHasScroll] = useState(false);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const isChangingTeam = useRef(false);

  const currentTeamName = teamNames[currentTeamIndex];
  const currentMembers = teams[currentTeamName];

  const nextTeam = useCallback(() => {
    if (isChangingTeam.current) return;
    isChangingTeam.current = true;
    setAnimDirection('right');
    setCurrentTeamIndex((prev) => (prev + 1) % teamNames.length);
    setTimeout(() => {
      isChangingTeam.current = false;
    }, 600);
  }, [teamNames.length]);

  const prevTeam = useCallback(() => {
    if (isChangingTeam.current) return;
    isChangingTeam.current = true;
    setAnimDirection('left');
    setCurrentTeamIndex((prev) => (prev === 0 ? teamNames.length - 1 : prev - 1));
    setTimeout(() => {
      isChangingTeam.current = false;
    }, 600);
  }, [teamNames.length]);

  useScrollInterceptor(listContainerRef, {
    onLeft: prevTeam,
    onRight: nextTeam,
  });

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
            className="p-3 rounded-full bg-primary-oxfordblue hover:bg-primary-cerulean transition"
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
            className="p-3 rounded-full bg-primary-oxfordblue hover:bg-primary-cerulean transition"
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

        {/* Page Indicators */}
        <div className="mt-4 md:mt-6 mb-2 flex gap-2 cursor-pointer justify-center">
          {reversedTeamNames.map((teamName, reversedIndex) => {
            const index = teamNames.length - 1 - reversedIndex;
            return (
              <div
                key={teamName}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentTeamIndex === index
                    ? 'bg-primary-sky w-6'
                    : 'bg-primary-oxfordblue hover:bg-primary-midnight'
                }`}
                onClick={() => {
                  setAnimDirection(index > currentTeamIndex ? 'right' : 'left');
                  setCurrentTeamIndex(index);
                }}
              />
            );
          })}
        </div>

        <p className="text-white font-normal text-xs md:text-sm opacity-75">
          → اسکرول افقی برای تغییر تیم ←
        </p>
      </div>
    </section>
  );
});

TeamFloor.displayName = 'TeamFloor';

export default TeamFloor;
