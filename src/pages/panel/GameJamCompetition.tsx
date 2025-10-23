import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import GameJamTeamPhase from '@/components/competition/phases/GameJamTeamPhase';
import PlaceholderPhase from '@/components/competition/phases/PlaceholderPhase';
import ProgressBar, { type Phase } from '@/components/competition/ProgressBar';
import PixelFrame from '@/components/PixelFrame';
import { useAuth } from '@/context/AuthContext';
import { teamsService } from '@/services/teams.service';

export default function GameJamCompetition() {
  const { profileCompleted } = useAuth();
  const navigate = useNavigate();
  const [currentPhase, setCurrentPhase] = useState(0);
  const [loading, setLoading] = useState(true);

  // Phase status tracking
  const [phaseStatus, setPhaseStatus] = useState({
    hasTeam: false,
  });

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const teamsData = await teamsService.getAllTeams();
      const gameJamTeam = teamsData.teams.find((t) => t.team_type === 'online');
      const hasTeam = !!gameJamTeam;

      setPhaseStatus({
        hasTeam,
      });

      // Determine current phase
      if (!hasTeam) {
        setCurrentPhase(0); // Team creation/join phase
      } else {
        setCurrentPhase(1); // First competition phase
      }
    } catch (err) {
      console.error('Failed to load status:', err);
    } finally {
      setLoading(false);
    }
  };

  const phases: Phase[] = [
    {
      id: 0,
      title: 'تیم‌سازی',
      icon: '👥',
      status: currentPhase === 0 ? 'current' : phaseStatus.hasTeam ? 'completed' : 'available',
      isClickable: true,
    },
    {
      id: 1,
      title: 'فاز اول',
      icon: '🎯',
      status: currentPhase === 1 ? 'current' : phaseStatus.hasTeam ? 'available' : 'locked',
      isClickable: false,
    },
    {
      id: 2,
      title: 'فاز دوم',
      icon: '🎮',
      status: currentPhase === 2 ? 'current' : 'locked',
      isClickable: false,
    },
    {
      id: 3,
      title: 'فاز نهایی',
      icon: '🏁',
      status: currentPhase === 3 ? 'current' : 'locked',
      isClickable: false,
    },
  ];

  const handlePhaseChange = (phaseId: number) => {
    const phase = phases.find((p) => p.id === phaseId);
    if (phase && phase.isClickable) {
      setCurrentPhase(phaseId);
    }
  };

  const handleTeamCreated = () => {
    setPhaseStatus({ hasTeam: true });
    setCurrentPhase(1);
    loadStatus();
  };

  if (!profileCompleted) {
    return (
      <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-primary-sky mb-4">⚠️ پروفایل تکمیل نشده</h2>
          <p className="text-primary-aero mb-4">
            برای ثبت‌نام در گیم‌جم مجازی، ابتدا پروفایل خود را تکمیل کنید.
          </p>
          <button
            onClick={() => navigate('/panel/profile')}
            className="pixel-btn pixel-btn-primary px-6 py-2"
          >
            تکمیل پروفایل
          </button>
        </div>
      </PixelFrame>
    );
  }

  if (loading) {
    return (
      <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
        <div className="text-center py-8">
          <p className="text-primary-aero">در حال بارگذاری...</p>
        </div>
      </PixelFrame>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
        <h1 className="text-3xl font-bold text-primary-sky mb-4 flex items-center gap-3">
          <span>🎮</span>
          <span>گیم‌جم مجازی</span>
        </h1>
        <p className="text-primary-aero">ثبت‌نام و تشکیل تیم برای مسابقه بازی‌سازی آنلاین</p>
      </PixelFrame>

      {/* Progress Bar */}
      <ProgressBar phases={phases} currentPhase={currentPhase} onPhaseClick={handlePhaseChange} />

      {/* Phase Content */}
      {currentPhase === 0 && <GameJamTeamPhase onTeamCreated={handleTeamCreated} />}

      {currentPhase >= 1 && (
        <PlaceholderPhase
          phaseNumber={currentPhase}
          phaseName={`فاز ${currentPhase}`}
          description="جزئیات این فاز به‌زودی اعلام خواهد شد"
        />
      )}
    </div>
  );
}
