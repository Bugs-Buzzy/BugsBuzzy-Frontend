import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import PhaseContent from '@/components/competition/phases/PhaseContent';
import Loading from '@/components/Loading';
import PixelFrame from '@/components/PixelFrame';
import ProgressBar, { type Phase } from '@/components/ProgressBar';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import OnlineSubmissionForm from '@/pages/phases/OnlineSubmissionForm';
import OnlineTeamPhase from '@/pages/phases/OnlineTeamPhase';
import PaymentPhase from '@/pages/phases/PaymentPhase';
import type { ApiError } from '@/services/api';
import {
  gamejamService,
  type OnlineCompetition,
  type OnlineTeam,
} from '@/services/gamejam.service';
import { extractFieldErrors, translateError } from '@/utils/errorMessages';

export default function GameJamCompetition() {
  const { profileCompleted, user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [currentPhase, setCurrentPhase] = useState(0);
  const [viewingPhase, setViewingPhase] = useState(0);
  const manualPhaseSelectionRef = useRef(false);
  const [loading, setLoading] = useState(true);

  const [competitionStatus, setCompetitionStatus] = useState<OnlineCompetition | null>(null);
  const [myTeam, setMyTeam] = useState<OnlineTeam | null>(null);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const [competition, teamResponse] = await Promise.all([
        gamejamService.getCompetitionStatus(),
        gamejamService.getMyTeam(),
      ]);

      setCompetitionStatus(competition);
      setMyTeam(teamResponse.team);

      // Determine actual current phase based on progress
      let actualPhase = 0;

      if (!teamResponse.team) {
        // Phase 0: No team
        actualPhase = 0;
      } else if (
        teamResponse.team.status === 'inactive' &&
        teamResponse.team.leader.email === user?.email
      ) {
        // Phase 1: Team inactive & isLeader (payment needed)
        actualPhase = 1;
      } else if (
        teamResponse.team.status === 'completed' ||
        teamResponse.team.status === 'attended'
      ) {
        // Phase 2: Team completed/attended (reached MIN_MEMBERS and can compete)
        actualPhase = 2;
      } else {
        // Team is active but not complete yet (need more members)
        actualPhase = 0;
      }

      setCurrentPhase(actualPhase);

      // Set viewing phase (only if not manually selected)
      if (!manualPhaseSelectionRef.current) {
        setViewingPhase(actualPhase);
      }
    } catch (err) {
      console.error('Failed to load status:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPhaseStatus = (phaseId: number): 'current' | 'completed' | 'available' | 'locked' => {
    if (currentPhase === phaseId) return 'current';

    // Phase 0: Team Building
    if (phaseId === 0) {
      if (!myTeam) return 'available';
      if (myTeam.status === 'completed' || myTeam.status === 'attended') return 'completed';
      return 'available'; // Still building team (active but not complete)
    }

    // Phase 1: Payment
    if (phaseId === 1) {
      if (!myTeam) return 'locked';
      if (myTeam.status === 'inactive' && myTeam.leader.email === user?.email) return 'available';
      return 'completed';
    }

    // Phase 2: Competition (only available when team is complete)
    if (phaseId === 2) {
      if (!myTeam) return 'locked';
      if (myTeam.status === 'completed' || myTeam.status === 'attended') {
        return competitionStatus?.phase_active ? 'available' : 'locked';
      }
      return 'locked';
    }

    return 'locked';
  };

  const phases: Phase[] = [
    {
      id: 0,
      title: 'تیم‌سازی',
      icon: '👥',
      status: getPhaseStatus(0),
      isClickable: true,
    },
    {
      id: 1,
      title: 'پرداخت',
      icon: '💳',
      status: getPhaseStatus(1),
      isClickable: !!myTeam && myTeam.status === 'inactive',
    },
    {
      id: 2,
      title: 'گیم‌جم آنلاین',
      icon: '🎮',
      status: getPhaseStatus(2),
      isClickable:
        !!myTeam &&
        (myTeam.status === 'active' || myTeam.status === 'completed') &&
        !!competitionStatus?.phase_active,
    },
  ];

  const handlePhaseChange = (phaseId: number) => {
    const phase = phases.find((p) => p.id === phaseId);
    if (phase?.isClickable) {
      manualPhaseSelectionRef.current = true;
      setViewingPhase(phaseId);
    }
  };

  const handlePaymentComplete = async () => {
    try {
      // Re-check purchased items
      const purchasedData = await import('@/services/payments.service').then((m) =>
        m.paymentsService.getPurchasedItems(),
      );

      if (purchasedData.purchased_items.includes('gamejam') && myTeam) {
        // Activate team
        await gamejamService.activateTeam(myTeam.id);
        toast.success('تیم شما فعال شد!');

        // Reload status
        await loadStatus();

        // Move to competition phase
        manualPhaseSelectionRef.current = false;
        setViewingPhase(2);
      }
    } catch (err) {
      console.error('Failed to activate team:', err);
      const apiError = err as ApiError;

      const rawError = apiError.error || apiError.message || 'خطا در فعال‌سازی تیم';
      const errorMessage = translateError(rawError);
      const { message } = extractFieldErrors(apiError.errors);

      toast.error(message || errorMessage);
    }
  };

  if (!profileCompleted) {
    return (
      <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-primary-sky mb-4">⚠️ پروفایل تکمیل نشده</h2>
          <p className="text-primary-aero mb-4">
            برای ثبت‌نام در گیم‌جم، ابتدا پروفایل خود را تکمیل کنید.
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
        <div className="py-8">
          <Loading text="در حال بارگذاری..." />
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
          <span>گیم‌جم آنلاین</span>
        </h1>
        <p className="text-primary-aero">ساخت بازی و شرکت در رقابت گیم‌جم باگزبازی</p>
      </PixelFrame>

      {/* Progress Bar */}
      <ProgressBar phases={phases} currentPhase={currentPhase} onPhaseClick={handlePhaseChange} />

      {/* Phase Content */}
      {viewingPhase === 0 && <OnlineTeamPhase onTeamComplete={loadStatus} />}

      {viewingPhase === 1 &&
        myTeam &&
        myTeam.status === 'inactive' &&
        myTeam.leader.email === user?.email && (
          <>
            {/* Warning before payment */}
            <PixelFrame className="bg-yellow-900 bg-opacity-30 border-yellow-600 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 text-2xl flex-shrink-0">⚠️</span>
                <div className="text-yellow-200 leading-relaxed">
                  <p className="font-bold mb-3 text-lg">
                    توجه: با پرداخت، تیم شما فعال شده و دیگر نمی‌توانید آن را حذف کنید!
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>بعد از فعال‌سازی تیم، امکان حذف تیم وجود ندارد</li>
                    <li>شما به عنوان سرتیم نمی‌توانید از تیم خارج شوید</li>
                    <li>فقط اعضای تیم می‌توانند تیم را ترک کنند</li>
                  </ul>
                </div>
              </div>
            </PixelFrame>

            <PaymentPhase
              baseItem="gamejam"
              baseItemLabel="ثبت‌نام گیم‌جم"
              onPaymentComplete={handlePaymentComplete}
              teamId={myTeam.id}
              onCancelPayment={() => {
                loadStatus();
              }}
            />
          </>
        )}

      {viewingPhase === 2 &&
        myTeam &&
        (myTeam.status === 'completed' || myTeam.status === 'attended') &&
        competitionStatus && (
          <div className="space-y-6">
            <PhaseContent
              phaseNumber={2}
              phaseId={0}
              phaseName={competitionStatus.title || 'رقابت گیم‌جم'}
              description={
                competitionStatus.description ||
                'بازی خود را بسازید و برای رقابت ارسال کنید. موفق باشید!'
              }
              startDate={competitionStatus.start || undefined}
              endDate={competitionStatus.end || undefined}
              isActive={competitionStatus.phase_active}
              icon="🎮"
            />

            <OnlineSubmissionForm competition={competitionStatus} />
          </div>
        )}
    </div>
  );
}
