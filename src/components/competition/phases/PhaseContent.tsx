import { useEffect, useState } from 'react';
import { FaCheckCircle, FaCheck } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';

import { Countdown } from '@/components/Countdown';
import PixelModal from '@/components/modals/PixelModal';
import PixelFrame from '@/components/PixelFrame';
import { useToast } from '@/context/ToastContext';
import type { ApiError } from '@/services/api';
import { inpersonService, type InPersonSubmission } from '@/services/inperson.service';
import { extractFieldErrors, translateError } from '@/utils/errorMessages';

interface PhaseContentProps {
  phaseNumber: number;
  phaseName: string;
  phaseId: number;
  startDate?: string | null;
  endDate?: string | null;
  description?: string;
  icon?: string;
  isActive?: boolean;
}

export default function PhaseContent({
  phaseNumber: _phaseNumber,
  phaseName,
  phaseId,
  startDate,
  endDate,
  description,
  icon = '🎯',
  isActive = false,
}: PhaseContentProps) {
  const toast = useToast();
  const [submissions, setSubmissions] = useState<InPersonSubmission[]>([]);
  const [currentSub, setCurrentSub] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);

  const now = new Date();
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  const hasStarted = start ? now >= start : false;
  const hasEnded = end ? now >= end : false;
  const canSubmit = phaseId != 1 && isActive && hasStarted && !hasEnded;

  const markdownContent = description || `# ${phaseName}\n\nجزئیات این فاز به‌زودی اعلام خواهد شد.`;

  useEffect(() => {
    loadSubmissions();
  }, [phaseId]);

  const loadSubmissions = async () => {
    try {
      const response = await inpersonService.getSubmissions();
      const currentPhaseSubmissions = response.submissions.filter((s) => s.phase === phaseId);
      setSubmissions(currentPhaseSubmissions);
    } catch (err) {
      console.error('Failed to load submissions:', err);
    }
  };

  const handleSubmit = async () => {
    if (currentSub.trim() == '') {
      setError('لطفاً متن ارسالی را وارد کنید');
      toast.error('لطفاً متن ارسالی را وارد کنید');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await inpersonService.createSubmission({
        phase: phaseId,
        content: currentSub.trim() || '',
      });

      toast.success(
        submissions.length > 0 ? 'ارسال با موفقیت به‌روزرسانی شد' : 'ارسال با موفقیت ثبت شد',
      );
      await loadSubmissions();
    } catch (err) {
      console.error('Submission error:', err);
      const apiError = err as ApiError;

      const rawError = apiError.error || apiError.message || 'خطا در ارسال';
      const errorMessage = translateError(rawError);
      const { message } = extractFieldErrors(apiError.errors);

      setError(message || errorMessage);
      toast.error(message || errorMessage);
    } finally {
      setLoading(false);
      setCurrentSub('');
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <PixelFrame className="bg-red-900/70 border border-red-500/60 rounded-2xl" padding={14}>
          <p className="text-red-300">{error}</p>
        </PixelFrame>
      )}

      <PixelFrame
        className="bg-primary-oxfordblue/95 border border-primary-cerulean/25 rounded-[22px] shadow-[0_18px_40px_rgba(8,24,48,0.45)] backdrop-blur-sm"
        padding="18px 22px"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
          <div className="flex items-center gap-3">
            <span className="text-4xl md:text-5xl drop-shadow-sm">{icon}</span>
            <div>
              <h2 className="text-3xl md:text-[34px] font-bold text-primary-columbia font-pixel tracking-wide">
                {phaseName}
              </h2>
              {!description && (
                <p className="text-sm text-primary-nonphoto/80 font-normal md:mt-1">
                  برنامهٔ این فاز را در ادامه دنبال کنید
                </p>
              )}
            </div>
          </div>

          {/* Phase Status Badge */}
          {isActive && hasStarted && !hasEnded && (
            <span className="pixel-btn pixel-btn-success px-4 py-2 text-xs md:text-sm animate-pulse">
              🔴 در حال برگزاری
            </span>
          )}

          {hasEnded && (
            <span className="pixel-btn bg-gray-700/80 text-gray-300 px-4 py-2 text-xs md:text-sm flex items-center gap-1">
              <FaCheck />
              پایان یافته
            </span>
          )}

          {!hasStarted && start && (
            <span className="pixel-btn pixel-btn-warning px-4 py-2 text-xs md:text-sm">
              ⏰ هنوز شروع نشده
            </span>
          )}
        </div>

        {/* Countdown to Start */}
        {start && !hasStarted && (
          <div className="mb-5">
            <p className="text-primary-columbia text-sm mb-3 text-center">شروع فاز تا:</p>
            <Countdown target={start} />
          </div>
        )}

        {/* Countdown to End (if active) */}
        {canSubmit && end && (
          <div className="mb-5">
            <p className="text-yellow-300 text-sm mb-3 text-center">⏰ زمان باقی‌مانده:</p>
            <Countdown target={end} />
          </div>
        )}

        {/* Markdown Content */}
        <div className="prose prose-invert max-w-none mb-4">
          <ReactMarkdown
            skipHtml={false}
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeRaw, rehypeKatex]}
            components={{
              h1: ({ ...props }) => (
                <h1 className="text-3xl font-bold text-white mb-4" {...props} />
              ),
              h2: ({ ...props }) => (
                <h2 className="text-2xl font-bold text-white mb-3 mt-6" {...props} />
              ),
              h3: ({ ...props }) => (
                <h3 className="text-xl font-semibold text-white mb-2 mt-4" {...props} />
              ),
              p: ({ ...props }) => <p className="text-white/95 leading-relaxed mb-3" {...props} />,
              ul: ({ ...props }) => (
                <ul className="text-white/90 list-disc list-inside mb-3 space-y-1" {...props} />
              ),
              ol: ({ ...props }) => (
                <ol className="text-white/90 list-decimal list-inside mb-3 space-y-1" {...props} />
              ),
              li: ({ ...props }) => <li className="text-white/90" {...props} />,
              strong: ({ ...props }) => (
                <strong className="text-primary-columbia font-bold" {...props} />
              ),
              code: ({ ...props }) => (
                <code
                  className="bg-primary-midnight/80 text-primary-columbia px-2 py-1 rounded font-mono text-sm"
                  {...props}
                />
              ),
              pre: ({ ...props }) => (
                <pre
                  className="bg-primary-midnight/80 p-4 rounded-lg border border-primary-cerulean/40 overflow-x-auto mb-4"
                  {...props}
                />
              ),
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        </div>
      </PixelFrame>

      {/* Submission Form */}
      {canSubmit && (
        <PixelFrame
          className="bg-primary-oxfordblue/95 border border-primary-cerulean/25 rounded-[22px] shadow-[0_18px_40px_rgba(8,24,48,0.45)] backdrop-blur-sm"
          padding="18px 22px"
        >
          <h3 className="text-2xl font-bold text-primary-columbia mb-4 flex items-center gap-2">
            <span>📝</span>
            <span>ارسال</span>
          </h3>

          {submissions.length > 0 && (
            <div className="bg-green-900 bg-opacity-20 border border-green-600 rounded p-3 mb-4">
              <p className="text-green-300 text-sm flex items-center gap-2">
                <FaCheckCircle className="text-lg" />
                <span>
                  شما قبلاً برای این فاز ارسال کرده‌اید. در صورت ارسال مجدد، آخرین ارسال به‌عنوان
                  ارسال نهایی در نظر گرفته می‌شود.
                </span>
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-white font-bold text-sm">متن ارسال</label>
              <textarea
                value={currentSub}
                onChange={(e) => setCurrentSub(e.currentTarget.value)}
                placeholder="متن ارسالی خود را اینجا وارد کنید..."
                className="w-full pixel-input bg-primary-midnight/80 text-white/90 border-primary-cerulean/60 focus:border-primary-columbia focus:ring-2 focus:ring-primary-columbia/40 transition-all"
                rows={7}
                disabled={loading}
              />
              <p className="text-xs text-gray-400 mt-1">
                بر اساس توضیحات ارائه شده، و در قالب اعلام شده، متن ارسالی خود برای این فاز را در
                کادر فوق وارد نمائید. دقت کنید که مسئولیت ارسال متن خارج از قالب تعیین شده با خود
                تیم می‌باشد.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSubmit}
                disabled={currentSub.trim() == '' || loading}
                className="pixel-btn pixel-btn-success py-3 px-6 disabled:opacity-60"
              >
                {loading
                  ? 'در حال ارسال...'
                  : submissions.length > 0
                    ? 'به‌روزرسانی ارسال'
                    : 'ارسال کار'}
              </button>

              {submissions.length > 0 && (
                <button
                  onClick={() => setShowSubmissionsModal(true)}
                  className="pixel-btn pixel-btn-primary py-3 px-6"
                >
                  مشاهده ارسال‌های نهایی فازها ({submissions.length})
                </button>
              )}
            </div>
          </div>
        </PixelFrame>
      )}

      {/* Phase Ended Message */}
      {hasEnded && (
        <PixelFrame className="bg-gray-800/70 border border-gray-600/40 rounded-2xl" padding={14}>
          <p className="text-gray-200 text-center py-2 flex items-center justify-center gap-2 text-sm">
            <FaCheck />
            این فاز پایان یافته است
          </p>
        </PixelFrame>
      )}

      {/* Not Started Yet */}
      {!hasStarted && start && (
        <PixelFrame
          className="bg-yellow-900/40 border border-yellow-600/60 rounded-2xl"
          padding={14}
        >
          <p className="text-yellow-200 text-center py-2 text-sm">⏰ این فاز هنوز شروع نشده است</p>
        </PixelFrame>
      )}

      {/* Submissions Modal */}
      {showSubmissionsModal && (
        <PixelModal onClose={() => setShowSubmissionsModal(false)}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-primary-columbia mb-6">📋 تاریخچه ارسال‌ها</h2>

            <div className="space-y-4 max-h-[60vh]">
              {submissions.map((sub) => (
                <PixelFrame
                  key={sub.id}
                  className="bg-primary-midnight/85 border border-primary-cerulean/30 rounded-2xl"
                  padding="16px 20px"
                >
                  <div className="mb-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-primary-sky font-bold">Phase {sub.phase}</span>
                      {sub.is_final && (
                        <span className="ml-2 inline-block text-xs bg-green-700 text-green-100 px-2 py-0.5 rounded">
                          FINAL
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        {new Date(sub.submitted_at).toLocaleString('fa-IR')}
                      </span>
                    </div>
                    {sub.score && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-primary-aero text-sm">امتیاز:</span>
                        <span
                          className={`font-bold ${
                            sub.score >= 70
                              ? 'text-green-400'
                              : sub.score >= 50
                                ? 'text-yellow-400'
                                : 'text-red-400'
                          }`}
                        >
                          {sub.score}/100
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="bg-primary-oxfordblue rounded p-3 border border-primary-cerulean">
                    <p className="text-primary-aero text-sm whitespace-pre-wrap">{sub.content}</p>
                  </div>
                  {sub.judge_notes && (
                    <div className="mt-3 bg-blue-900 bg-opacity-30 rounded p-3 border border-blue-500">
                      <p className="text-blue-300 text-xs font-bold mb-1">نظر داوران:</p>
                      <p className="text-blue-200 text-sm whitespace-pre-wrap">{sub.judge_notes}</p>
                    </div>
                  )}
                </PixelFrame>
              ))}
            </div>
          </div>
        </PixelModal>
      )}
    </div>
  );
}
