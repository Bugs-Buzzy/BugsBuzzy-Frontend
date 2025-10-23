import { useEffect, useState } from 'react';

import PixelFrame from '@/components/PixelFrame';
import type { ApiError } from '@/services/api';
import { paymentsService } from '@/services/payments.service';
import { teamsService, type Team, type TeamMember } from '@/services/teams.service';
import { extractFieldErrors } from '@/utils/errorMessages';
import { paymentStorage, formatPrice } from '@/utils/paymentStorage';

interface GameJamTeamPhaseProps {
  onTeamCreated: () => void;
}

export default function GameJamTeamPhase({ onTeamCreated }: GameJamTeamPhaseProps) {
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Create team form
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Join team form
  const [inviteCode, setInviteCode] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);

  // Payment for create team
  const [teamPrice, setTeamPrice] = useState<number | null>(null);
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [priceLoading, setPriceLoading] = useState(false);

  useEffect(() => {
    loadTeam();
    fetchTeamPrice();
  }, []);

  const loadTeam = async () => {
    setLoading(true);
    try {
      const teamsData = await teamsService.getAllTeams();
      const gameJamTeam = teamsData.teams.find((t) => t.team_type === 'online');

      if (gameJamTeam) {
        setTeam(gameJamTeam);
        const teamMembers = await teamsService.getOnlineTeamMembers(gameJamTeam.id);
        setMembers(teamMembers);
        onTeamCreated();
      }
    } catch (err) {
      console.error('Failed to load team:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamPrice = async () => {
    try {
      const result = await paymentsService.getPrice(['gamejam']);
      setTeamPrice(result.amount);
      setFinalPrice(result.amount);
    } catch (err) {
      console.error('Failed to fetch team price:', err);
    }
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setFieldErrors({ code: 'لطفاً کد تخفیف را وارد کنید' });
      return;
    }

    setPriceLoading(true);
    setError('');
    setFieldErrors({});

    try {
      const result = await paymentsService.applyDiscount(discountCode, ['gamejam']);

      setFinalPrice(result.amount);
      setDiscountApplied(result.discount_applied);
      setDiscountPercentage(result.discount_percentage);

      if (result.discount_applied) {
        setSuccessMessage(`کد تخفیف با موفقیت اعمال شد! (${result.discount_percentage}% تخفیف)`);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err: any) {
      const apiError = err as ApiError;
      const errorMessage =
        apiError.errors?.error || apiError.errors?.detail || apiError.error || apiError.message;

      if (errorMessage) {
        const translatedError = extractFieldErrors({ error: errorMessage }).message;
        setFieldErrors({ code: translatedError });
      } else {
        setFieldErrors({ code: 'خطا در بررسی کد تخفیف' });
      }

      setDiscountApplied(false);
    } finally {
      setPriceLoading(false);
    }
  };

  const handleCreateTeamWithPayment = async () => {
    if (!teamName.trim()) {
      setFieldErrors({ name: 'نام تیم الزامی است' });
      return;
    }

    if (finalPrice === null) {
      setError('لطفاً صبر کنید تا قیمت محاسبه شود');
      return;
    }

    setLoading(true);
    setError('');
    setFieldErrors({});

    try {
      // Store payment context
      paymentStorage.set({
        category: 'gamejam',
        title: 'ثبت‌نام گیم‌جم مجازی',
        description: `ساخت تیم: ${teamName}`,
        items: ['gamejam'],
        amount: finalPrice,
        discount_code: discountCode || undefined,
        returnUrl: '/panel/gamejam',
        metadata: {
          teamName,
          teamDescription,
          action: 'create_team',
        },
      });

      // Initiate payment
      const payment = await paymentsService.createPayment({
        items: ['gamejam'],
        discount_code: discountCode || undefined,
      });

      window.location.href = payment.redirect_url;
    } catch (err) {
      console.error('Payment error:', err);
      const apiError = err as ApiError;
      const { message } = extractFieldErrors(apiError.errors);
      setError(message || 'خطا در ایجاد پرداخت');
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
      const response = await teamsService.joinOnlineTeam({ invite_code: inviteCode });
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
      await teamsService.leaveOnlineTeam(team.id);
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
              <span className="pixel-btn pixel-btn-success px-4 py-2 font-pixel" dir="ltr">
                {team.member_count}/6
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
                این کد را با دوستان خود (حداکثر ۶ نفر) به اشتراک بگذارید
              </p>
            </div>

            <div className="bg-green-900 bg-opacity-30 rounded p-4 border border-green-600">
              <p className="text-green-300 text-sm flex items-center gap-2">
                <span>✅</span>
                <span>تیم شما ثبت شده است. می‌توانید به مراحل بعدی بروید!</span>
              </p>
            </div>
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
        /* Create or Join Team */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {!showCreateForm && !showJoinForm && (
            <>
              {/* Create Team Card */}
              <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
                <h2 className="text-2xl font-bold text-primary-sky mb-4">➕ ساخت تیم جدید</h2>
                <p className="text-primary-aero mb-6">
                  یک تیم جدید بسازید و دوستان خود را دعوت کنید.
                </p>
                <div className="bg-yellow-900 bg-opacity-20 rounded p-3 mb-4 border border-yellow-600">
                  <p className="text-yellow-300 text-sm">
                    💰 برای ساخت تیم باید هزینه ثبت‌نام را پرداخت کنید
                  </p>
                </div>
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
                <div className="bg-green-900 bg-opacity-20 rounded p-3 mb-4 border border-green-600">
                  <p className="text-green-300 text-sm">✅ پیوستن به تیم رایگان است</p>
                </div>
                <button
                  onClick={() => setShowJoinForm(true)}
                  className="pixel-btn pixel-btn-success py-3 px-8 w-full"
                >
                  پیوستن به تیم
                </button>
              </PixelFrame>
            </>
          )}

          {/* Create Form with Payment */}
          {showCreateForm && (
            <PixelFrame className="bg-primary-oxfordblue bg-opacity-90 md:col-span-2">
              <h2 className="text-2xl font-bold text-primary-sky mb-6 flex items-center gap-2">
                <span>➕</span>
                <span>ساخت تیم جدید</span>
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Team Info Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-primary-sky mb-3">اطلاعات تیم</h3>

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
                    <label className="block text-primary-sky font-bold mb-2">
                      توضیحات (اختیاری)
                    </label>
                    <textarea
                      value={teamDescription}
                      onChange={(e) => setTeamDescription(e.target.value)}
                      placeholder="توضیحاتی درباره تیم"
                      className="w-full pixel-input bg-primary-midnight text-primary-aero border-primary-cerulean p-3"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Payment Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-primary-sky mb-3">پرداخت</h3>

                  {/* Discount Code */}
                  <div>
                    <label className="block text-primary-sky font-bold mb-2">
                      کد تخفیف (اختیاری)
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={discountCode}
                          onChange={(e) => {
                            setDiscountCode(e.target.value.toUpperCase());
                            if (discountApplied) {
                              setDiscountApplied(false);
                              setFinalPrice(teamPrice);
                            }
                            if (fieldErrors.code) {
                              const { code: _code, ...rest } = fieldErrors;
                              setFieldErrors(rest);
                            }
                          }}
                          placeholder="کد تخفیف"
                          className={`w-full pixel-input bg-primary-midnight text-primary-aero p-3 ${
                            fieldErrors.code ? 'border-red-500' : 'border-primary-cerulean'
                          }`}
                          maxLength={20}
                          disabled={priceLoading}
                        />
                        {fieldErrors.code && (
                          <p className="text-red-400 text-sm mt-1">{fieldErrors.code}</p>
                        )}
                      </div>
                      <button
                        onClick={handleApplyDiscount}
                        disabled={!discountCode.trim() || priceLoading}
                        className="pixel-btn pixel-btn-success px-6 whitespace-nowrap self-start"
                      >
                        {priceLoading ? '...' : 'اعمال'}
                      </button>
                    </div>
                    {discountApplied && !fieldErrors.code && (
                      <p className="text-green-400 text-sm mt-2">✅ کد تخفیف اعمال شد</p>
                    )}
                  </div>

                  {/* Price Summary */}
                  <div className="bg-primary-midnight rounded p-4 border border-primary-cerulean">
                    <h4 className="text-primary-sky font-bold mb-3">فاکتور:</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-primary-aero">ثبت‌نام گیم‌جم:</span>
                        <span className="font-pixel text-primary-aero" dir="ltr">
                          {teamPrice ? `${formatPrice(teamPrice)} تومان` : '...'}
                        </span>
                      </div>

                      {discountApplied && teamPrice && finalPrice && (
                        <div className="bg-green-900 bg-opacity-20 rounded p-2 border border-green-600">
                          <div className="flex justify-between text-green-400 text-sm">
                            <span>تخفیف ({discountPercentage}%):</span>
                            <span className="font-pixel" dir="ltr">
                              - {formatPrice(teamPrice - finalPrice)} تومان
                            </span>
                          </div>
                        </div>
                      )}

                      <div
                        className={`border-t-2 pt-2 ${discountApplied ? 'border-green-500' : 'border-primary-cerulean'}`}
                      >
                        <div className="flex justify-between items-center">
                          <span
                            className={`font-bold ${discountApplied ? 'text-green-400' : 'text-primary-sky'}`}
                          >
                            مبلغ نهایی:
                          </span>
                          <span
                            className={`font-pixel font-bold text-lg ${
                              discountApplied ? 'text-green-400' : 'text-primary-sky'
                            }`}
                            dir="ltr"
                          >
                            {finalPrice ? `${formatPrice(finalPrice)} تومان` : '...'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleCreateTeamWithPayment}
                  disabled={!teamName.trim() || loading || finalPrice === null}
                  className="pixel-btn pixel-btn-success py-3 px-8 flex-1"
                >
                  {loading ? 'در حال انتقال به پرداخت...' : 'پرداخت و ساخت تیم'}
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
                    {loading ? 'در حال پیوستن...' : 'پیوستن (رایگان)'}
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
