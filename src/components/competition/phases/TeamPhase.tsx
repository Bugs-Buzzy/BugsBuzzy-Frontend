import { useEffect, useState } from 'react';

import PixelFrame from '@/components/PixelFrame';
import type { ApiError } from '@/services/api';
import { teamsService, type Team, type TeamMember } from '@/services/teams.service';
import { extractFieldErrors } from '@/utils/errorMessages';

interface TeamPhaseProps {
  teamType: 'inperson' | 'gamejam';
  maxMembers: number;
  minMembers: number;
  requirePaymentForCreate: boolean;
  hasPaid: boolean;
  onTeamComplete?: () => void;
}

export default function TeamPhase({
  teamType,
  maxMembers,
  minMembers,
  requirePaymentForCreate,
  hasPaid,
  onTeamComplete,
}: TeamPhaseProps) {
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);

  const isInPerson = teamType === 'inperson';

  useEffect(() => {
    loadTeam();
  }, []);

  useEffect(() => {
    if (team && team.member_count >= minMembers && onTeamComplete) {
      onTeamComplete();
    }
  }, [team, minMembers, onTeamComplete]);

  const loadTeam = async () => {
    setLoading(true);
    try {
      const teamsData = await teamsService.getAllTeams();
      const existingTeam = teamsData.teams.find((t) => t.team_type === teamType);

      if (existingTeam) {
        setTeam(existingTeam);
        const teamMembers = isInPerson
          ? await teamsService.getInPersonTeamMembers(existingTeam.id)
          : await teamsService.getOnlineTeamMembers(existingTeam.id);
        setMembers(teamMembers);
      }
    } catch (err) {
      console.error('Failed to load team:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      setFieldErrors({ name: 'نام تیم الزامی است' });
      return;
    }

    setLoading(true);
    setError('');
    setFieldErrors({});
    setSuccessMessage('');
    try {
      const response = isInPerson
        ? await teamsService.createInPersonTeam({ name: teamName, description: teamDescription })
        : await teamsService.createOnlineTeam({ name: teamName, description: teamDescription });

      setTeam(response.team);
      setShowCreateForm(false);
      setSuccessMessage('تیم با موفقیت ساخته شد!');
      setTimeout(() => setSuccessMessage(''), 3000);
      await loadTeam();
    } catch (err) {
      console.error('Create team error:', err);
      const apiError = err as ApiError;
      const { fieldErrors, message } = extractFieldErrors(apiError.errors);

      setFieldErrors(fieldErrors);
      setError(message || 'خطا در ساخت تیم');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async () => {
    if (!inviteCode || inviteCode.length !== 8) {
      setFieldErrors({ invite_code: 'کد دعوت باید 8 کاراکتر باشد' });
      return;
    }

    setLoading(true);
    setError('');
    setFieldErrors({});
    setSuccessMessage('');
    try {
      const response = isInPerson
        ? await teamsService.joinInPersonTeam({ invite_code: inviteCode })
        : await teamsService.joinOnlineTeam({ invite_code: inviteCode });

      setTeam(response.team);
      setShowJoinForm(false);
      setSuccessMessage('با موفقیت به تیم پیوستید!');
      setTimeout(() => setSuccessMessage(''), 3000);
      await loadTeam();
    } catch (err) {
      console.error('Join team error:', err);
      const apiError = err as ApiError;
      const { fieldErrors, message } = extractFieldErrors(apiError.errors);

      setFieldErrors(fieldErrors);
      setError(message || 'خطا در پیوستن به تیم');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveTeam = async () => {
    if (!team || !confirm('آیا از خروج از تیم اطمینان دارید؟')) return;

    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      if (isInPerson) {
        await teamsService.leaveInPersonTeam(team.id);
      } else {
        await teamsService.leaveOnlineTeam(team.id);
      }

      setTeam(null);
      setSuccessMessage('از تیم خارج شدید');
      setTimeout(() => setSuccessMessage(''), 3000);
      await loadTeam();
    } catch (err) {
      console.error('Leave team error:', err);
      const apiError = err as ApiError;
      const { message } = extractFieldErrors(apiError.errors);
      setError(message || 'خطا در خروج از تیم');
    } finally {
      setLoading(false);
    }
  };

  const canCreateTeam = requirePaymentForCreate ? hasPaid : true;

  return (
    <div className="space-y-6">
      {successMessage && (
        <PixelFrame className="bg-green-900 bg-opacity-30 border-green-500">
          <p className="text-green-300">{successMessage}</p>
        </PixelFrame>
      )}

      {error && (
        <PixelFrame className="bg-red-900 bg-opacity-30 border-red-500">
          <p className="text-red-300">{error}</p>
        </PixelFrame>
      )}

      {/* Team View */}
      {team ? (
        <div className="space-y-6">
          <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-primary-sky mb-2">{team.name}</h2>
                {team.description && <p className="text-primary-aero">{team.description}</p>}
              </div>
              <span
                className={`pixel-btn ${
                  team.member_count >= minMembers ? 'pixel-btn-success' : 'pixel-btn-warning'
                } px-4 py-2 font-pixel`}
                dir="ltr"
              >
                {team.member_count}/{maxMembers}
              </span>
            </div>

            <div className="bg-primary-midnight rounded p-4 mb-4 border border-primary-cerulean">
              <p className="text-primary-aero mb-2">کد دعوت:</p>
              <p
                className="text-primary-sky text-2xl font-bold tracking-widest text-center font-pixel"
                dir="ltr"
              >
                {team.invite_code}
              </p>
              <p className="text-primary-aero text-sm mt-2 text-center">
                این کد را با دوستان خود به اشتراک بگذارید
              </p>
            </div>

            {team.member_count < minMembers && (
              <div className="bg-yellow-900 bg-opacity-30 rounded p-4 mb-4 border border-yellow-700">
                <p className="text-yellow-300 text-sm">
                  ⚠️ تیم شما باید حداقل {minMembers} نفره باشد تا برای رقابت واجد شرایط شود.
                </p>
              </div>
            )}

            {team.member_count >= minMembers && (
              <div className="bg-green-900 bg-opacity-30 rounded p-4 mb-4 border border-green-600">
                <p className="text-green-300 text-sm flex items-center gap-2">
                  <span>✅</span>
                  <span>تیم شما واجد شرایط است و می‌توانید به مراحل بعدی بروید!</span>
                </p>
              </div>
            )}
          </PixelFrame>

          <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
            <h3 className="text-xl font-bold text-primary-sky mb-4">اعضای تیم</h3>
            <div className="space-y-3">
              <div className="bg-primary-midnight rounded p-4 flex items-center justify-between border border-primary-cerulean">
                <div>
                  <p className="text-primary-sky font-bold">
                    {team.leader.first_name} {team.leader.last_name}
                  </p>
                  <p className="text-primary-aero text-sm">{team.leader.email}</p>
                </div>
                <span className="pixel-btn pixel-btn-primary px-3 py-1 text-sm">سرتیم</span>
              </div>

              {members.map((member) => (
                <div
                  key={member.id}
                  className="bg-primary-midnight rounded p-4 flex items-center justify-between border border-primary-cerulean"
                >
                  <div>
                    <p className="text-primary-sky font-bold">
                      {member.user.first_name} {member.user.last_name}
                    </p>
                    <p className="text-primary-aero text-sm">{member.user.email}</p>
                  </div>
                  {isInPerson && (
                    <span
                      className={`pixel-btn ${
                        member.is_paid ? 'pixel-btn-success' : 'pixel-btn-warning'
                      } px-3 py-1 text-sm`}
                    >
                      {member.is_paid ? '✅ پرداخت شده' : '⏳ در انتظار'}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {!team.is_leader && (
              <button
                onClick={handleLeaveTeam}
                disabled={loading}
                className="pixel-btn pixel-btn-danger py-3 px-8 w-full mt-6"
              >
                {loading ? 'در حال خروج...' : 'خروج از تیم'}
              </button>
            )}
          </PixelFrame>
        </div>
      ) : (
        /* Team Action - Create or Join */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {!showCreateForm && !showJoinForm && (
            <>
              {/* Create Team Card */}
              <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
                <h2 className="text-2xl font-bold text-primary-sky mb-4">➕ ساخت تیم جدید</h2>
                <p className="text-primary-aero mb-6">
                  یک تیم جدید بسازید و دوستان خود را دعوت کنید.
                </p>

                {!canCreateTeam && requirePaymentForCreate && (
                  <div className="bg-red-900 bg-opacity-30 rounded p-3 mb-4 border border-red-500">
                    <p className="text-red-300 text-sm">
                      ⚠️ برای ساخت تیم، ابتدا باید هزینه ثبت‌نام را پرداخت کنید.
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setShowCreateForm(true)}
                  disabled={!canCreateTeam}
                  className={`pixel-btn py-3 px-8 w-full ${
                    canCreateTeam
                      ? 'pixel-btn-primary'
                      : 'pixel-btn-secondary opacity-50 cursor-not-allowed'
                  }`}
                >
                  {canCreateTeam ? 'ساخت تیم' : '🔒 نیاز به پرداخت'}
                </button>
              </PixelFrame>

              {/* Join Team Card */}
              <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
                <h2 className="text-2xl font-bold text-primary-sky mb-4">🔗 پیوستن به تیم</h2>
                <p className="text-primary-aero mb-6">با کد دعوت به تیم دوستان خود بپیوندید.</p>
                <button
                  onClick={() => setShowJoinForm(true)}
                  className="pixel-btn pixel-btn-success py-3 px-8 w-full"
                >
                  پیوستن به تیم
                </button>
              </PixelFrame>
            </>
          )}

          {/* Create Form */}
          {showCreateForm && (
            <PixelFrame className="bg-primary-oxfordblue bg-opacity-90 md:col-span-2">
              <h2 className="text-2xl font-bold text-primary-sky mb-4">➕ ساخت تیم جدید</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-primary-sky font-bold mb-2">نام تیم *</label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => {
                      setTeamName(e.target.value);
                      if (fieldErrors.name) {
                        const { name: _name, ...rest } = fieldErrors;
                        setFieldErrors(rest);
                      }
                    }}
                    placeholder="نام تیم خود را وارد کنید"
                    className="w-full pixel-input bg-primary-midnight text-primary-aero border-primary-cerulean p-3"
                    required
                  />
                  {fieldErrors.name && (
                    <p className="text-red-400 text-sm mt-1">{fieldErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-primary-sky font-bold mb-2">توضیحات (اختیاری)</label>
                  <textarea
                    value={teamDescription}
                    onChange={(e) => setTeamDescription(e.target.value)}
                    placeholder="توضیحاتی درباره تیم"
                    className="w-full pixel-input bg-primary-midnight text-primary-aero border-primary-cerulean p-3"
                    rows={3}
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleCreateTeam}
                    disabled={!teamName.trim() || loading}
                    className="pixel-btn pixel-btn-primary py-3 px-8 flex-1"
                  >
                    {loading ? 'در حال ساخت...' : 'ساخت تیم'}
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateForm(false);
                      setFieldErrors({});
                    }}
                    className="pixel-btn pixel-btn-danger py-3 px-8"
                    disabled={loading}
                  >
                    انصراف
                  </button>
                </div>
              </div>
            </PixelFrame>
          )}

          {/* Join Form */}
          {showJoinForm && (
            <PixelFrame className="bg-primary-oxfordblue bg-opacity-90 md:col-span-2">
              <h2 className="text-2xl font-bold text-primary-sky mb-4">🔗 پیوستن به تیم</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-primary-sky font-bold mb-2">کد دعوت *</label>
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => {
                      setInviteCode(e.target.value.toUpperCase());
                      if (fieldErrors.invite_code) {
                        const { invite_code: _invite_code, ...rest } = fieldErrors;
                        setFieldErrors(rest);
                      }
                    }}
                    placeholder="کد 8 کاراکتری (مثلاً BG2024AB)"
                    maxLength={8}
                    className="w-full pixel-input bg-primary-midnight text-primary-aero border-primary-cerulean p-3 text-center text-xl tracking-widest font-pixel"
                    dir="ltr"
                    required
                  />
                  {fieldErrors.invite_code && (
                    <p className="text-red-400 text-sm mt-1">{fieldErrors.invite_code}</p>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleJoinTeam}
                    disabled={inviteCode.length !== 8 || loading}
                    className="pixel-btn pixel-btn-success py-3 px-8 flex-1"
                  >
                    {loading ? 'در حال پیوستن...' : 'پیوستن'}
                  </button>
                  <button
                    onClick={() => {
                      setShowJoinForm(false);
                      setFieldErrors({});
                    }}
                    className="pixel-btn pixel-btn-danger py-3 px-8"
                    disabled={loading}
                  >
                    انصراف
                  </button>
                </div>
              </div>
            </PixelFrame>
          )}
        </div>
      )}
    </div>
  );
}
