import { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaCheckCircle } from 'react-icons/fa';

import PixelModal from '@/components/modals/PixelModal';
import PixelFrame from '@/components/PixelFrame';
import { GAMEJAM_TEAM_CONFIG } from '@/constants/gamejam';
import { useToast } from '@/context/ToastContext';
import type { ApiError } from '@/services/api';
import { gamejamService, type OnlineTeam, type OnlineTeamMember } from '@/services/gamejam.service';
import { extractFieldErrors, translateError } from '@/utils/errorMessages';

interface OnlineTeamPhaseProps {
  onTeamComplete?: () => void;
}

export default function OnlineTeamPhase({ onTeamComplete }: OnlineTeamPhaseProps) {
  const [team, setTeam] = useState<OnlineTeam | null>(null);
  const [members, setMembers] = useState<OnlineTeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const toast = useToast();

  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);

  useEffect(() => {
    loadTeam();
  }, []);

  useEffect(() => {
    // In GameJam, team must be 'completed' (reached MIN_MEMBERS) or 'attended' to proceed
    if (team && (team.status === 'completed' || team.status === 'attended') && onTeamComplete) {
      onTeamComplete();
    }
  }, [team, onTeamComplete]);

  const loadTeam = async () => {
    setLoading(true);
    try {
      const response = await gamejamService.getMyTeam();

      if (response.team) {
        setTeam(response.team);
        setMembers(response.team.members || []);
      } else {
        setTeam(null);
        setMembers([]);
      }
    } catch (err) {
      console.error('Failed to load team:', err);
      setTeam(null);
      setMembers([]);
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
    try {
      const newTeam = await gamejamService.createTeam({
        name: teamName,
        description: teamDescription,
      });

      setTeam(newTeam);
      setShowCreateForm(false);
      setTeamName('');
      setTeamDescription('');
      toast.success('تیم ساخته شد. لطفاً برای فعال‌سازی تیم، پرداخت را انجام دهید');

      // Reload team and trigger phase change to move to payment
      await loadTeam();
      if (onTeamComplete) {
        onTeamComplete();
      }
    } catch (err) {
      console.error('Create team error:', err);
      const apiError = err as ApiError;

      const rawError = apiError.error || apiError.message || 'خطا در ساخت تیم';
      const errorMessage = translateError(rawError);
      const { fieldErrors, message } = extractFieldErrors(apiError.errors);

      setFieldErrors(fieldErrors);
      setError(message || errorMessage);
      toast.error(message || errorMessage);
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
    try {
      const newTeam = await gamejamService.joinTeam(inviteCode);

      setTeam(newTeam);
      setShowJoinForm(false);
      toast.success('با موفقیت به تیم پیوستید!');
      await loadTeam();
    } catch (err) {
      console.error('Join team error:', err);
      const apiError = err as ApiError;

      const rawError = apiError.error || apiError.message || 'خطا در پیوستن به تیم';
      const errorMessage = translateError(rawError);
      const { fieldErrors, message } = extractFieldErrors(apiError.errors);

      setFieldErrors(fieldErrors);
      setError(message || errorMessage);
      toast.error(message || errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveTeam = async () => {
    if (!team || !confirm('آیا از خروج از تیم اطمینان دارید؟')) return;

    setLoading(true);
    setError('');
    try {
      await gamejamService.leaveTeam(team.id);
      setTeam(null);
      setMembers([]);
      toast.success('از تیم خارج شدید');
      await loadTeam();
    } catch (err) {
      console.error('Leave team error:', err);
      const apiError = err as ApiError;

      const rawError = apiError.error || apiError.message || 'خطا در خروج از تیم';
      const errorMessage = translateError(rawError);
      const { message } = extractFieldErrors(apiError.errors);

      setError(message || errorMessage);
      toast.error(message || errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditModal = () => {
    if (team) {
      setTeamName(team.name);
      setTeamDescription(team.description || '');
      setShowEditModal(true);
      setError('');
      setFieldErrors({});
    }
  };

  const handleUpdateTeam = async () => {
    if (!team || !teamName.trim()) {
      setFieldErrors({ name: 'نام تیم الزامی است' });
      return;
    }

    setLoading(true);
    setError('');
    setFieldErrors({});
    try {
      await gamejamService.updateTeam(team.id, {
        name: teamName,
        description: teamDescription,
      });

      toast.success('اطلاعات تیم با موفقیت به‌روزرسانی شد');
      setShowEditModal(false);
      await loadTeam();
    } catch (err) {
      console.error('Update team error:', err);
      const apiError = err as ApiError;

      const rawError = apiError.error || apiError.message || 'خطا در به‌روزرسانی تیم';
      const errorMessage = translateError(rawError);
      const { fieldErrors, message } = extractFieldErrors(apiError.errors);

      setFieldErrors(fieldErrors);
      setError(message || errorMessage);
      toast.error(message || errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!team) return;

    setLoading(true);
    setError('');
    try {
      await gamejamService.deleteTeam(team.id);
      setTeam(null);
      setMembers([]);
      setShowDeleteModal(false);
      toast.success('تیم با موفقیت حذف شد');
      await loadTeam();
    } catch (err) {
      console.error('Delete team error:', err);
      const apiError = err as ApiError;

      const rawError = apiError.error || apiError.message || 'خطا در حذف تیم';
      const errorMessage = translateError(rawError);
      const { message } = extractFieldErrors(apiError.errors);

      setError(message || errorMessage);
      toast.error(message || errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeInviteCode = async () => {
    if (!team) return;

    setLoading(true);
    setError('');
    try {
      const response = await gamejamService.revokeInviteCode(team.id);
      setTeam(response.team);
      setShowRevokeModal(false);
      toast.success(`کد دعوت باطل شد. کد جدید: ${response.new_invite_code}`);
      await loadTeam();
    } catch (err) {
      console.error('Revoke invite code error:', err);
      const apiError = err as ApiError;

      const rawError = apiError.error || apiError.message || 'خطا در باطل کردن کد دعوت';
      const errorMessage = translateError(rawError);
      const { message } = extractFieldErrors(apiError.errors);

      setError(message || errorMessage);
      toast.error(message || errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isLeader = team?.is_leader || false;

  return (
    <div className="space-y-6">
      {error && (
        <PixelFrame className="bg-red-900 bg-opacity-30 border-red-500">
          <p className="text-red-300">{error}</p>
        </PixelFrame>
      )}

      {/* Team View */}
      {team ? (
        <div className="space-y-6">
          <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
            {/* Mobile-friendly header */}
            <div className="mb-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div className="flex items-center gap-3 flex-1 flex-row-reverse">
                  <div className="min-w-0 flex-1 text-right">
                    <h2 className="text-lg sm:text-2xl font-bold text-primary-sky truncate">
                      {team.name}
                    </h2>
                    {team.description && (
                      <p className="text-primary-aero text-xs sm:text-sm line-clamp-2">
                        {team.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 items-center justify-between sm:justify-start">
                  <span
                    className={`pixel-btn ${
                      team.status === 'active' || team.status === 'completed'
                        ? 'pixel-btn-success'
                        : 'pixel-btn-warning'
                    } px-3 py-1 sm:px-4 sm:py-2 font-pixel text-sm sm:text-base`}
                    dir="ltr"
                  >
                    {team.member_count}/{GAMEJAM_TEAM_CONFIG.MAX_MEMBERS}
                  </span>
                  {isLeader && (
                    <div className="flex gap-1 sm:gap-2">
                      <button
                        onClick={handleOpenEditModal}
                        className="pixel-btn pixel-btn-primary px-2 py-1 sm:px-3 sm:py-2 flex items-center gap-1"
                        title={
                          team.status === 'attended'
                            ? 'تیم شرکت کرده قابل ویرایش نیست'
                            : 'ویرایش تیم'
                        }
                        disabled={team.status === 'attended'}
                      >
                        <FaEdit className="text-sm sm:text-base" />
                        <span className="hidden sm:inline text-xs">ویرایش</span>
                      </button>
                      {team.status === 'inactive' && (
                        <button
                          onClick={() => setShowDeleteModal(true)}
                          className="pixel-btn pixel-btn-danger px-2 py-1 sm:px-3 sm:py-2 flex items-center gap-1"
                          title="حذف تیم (قبل از پرداخت)"
                        >
                          <FaTrash className="text-sm sm:text-base" />
                          <span className="hidden sm:inline text-xs">حذف</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {team.invite_code && team.member_count < GAMEJAM_TEAM_CONFIG.MAX_MEMBERS && (
              <div className="bg-primary-midnight rounded p-4 mb-4 border border-primary-cerulean">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-primary-aero">کد دعوت:</p>
                  {isLeader && (
                    <button
                      onClick={() => setShowRevokeModal(true)}
                      className="pixel-btn pixel-btn-warning px-3 py-1 text-xs flex items-center gap-1"
                      title="باطل کردن و ساخت کد جدید"
                    >
                      <span>🔄</span>
                      <span>کد جدید</span>
                    </button>
                  )}
                </div>
                <p
                  className="text-primary-sky text-2xl font-bold tracking-widest text-center font-mono"
                  dir="ltr"
                >
                  {team.invite_code}
                </p>
                <p className="text-primary-aero text-sm mt-2 text-center">
                  این کد را به هم‌گروهی‌های خود ارسال کنید
                </p>
              </div>
            )}

            {team.status === 'inactive' && isLeader && (
              <div className="bg-red-900 bg-opacity-30 rounded p-4 mb-4 border border-red-600">
                <p className="text-red-300 text-sm font-bold flex items-center gap-2">
                  ⚠️ ابتدا باید پرداخت انجام شود تا تیم فعال شود و بتوانید اعضا دعوت کنید.
                </p>
              </div>
            )}

            {team.status === 'inactive' && !isLeader && (
              <div className="bg-yellow-900 bg-opacity-30 rounded p-4 mb-4 border border-yellow-700">
                <p className="text-yellow-300 text-sm">
                  ⏳ در انتظار پرداخت سرتیم برای فعال‌سازی تیم...
                </p>
              </div>
            )}

            {(team.status === 'active' || team.status === 'completed') && (
              <div className="bg-green-900 bg-opacity-30 rounded p-4 mb-4 border border-green-600">
                <p className="text-green-300 text-sm flex items-center gap-2">
                  <FaCheckCircle className="text-lg" />
                  <span>تیم شما واجد شرایط است! ثبت‌نام شما تکمیل شده است.</span>
                </p>
              </div>
            )}
          </PixelFrame>

          <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
            <h3 className="text-lg sm:text-xl font-bold text-primary-sky mb-4">اعضای تیم</h3>
            <div className="space-y-2 sm:space-y-3">
              {/* Leader */}
              <div className="bg-primary-midnight rounded p-3 sm:p-4 border border-primary-cerulean">
                <div className="flex items-center gap-2">
                  <span className="pixel-btn pixel-btn-primary px-2 py-1 text-xs sm:text-sm whitespace-nowrap">
                    سرتیم
                  </span>
                  <div className="min-w-0 flex-1 text-right">
                    <p className="text-primary-sky font-bold text-sm sm:text-base truncate">
                      {team.leader.first_name} {team.leader.last_name}
                    </p>
                    <p className="text-primary-aero text-xs sm:text-sm truncate">
                      {team.leader.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Members */}
              {members.map((member) => (
                <div
                  key={member.id}
                  className="bg-primary-midnight rounded p-3 sm:p-4 border border-primary-cerulean"
                >
                  <div className="flex items-center gap-2">
                    <div className="min-w-0 flex-1 text-right">
                      <p className="text-primary-sky font-bold text-sm sm:text-base truncate">
                        {member.user.first_name} {member.user.last_name}
                      </p>
                      <p className="text-primary-aero text-xs sm:text-sm truncate">
                        {member.user.email}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!isLeader && (
              <button
                onClick={handleLeaveTeam}
                disabled={loading || team.status === 'attended'}
                className="pixel-btn pixel-btn-danger py-3 px-8 w-full mt-6"
                title={team.status === 'attended' ? 'تیم شرکت کرده قابل ترک نیست' : ''}
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

                <button
                  onClick={() => setShowCreateForm(true)}
                  className="pixel-btn pixel-btn-primary py-3 px-8 w-full"
                >
                  ساخت تیم
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

                {/* Warning about irreversible action */}
                <PixelFrame className="bg-yellow-900 bg-opacity-30 border-yellow-600">
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-400 text-xl flex-shrink-0">⚠️</span>
                    <div className="text-yellow-200 text-sm leading-relaxed">
                      <p className="font-bold mb-2">توجه: این تصمیم برگشت‌پذیر نیست!</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>بعد از ساخت تیم و پرداخت، نمی‌توانید تیم را حذف کنید</li>
                        <li>امکان پیوستن به تیم دیگری وجود نخواهد داشت</li>
                        <li>فقط اعضا می‌توانند از تیم خارج شوند (نه سرتیم)</li>
                      </ul>
                    </div>
                  </div>
                </PixelFrame>

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
                  <label className="block text-primary-sky font-bold mb-2">کد دعوت</label>
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
                    className="w-full pixel-input bg-primary-midnight text-primary-aero border-primary-cerulean p-3 text-center text-xl tracking-widest font-mono"
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

      {/* Edit Team Modal */}
      {showEditModal && team && (
        <PixelModal onClose={() => setShowEditModal(false)}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-primary-sky mb-6 flex items-center gap-2">
              <FaEdit />
              <span>ویرایش تیم</span>
            </h2>

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
                  placeholder="نام تیم"
                  className="w-full pixel-input bg-primary-midnight text-primary-aero border-primary-cerulean p-3"
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

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleUpdateTeam}
                  disabled={!teamName.trim() || loading}
                  className="pixel-btn pixel-btn-success py-3 px-6 flex-1"
                >
                  {loading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setFieldErrors({});
                    setError('');
                  }}
                  className="pixel-btn pixel-btn-danger py-3 px-6"
                  disabled={loading}
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        </PixelModal>
      )}

      {/* Delete Team Modal */}
      {showDeleteModal && team && (
        <PixelModal onClose={() => setShowDeleteModal(false)}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-red-400 mb-6 flex items-center gap-2">
              <FaTrash />
              <span>حذف تیم</span>
            </h2>

            <div className="space-y-4">
              <div className="bg-red-900 bg-opacity-30 border border-red-500 rounded p-4">
                <p className="text-red-300 text-sm">
                  ⚠️ این عملیات برگشت‌پذیر نیست! تیم به طور کامل حذف خواهد شد.
                </p>
              </div>

              <p className="text-primary-aero">
                آیا از حذف تیم <span className="text-white font-bold">{team.name}</span> اطمینان
                دارید؟
              </p>

              <p className="text-yellow-300 text-sm">
                توجه: این گزینه فقط برای تیم‌هایی که هنوز پرداخت نکرده‌اند قابل استفاده است.
              </p>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleDeleteTeam}
                  disabled={loading}
                  className="pixel-btn pixel-btn-danger py-3 px-6 flex-1"
                >
                  {loading ? 'در حال حذف...' : 'بله، حذف کن'}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="pixel-btn pixel-btn-primary py-3 px-6"
                  disabled={loading}
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        </PixelModal>
      )}

      {/* Revoke Invite Code Modal */}
      {showRevokeModal && team && (
        <PixelModal onClose={() => setShowRevokeModal(false)}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center gap-2">
              <span>🔄</span>
              <span>باطل کردن کد دعوت</span>
            </h2>

            <div className="space-y-4">
              <div className="bg-yellow-900 bg-opacity-30 border border-yellow-500 rounded p-4">
                <p className="text-yellow-300 text-sm">
                  ⚠️ کد دعوت فعلی باطل خواهد شد و یک کد جدید ساخته می‌شود
                </p>
              </div>

              <div className="bg-primary-midnight rounded p-4 border border-primary-cerulean">
                <p className="text-primary-aero text-sm mb-2">کد فعلی:</p>
                <p
                  className="text-primary-sky text-xl font-bold tracking-widest text-center font-mono"
                  dir="ltr"
                >
                  {team.invite_code}
                </p>
              </div>

              <p className="text-primary-aero text-sm">
                اگر کد دعوت فعلی به اشتباه منتشر شده یا می‌خواهید دسترسی افراد قبلی را محدود کنید،
                می‌توانید کد را باطل کنید.
              </p>

              <p className="text-red-400 text-sm">
                توجه: افرادی که کد قبلی را دارند، دیگر نمی‌توانند با آن کد به تیم بپیوندند.
              </p>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleRevokeInviteCode}
                  disabled={loading}
                  className="pixel-btn pixel-btn-warning py-3 px-6 flex-1"
                >
                  {loading ? 'در حال ساخت کد جدید...' : 'بله، کد جدید بساز'}
                </button>
                <button
                  onClick={() => setShowRevokeModal(false)}
                  className="pixel-btn pixel-btn-primary py-3 px-6"
                  disabled={loading}
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        </PixelModal>
      )}
    </div>
  );
}
