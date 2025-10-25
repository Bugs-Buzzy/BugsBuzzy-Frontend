import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
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
  const [submission, setSubmission] = useState<InPersonSubmission | null>(null);
  const [submissions, setSubmissions] = useState<InPersonSubmission[]>([]);
  const [submissionContent, setSubmissionContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);

  const now = new Date();
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  const hasStarted = start ? now >= start : false;
  const hasEnded = end ? now >= end : false;
  const canSubmit = isActive && hasStarted && !hasEnded;

  const markdownContent = description || `# ${phaseName}\n\nجزئیات این فاز به‌زودی اعلام خواهد شد.`;

  useEffect(() => {
    loadSubmissions();
  }, [phaseId]);

  const loadSubmissions = async () => {
    try {
      const response = await inpersonService.getSubmissions();
      setSubmissions(response.submissions);

      const currentPhaseSubmission = response.submissions.find((s) => s.phase === phaseId);
      if (currentPhaseSubmission) {
        setSubmission(currentPhaseSubmission);
        setSubmissionContent(currentPhaseSubmission.content);
      }
    } catch (err) {
      console.error('Failed to load submissions:', err);
    }
  };

  const handleSubmit = async () => {
    if (!submissionContent.trim()) {
      setError('لطفاً متن ارسالی را وارد کنید');
      toast.error('لطفاً متن ارسالی را وارد کنید');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const newSubmission = await inpersonService.createSubmission({
        phase: phaseId,
        content: submissionContent,
      });

      setSubmission(newSubmission);
      toast.success(submission ? 'ارسال با موفقیت به‌روزرسانی شد' : 'ارسال با موفقیت ثبت شد');
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
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <PixelFrame className="bg-red-900 bg-opacity-30 border-red-500">
          <p className="text-red-300">{error}</p>
        </PixelFrame>
      )}

      <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{icon}</span>
            <h2 className="text-3xl font-bold text-primary-sky font-pixel">{phaseName}</h2>
          </div>

          {/* Phase Status Badge */}
          {isActive && hasStarted && !hasEnded && (
            <span className="pixel-btn pixel-btn-success px-4 py-2 text-sm animate-pulse">
              🔴 در حال برگزاری
            </span>
          )}

          {hasEnded && (
            <span className="pixel-btn bg-gray-700 text-gray-300 px-4 py-2 text-sm">
              ✓ پایان یافته
            </span>
          )}

          {!hasStarted && start && (
            <span className="pixel-btn pixel-btn-warning px-4 py-2 text-sm">⏰ هنوز شروع نشده</span>
          )}
        </div>

        {description && <p className="text-primary-aero mb-4 text-lg">{description}</p>}

        {/* Countdown to Start */}
        {start && !hasStarted && (
          <div className="mb-6">
            <p className="text-primary-aero text-sm mb-4 text-center">شروع فاز تا:</p>
            <Countdown target={start} />
          </div>
        )}

        {/* Countdown to End (if active) */}
        {canSubmit && end && (
          <div className="mb-6">
            <p className="text-yellow-400 text-sm mb-4 text-center">⏰ زمان باقی‌مانده:</p>
            <Countdown target={end} />
          </div>
        )}

        {/* Markdown Content */}
        <div className="prose prose-invert max-w-none mb-6">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              h1: ({ ...props }) => (
                <h1 className="text-3xl font-bold text-primary-sky mb-4" {...props} />
              ),
              h2: ({ ...props }) => (
                <h2 className="text-2xl font-bold text-primary-sky mb-3 mt-6" {...props} />
              ),
              h3: ({ ...props }) => (
                <h3 className="text-xl font-bold text-primary-aero mb-2 mt-4" {...props} />
              ),
              p: ({ ...props }) => (
                <p className="text-primary-aero mb-3 leading-relaxed" {...props} />
              ),
              ul: ({ ...props }) => (
                <ul className="text-primary-aero list-disc list-inside mb-3 space-y-1" {...props} />
              ),
              ol: ({ ...props }) => (
                <ol
                  className="text-primary-aero list-decimal list-inside mb-3 space-y-1"
                  {...props}
                />
              ),
              li: ({ ...props }) => <li className="text-primary-aero" {...props} />,
              strong: ({ ...props }) => (
                <strong className="text-primary-sky font-bold" {...props} />
              ),
              code: ({ ...props }) => (
                <code
                  className="bg-primary-midnight text-primary-sky px-2 py-1 rounded font-mono text-sm"
                  {...props}
                />
              ),
              pre: ({ ...props }) => (
                <pre
                  className="bg-primary-midnight p-4 rounded border border-primary-cerulean overflow-x-auto mb-4"
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
        <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
          <h3 className="text-2xl font-bold text-primary-sky mb-4 flex items-center gap-2">
            <span>📝</span>
            <span>ارسال کار</span>
          </h3>

          {submission && (
            <div className="bg-green-900 bg-opacity-20 border border-green-600 rounded p-3 mb-4">
              <p className="text-green-300 text-sm flex items-center gap-2">
                <span>✅</span>
                <span>
                  شما قبلاً برای این فاز ارسال کرده‌اید. می‌توانید ارسال خود را به‌روزرسانی کنید.
                </span>
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-primary-sky font-bold mb-2">متن ارسالی *</label>
              <textarea
                value={submissionContent}
                onChange={(e) => setSubmissionContent(e.target.value)}
                placeholder="توضیحات خود را اینجا وارد کنید..."
                className="w-full pixel-input bg-primary-midnight text-primary-aero border-primary-cerulean p-4"
                rows={8}
                disabled={loading}
              />
              <p className="text-xs text-gray-400 mt-1">
                نکات خود درباره این فاز را به تفصیل بنویسید
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={!submissionContent.trim() || loading}
                className="pixel-btn pixel-btn-success py-3 px-6"
              >
                {loading ? 'در حال ارسال...' : submission ? 'به‌روزرسانی ارسال' : 'ارسال کار'}
              </button>

              {submissions.length > 0 && (
                <button
                  onClick={() => setShowSubmissionsModal(true)}
                  className="pixel-btn pixel-btn-primary py-3 px-6"
                >
                  مشاهده ارسال‌های قبلی ({submissions.length})
                </button>
              )}
            </div>
          </div>
        </PixelFrame>
      )}

      {/* Phase Ended Message */}
      {hasEnded && (
        <PixelFrame className="bg-gray-800 bg-opacity-50">
          <p className="text-gray-300 text-center py-4">✓ این فاز پایان یافته است</p>
        </PixelFrame>
      )}

      {/* Not Started Yet */}
      {!hasStarted && start && (
        <PixelFrame className="bg-yellow-900 bg-opacity-30 border-yellow-600">
          <p className="text-yellow-300 text-center py-4">⏰ این فاز هنوز شروع نشده است</p>
        </PixelFrame>
      )}

      {/* Submissions Modal */}
      {showSubmissionsModal && (
        <PixelModal onClose={() => setShowSubmissionsModal(false)}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-primary-sky mb-6">📋 تاریخچه ارسال‌ها</h2>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {submissions.map((sub) => (
                <PixelFrame key={sub.id} className="bg-primary-midnight">
                  <div className="mb-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-primary-sky font-bold">Phase {sub.phase}</span>
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
