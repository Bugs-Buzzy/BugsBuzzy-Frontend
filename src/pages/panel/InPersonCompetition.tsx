import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PaymentPhase from '@/components/competition/phases/PaymentPhase';
import PlaceholderPhase from '@/components/competition/phases/PlaceholderPhase';
import TeamPhase from '@/components/competition/phases/TeamPhase';
import ProgressBar, { type Phase } from '@/components/competition/ProgressBar';
import PixelFrame from '@/components/PixelFrame';
import { useAuth } from '@/context/AuthContext';
import { teamsService } from '@/services/teams.service';

export default function InPersonCompetition() {
  const { profileCompleted, user: _user } = useAuth();
  const navigate = useNavigate();
  const [currentPhase, setCurrentPhase] = useState(0);
  const [loading, setLoading] = useState(true);

  // Phase status tracking
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
      // Check purchased items to determine if base item (inperson) was paid
      const { paymentsService } = await import('@/services/payments.service');
      const purchasedData = await paymentsService.getPurchasedItems();
      const hasPaid = purchasedData.purchased_items.includes('inperson');

      const teamsData = await teamsService.getAllTeams();
      const inPersonTeam = teamsData.teams.find((t) => t.team_type === 'in_person');
      const hasTeam = !!inPersonTeam;
      const teamComplete = inPersonTeam ? inPersonTeam.member_count >= 3 : false;

      setPhaseStatus({
        hasPaid,
        hasTeam,
        teamComplete,
      });

      // Determine current phase
      if (!hasPaid) {
        setCurrentPhase(0);
      } else if (!hasTeam || !teamComplete) {
        setCurrentPhase(1);
      } else {
        setCurrentPhase(2);
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
      title: 'پرداخت',
      icon: '💰',
      status: currentPhase === 0 ? 'current' : phaseStatus.hasPaid ? 'completed' : 'locked',
      isClickable: phaseStatus.hasPaid,
    },
    {
      id: 1,
      title: 'تیم‌سازی',
      icon: '👥',
      status:
        currentPhase === 1
          ? 'current'
          : phaseStatus.teamComplete
            ? 'completed'
            : phaseStatus.hasPaid
              ? 'available'
              : 'locked',
      isClickable: phaseStatus.hasPaid,
    },
    {
      id: 2,
      title: 'فاز اول',
      icon: '🎯',
      status: currentPhase === 2 ? 'current' : phaseStatus.teamComplete ? 'available' : 'locked',
      isClickable: false,
    },
    {
      id: 3,
      title: 'فاز دوم',
      icon: '🎮',
      status: currentPhase === 3 ? 'current' : 'locked',
      isClickable: false,
    },
    {
      id: 4,
      title: 'فاز نهایی',
      icon: '🏁',
      status: currentPhase === 4 ? 'current' : 'locked',
      isClickable: false,
    },
  ];

  const handlePhaseChange = (phaseId: number) => {
    const phase = phases.find((p) => p.id === phaseId);
    if (phase && phase.isClickable) {
      setCurrentPhase(phaseId);
    }
  };

  const handlePaymentComplete = () => {
    setPhaseStatus((prev) => ({ ...prev, hasPaid: true }));
    setCurrentPhase(1);
    loadStatus();
  };

  const handleTeamComplete = () => {
    setPhaseStatus((prev) => ({ ...prev, teamComplete: true }));
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

      {currentPhase === 1 && (
        <TeamPhase
          teamType="inperson"
          maxMembers={3}
          minMembers={3}
          requirePaymentForCreate={true}
          hasPaid={phaseStatus.hasPaid}
          onTeamComplete={handleTeamComplete}
        />
      )}

      {currentPhase >= 2 && (
        <PlaceholderPhase
          phaseNumber={currentPhase}
          phaseName={`فاز ${currentPhase - 1}`}
          description="جزئیات این فاز به‌زودی اعلام خواهد شد"
        />
      )}
    </div>
  );
}
