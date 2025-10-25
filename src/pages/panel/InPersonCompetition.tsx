import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PhaseContent from '@/components/competition/phases/PhaseContent';
import PixelFrame from '@/components/PixelFrame';
import ProgressBar, { type Phase } from '@/components/ProgressBar';
import { useAuth } from '@/context/AuthContext';
import InPersonTeamPhase from '@/pages/phases/InPersonTeamPhase';
import PaymentPhase from '@/pages/phases/PaymentPhase';
import { inpersonService, type CompetitionPhase } from '@/services/inperson.service';

export default function InPersonCompetition() {
  const { profileCompleted, user: _user } = useAuth();
  const navigate = useNavigate();
  const [currentPhase, setCurrentPhase] = useState(0);
  const [manualPhaseSelection, setManualPhaseSelection] = useState(false);
  const [loading, setLoading] = useState(true);

  const [competitionPhases, setCompetitionPhases] = useState<CompetitionPhase[]>([]);

  const [phaseStatus, setPhaseStatus] = useState({
    hasPaid: false,
    hasTeam: false,
    teamComplete: false,
  });

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const [competitionStatus, teamResponse, purchasedData] = await Promise.all([
        inpersonService.getCompetitionStatus(),
        inpersonService.getMyTeam(),
        import('@/services/payments.service').then((m) => m.paymentsService.getPurchasedItems()),
      ]);

      setCompetitionPhases(competitionStatus.phases);

      const hasPaid = purchasedData.purchased_items.includes('inperson');
      const hasTeam = !!teamResponse.team;
      const teamComplete = teamResponse.team
        ? teamResponse.team.status === 'active' || teamResponse.team.status === 'attended'
        : false;

      setPhaseStatus({
        hasPaid,
        hasTeam,
        teamComplete,
      });

      // Only auto-navigate if user hasn't manually selected a phase
      if (!manualPhaseSelection) {
        if (!hasPaid) {
          setCurrentPhase(0);
        } else if (!hasTeam || !teamComplete) {
          setCurrentPhase(1);
        } else {
          const activePhase = competitionStatus.phases.find((p) => p.active);
          if (activePhase) {
            setCurrentPhase(activePhase.id + 1);
          } else {
            setCurrentPhase(2);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load status:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPhaseStatus = (phaseId: number): 'current' | 'completed' | 'available' | 'locked' => {
    if (currentPhase === phaseId) return 'current';
    if (phaseId === 0) return phaseStatus.hasPaid ? 'completed' : 'locked';
    if (phaseId === 1) {
      if (phaseStatus.teamComplete) return 'completed';
      if (phaseStatus.hasPaid) return 'available';
      return 'locked';
    }
    const backendPhase = competitionPhases.find((p) => p.id === phaseId - 2);
    if (!phaseStatus.teamComplete) return 'locked';
    if (backendPhase?.active) return 'available';
    if (currentPhase > phaseId) return 'completed';
    return 'locked';
  };

  const phases: Phase[] = [
    {
      id: 0,
      title: 'پرداخت',
      icon: '💰',
      status: getPhaseStatus(0),
      isClickable: phaseStatus.hasPaid,
    },
    {
      id: 1,
      title: 'تیم‌سازی',
      icon: '👥',
      status: getPhaseStatus(1),
      isClickable: phaseStatus.hasPaid,
    },
    ...competitionPhases.map((phase, index) => ({
      id: index + 2,
      title: phase.title,
      icon: ['🎯', '🎮', '🏁'][index] || '🎯',
      status: getPhaseStatus(index + 2),
      isClickable: false,
    })),
  ];

  const handlePhaseChange = (phaseId: number) => {
    const phase = phases.find((p) => p.id === phaseId);
    if (phase?.isClickable) {
      setManualPhaseSelection(true);
      setCurrentPhase(phaseId);
    }
  };

  const handlePaymentComplete = () => {
    setPhaseStatus((prev) => ({ ...prev, hasPaid: true }));
    setManualPhaseSelection(false);
    setCurrentPhase(1);
    loadStatus();
  };

  const handleTeamComplete = () => {
    setPhaseStatus((prev) => ({ ...prev, teamComplete: true }));
    setManualPhaseSelection(false);
    loadStatus();
  };

  if (!profileCompleted) {
    return (
      <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-primary-sky mb-4">⚠️ پروفایل تکمیل نشده</h2>
          <p className="text-primary-aero mb-4">
            برای ثبت‌نام در رقابت حضوری، ابتدا پروفایل خود را تکمیل کنید.
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
          <span>🏆</span>
          <span>رقابت حضوری</span>
        </h1>
        <p className="text-primary-aero">ثبت‌نام و تشکیل تیم برای رقابت حضوری باگزبازی</p>
      </PixelFrame>

      {/* Progress Bar */}
      <ProgressBar phases={phases} currentPhase={currentPhase} onPhaseClick={handlePhaseChange} />

      {/* Phase Content */}
      {currentPhase === 0 && (
        <PaymentPhase
          baseItem="inperson"
          baseItemLabel="ثبت‌نام رقابت حضوری"
          additionalItems={[
            { id: 'thursday_lunch', label: 'ناهار روز اول (پنجشنبه)' },
            { id: 'friday_lunch', label: 'ناهار روز دوم (جمعه)' },
          ]}
          onPaymentComplete={handlePaymentComplete}
        />
      )}

      {currentPhase === 1 && <InPersonTeamPhase onTeamComplete={handleTeamComplete} />}

      {currentPhase >= 2 && (
        <PhaseContent
          phaseNumber={currentPhase}
          phaseId={currentPhase - 2}
          phaseName={competitionPhases[currentPhase - 2]?.title || `فاز ${currentPhase - 1}`}
          description={
            competitionPhases[currentPhase - 2]?.description ||
            'جزئیات این فاز به‌زودی اعلام خواهد شد'
          }
          startDate={competitionPhases[currentPhase - 2]?.start}
          endDate={competitionPhases[currentPhase - 2]?.end}
          isActive={competitionPhases[currentPhase - 2]?.active}
          icon={['🎯', '🎮', '🏁'][currentPhase - 2] || '🎯'}
        />
      )}
    </div>
  );
}
