import { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaImage } from 'react-icons/fa';

import PixelModal from '@/components/modals/PixelModal';
import PixelFrame from '@/components/PixelFrame';
import { INPERSON_TEAM_CONFIG } from '@/constants/inperson';
import { useToast } from '@/context/ToastContext';
import type { ApiError } from '@/services/api';
import {
  inpersonService,
  type InPersonTeam,
  type InPersonMember,
} from '@/services/inperson.service';
import { extractFieldErrors, translateError } from '@/utils/errorMessages';
import { ImageProcessor } from '@/utils/imageProcessor';

interface InPersonTeamPhaseProps {
  onTeamComplete?: () => void;
}

export default function InPersonTeamPhase({ onTeamComplete }: InPersonTeamPhaseProps) {
  const [team, setTeam] = useState<InPersonTeam | null>(null);
  const [members, setMembers] = useState<InPersonMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const toast = useToast();

  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [teamAvatar, setTeamAvatar] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDisbandModal, setShowDisbandModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);

  useEffect(() => {
    loadTeam();
  }, []);

  useEffect(() => {
    if (team && (team.status === 'active' || team.status === 'attended') && onTeamComplete) {
      onTeamComplete();
    }
  }, [team, onTeamComplete]);

  const loadTeam = async () => {
    setLoading(true);
    try {
      const response = await inpersonService.getMyTeam();

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
      const newTeam = await inpersonService.createTeam({
        name: teamName,
        description: teamDescription,
      });

      setTeam(newTeam);
      setShowCreateForm(false);
      toast.success('تیم با موفقیت ساخته شد!');
      await loadTeam();
    } catch (err) {
      console.error('Create team error:', err);
      const apiError = err as ApiError;

      // Extract error message (backend returns {error: 'message'} or field errors)
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
      const newTeam = await inpersonService.joinTeam(inviteCode);

      setTeam(newTeam);
      setShowJoinForm(false);
      toast.success('با موفقیت به تیم پیوستید!');
      await loadTeam();
    } catch (err) {
      console.error('Join team error:', err);
      const apiError = err as ApiError;

      // Extract error message (backend returns {error: 'message'} or field errors)
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
      await inpersonService.leaveTeam(team.id);
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
      setTeamAvatar(team.avatar || '');
      setShowEditModal(true);
      setError('');
      setFieldErrors({});
    }
  };

  const handleSelectAvatar = async () => {
    try {
      const result = await ImageProcessor.selectAndProcessAvatar();
      if (result) {
        setTeamAvatar(result.dataUri);
        toast.success('تصویر با موفقیت انتخاب شد');
      }
    } catch (err: any) {
      toast.error(err.message || 'خطا در پردازش تصویر');
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
      const updatedTeam = await inpersonService.updateTeam(team.id, {
        name: teamName,
        description: teamDescription,
        avatar: teamAvatar,
      });

      setTeam(updatedTeam);
      setShowEditModal(false);
      toast.success('اطلاعات تیم با موفقیت به‌روزرسانی شد');
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

  const handleDisbandTeam = async () => {
    if (!team) return;

    setLoading(true);
    setError('');
    try {
      await inpersonService.disbandTeam(team.id);
      setTeam(null);
      setMembers([]);
      setShowDisbandModal(false);
      toast.success('تیم با موفقیت منحل شد');
      await loadTeam();
    } catch (err) {
      console.error('Disband team error:', err);
      const apiError = err as ApiError;

      const rawError = apiError.error || apiError.message || 'خطا در انحلال تیم';
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
      const response = await inpersonService.revokeInviteCode(team.id);
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
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {team.avatar && (
                    <img
                      src={team.avatar}
                      alt={team.name}
                      className="w-16 h-16 rounded border-2 border-primary-cerulean"
                    />
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-primary-sky">{team.name}</h2>
                    {team.description && (
                      <p className="text-primary-aero text-sm">{team.description}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 items-start">
                <span
                  className={`pixel-btn ${
                    team.status === 'active' || team.status === 'attended'
                      ? 'pixel-btn-success'
                      : 'pixel-btn-warning'
                  } px-4 py-2 font-pixel`}
                  dir="ltr"
                >
                  {team.member_count}/{INPERSON_TEAM_CONFIG.MAX_MEMBERS}
                </span>
                {team.is_leader && (
                  <>
                    <button
                      onClick={handleOpenEditModal}
                      className="pixel-btn pixel-btn-primary px-3 py-2 flex items-center gap-2"
                      title="ویرایش تیم"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => setShowDisbandModal(true)}
                      className="pixel-btn pixel-btn-danger px-3 py-2 flex items-center gap-2"
                      title="منحل کردن تیم"
                    >
                      <FaTrash />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="bg-primary-midnight rounded p-4 mb-4 border border-primary-cerulean">
              <div className="flex justify-between items-start mb-2">
                <p className="text-primary-aero">کد دعوت:</p>
                {team.is_leader && (
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
                className="text-primary-sky text-2xl font-bold tracking-widest text-center font-pixel"
                dir="ltr"
              >
                {team.invite_code}
              </p>
              <p className="text-primary-aero text-sm mt-2 text-center">
                این کد را با دوستان خود به اشتراک بگذارید
              </p>
              {team.is_leader && (
                <p className="text-yellow-400 text-xs mt-2 text-center">
                  💡 می‌توانید کد را باطل و یک کد جدید دریافت کنید
                </p>
              )}
            </div>

            {team.status === 'incomplete' && (
              <div className="bg-yellow-900 bg-opacity-30 rounded p-4 mb-4 border border-yellow-700">
                <p className="text-yellow-300 text-sm">
                  ⚠️ تیم شما باید {INPERSON_TEAM_CONFIG.MIN_MEMBERS} نفره باشد تا برای رقابت واجد
                  شرایط شود.
                </p>
              </div>
            )}

            {(team.status === 'active' || team.status === 'attended') && (
              <div className="bg-green-900 bg-opacity-30 rounded p-4 mb-4 border border-green-600">
                <p className="text-green-300 text-sm flex items-center gap-2">
                  <span>✅</span>
                  <span>تیم شما واجد شرایط است! ثبت‌نام شما تکمیل شده است.</span>
                </p>
              </div>
            )}
          </PixelFrame>

          <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
            <h3 className="text-xl font-bold text-primary-sky mb-4">اعضای تیم</h3>
            <div className="space-y-3">
              <div className="bg-primary-midnight rounded p-4 flex items-center justify-between border border-primary-cerulean">
                <div className="flex-1">
                  <p className="text-primary-sky font-bold">
                    {team.leader.first_name} {team.leader.last_name}
                  </p>
                  <p className="text-primary-aero text-sm">{team.leader.email}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="pixel-btn pixel-btn-success px-3 py-1 text-sm">
                    ✅ پرداخت شده
                  </span>
                  <span className="pixel-btn pixel-btn-primary px-3 py-1 text-sm">سرتیم</span>
                </div>
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
                  <span
                    className={`pixel-btn ${
                      member.has_paid ? 'pixel-btn-success' : 'pixel-btn-warning'
                    } px-3 py-1 text-sm`}
                  >
                    {member.has_paid ? '✅ پرداخت شده' : '⏳ در انتظار'}
                  </span>
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

      {/* Edit Team Modal */}
      {showEditModal && team && (
        <PixelModal onClose={() => setShowEditModal(false)}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-primary-sky mb-6 flex items-center gap-2">
              <FaEdit />
              <span>ویرایش تیم</span>
            </h2>

            <div className="space-y-4">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4 mb-4">
                <div className="relative">
                  {teamAvatar ? (
                    <img
                      src={teamAvatar}
                      alt="Team Avatar"
                      className="w-32 h-32 rounded border-4 border-primary-cerulean"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded border-4 border-primary-cerulean bg-primary-midnight flex items-center justify-center">
                      <FaImage className="text-primary-aero text-4xl" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleSelectAvatar}
                  className="pixel-btn pixel-btn-primary px-4 py-2 flex items-center gap-2"
                >
                  <FaImage />
                  <span>{teamAvatar ? 'تغییر تصویر' : 'افزودن تصویر'}</span>
                </button>
                <p className="text-xs text-gray-400">(حداکثر 10MB - تبدیل خودکار به 128×128)</p>
              </div>

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
                  className="text-primary-sky text-xl font-bold tracking-widest text-center font-pixel"
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

      {/* Disband Team Modal */}
      {showDisbandModal && team && (
        <PixelModal onClose={() => setShowDisbandModal(false)}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-red-400 mb-6 flex items-center gap-2">
              <FaTrash />
              <span>منحل کردن تیم</span>
            </h2>

            <div className="space-y-4">
              <div className="bg-red-900 bg-opacity-30 border border-red-500 rounded p-4">
                <p className="text-red-300 text-sm">⚠️ هشدار: این عملیات غیرقابل بازگشت است!</p>
              </div>

              <p className="text-primary-aero">
                آیا از منحل کردن تیم <strong className="text-primary-sky">{team.name}</strong>{' '}
                اطمینان دارید؟
              </p>

              <p className="text-yellow-400 text-sm">
                با منحل شدن تیم، تمام اعضا از تیم خارج خواهند شد و کد دعوت باطل می‌شود.
              </p>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleDisbandTeam}
                  disabled={loading}
                  className="pixel-btn pixel-btn-danger py-3 px-6 flex-1"
                >
                  {loading ? 'در حال انحلال...' : 'بله، تیم را منحل کن'}
                </button>
                <button
                  onClick={() => setShowDisbandModal(false)}
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
