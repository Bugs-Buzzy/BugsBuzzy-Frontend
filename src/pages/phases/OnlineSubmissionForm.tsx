import React, { useEffect, useState } from 'react';
import { FaGamepad, FaUpload } from 'react-icons/fa';

import Loading from '@/components/Loading';
import PixelFrame from '@/components/PixelFrame';
import { useToast } from '@/context/ToastContext';
import type { ApiError } from '@/services/api';
import {
  gamejamService,
  type OnlineCompetition,
  type OnlineSubmission,
} from '@/services/gamejam.service';
import { extractFieldErrors, translateError } from '@/utils/errorMessages';

interface OnlineSubmissionFormProps {
  competition: OnlineCompetition;
}

export default function OnlineSubmissionForm({ competition }: OnlineSubmissionFormProps) {
  const [submission, setSubmission] = useState<OnlineSubmission | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [gameUrl, setGameUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const response = await gamejamService.getSubmissions();
      if (response.submissions && response.submissions.length > 0) {
        const existingSubmission = response.submissions[0];
        setSubmission(existingSubmission);
        setTitle(existingSubmission.title);
        setDescription(existingSubmission.description);
        setGameUrl(existingSubmission.game_url);
      }
    } catch (err) {
      console.error('Failed to load submissions:', err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setFieldErrors({ title: 'عنوان بازی الزامی است' });
      return;
    }

    if (!gameUrl.trim()) {
      setFieldErrors({ game_url: 'لینک بازی الزامی است' });
      return;
    }

    setLoading(true);
    setError('');
    setFieldErrors({});

    try {
      const submissionData: {
        title: string;
        description: string;
        game_url: string;
        file?: File;
      } = {
        title,
        description,
        game_url: gameUrl,
      };

      if (file) {
        submissionData.file = file;
      }

      const newSubmission = await gamejamService.createSubmission(submissionData);
      setSubmission(newSubmission);
      toast.success('بازی شما با موفقیت ارسال شد!');
      await loadSubmissions();
    } catch (err) {
      console.error('Submit error:', err);
      const apiError = err as ApiError;

      const rawError = apiError.error || apiError.message || 'خطا در ارسال بازی';
      const errorMessage = translateError(rawError);
      const { fieldErrors, message } = extractFieldErrors(apiError.errors);

      setFieldErrors(fieldErrors);
      setError(message || errorMessage);
      toast.error(message || errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loadingSubmissions) {
    return (
      <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
        <div className="py-8">
          <Loading text="در حال بارگذاری..." />
        </div>
      </PixelFrame>
    );
  }

  if (!competition.phase_active) {
    return (
      <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">⏳ مرحله ارسال بازی فعال نیست</h2>
          <p className="text-primary-aero">
            مرحله ارسال بازی هنوز شروع نشده یا به پایان رسیده است. لطفاً بعداً بررسی کنید.
          </p>
        </div>
      </PixelFrame>
    );
  }

  if (submission) {
    return (
      <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-primary-sky mb-4 flex items-center gap-2">
            <FaGamepad />
            <span>بازی ارسال شده</span>
          </h2>

          <div className="bg-green-900 bg-opacity-30 rounded p-4 border border-green-600">
            <p className="text-green-300 text-sm">✅ بازی شما با موفقیت ارسال شده است!</p>
          </div>

          <div className="space-y-3">
            <div className="bg-primary-midnight rounded p-4 border border-primary-cerulean">
              <p className="text-primary-aero text-sm mb-1">عنوان بازی:</p>
              <p className="text-primary-sky font-bold">{submission.title}</p>
            </div>

            <div className="bg-primary-midnight rounded p-4 border border-primary-cerulean">
              <p className="text-primary-aero text-sm mb-1">توضیحات:</p>
              <p className="text-primary-sky">{submission.description}</p>
            </div>

            <div className="bg-primary-midnight rounded p-4 border border-primary-cerulean">
              <p className="text-primary-aero text-sm mb-1">لینک بازی:</p>
              <a
                href={submission.game_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-cerulean hover:text-primary-sky underline break-all"
              >
                {submission.game_url}
              </a>
            </div>

            {submission.file && (
              <div className="bg-primary-midnight rounded p-4 border border-primary-cerulean">
                <p className="text-primary-aero text-sm mb-1">فایل ضمیمه:</p>
                <a
                  href={submission.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-cerulean hover:text-primary-sky underline"
                >
                  مشاهده فایل
                </a>
              </div>
            )}

            {submission.score !== null && (
              <div className="bg-primary-midnight rounded p-4 border border-primary-cerulean">
                <p className="text-primary-aero text-sm mb-1">امتیاز:</p>
                <p className="text-primary-sky font-bold text-xl">{submission.score}</p>
              </div>
            )}

            {submission.judge_notes && (
              <div className="bg-primary-midnight rounded p-4 border border-primary-cerulean">
                <p className="text-primary-aero text-sm mb-1">نظر داوران:</p>
                <p className="text-primary-sky">{submission.judge_notes}</p>
              </div>
            )}
          </div>

          <div className="text-sm text-primary-aero mt-4">
            <p>تاریخ ارسال: {new Date(submission.submitted_at).toLocaleString('fa-IR')}</p>
            {submission.updated_at !== submission.submitted_at && (
              <p>آخرین ویرایش: {new Date(submission.updated_at).toLocaleString('fa-IR')}</p>
            )}
          </div>
        </div>
      </PixelFrame>
    );
  }

  return (
    <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-primary-sky mb-4 flex items-center gap-2">
          <FaGamepad />
          <span>ارسال بازی</span>
        </h2>

        {error && (
          <div className="bg-red-900 bg-opacity-30 border border-red-500 rounded p-4">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-primary-sky font-bold mb-2">
            عنوان بازی <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (fieldErrors.title) {
                const { title: _title, ...rest } = fieldErrors;
                setFieldErrors(rest);
              }
            }}
            placeholder="عنوان بازی خود را وارد کنید"
            className="w-full pixel-input bg-primary-midnight text-primary-aero border-primary-cerulean p-3"
            required
          />
          {fieldErrors.title && <p className="text-red-400 text-sm mt-1">{fieldErrors.title}</p>}
        </div>

        <div>
          <label className="block text-primary-sky font-bold mb-2">توضیحات</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="توضیحاتی درباره بازی"
            className="w-full pixel-input bg-primary-midnight text-primary-aero border-primary-cerulean p-3"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-primary-sky font-bold mb-2">
            لینک بازی <span className="text-red-400">*</span>
          </label>
          <input
            type="url"
            value={gameUrl}
            onChange={(e) => {
              setGameUrl(e.target.value);
              if (fieldErrors.game_url) {
                const { game_url: _gameUrl, ...rest } = fieldErrors;
                setFieldErrors(rest);
              }
            }}
            placeholder="https://example.com/your-game"
            className="w-full pixel-input bg-primary-midnight text-primary-aero border-primary-cerulean p-3"
            dir="ltr"
            required
          />
          {fieldErrors.game_url && (
            <p className="text-red-400 text-sm mt-1">{fieldErrors.game_url}</p>
          )}
          <p className="text-primary-aero text-xs mt-1">
            لینک بازی در پلتفرم‌هایی مانند itch.io، GitHub Pages و ...
          </p>
        </div>

        <div>
          <label className="block text-primary-sky font-bold mb-2">فایل (اختیاری)</label>
          <div className="flex items-center gap-3">
            <label className="pixel-btn pixel-btn-primary px-4 py-2 cursor-pointer flex items-center gap-2">
              <FaUpload />
              <span>{file ? 'تغییر فایل' : 'انتخاب فایل'}</span>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".zip,.rar,.7z,.pdf"
              />
            </label>
            {file && <span className="text-primary-aero text-sm truncate flex-1">{file.name}</span>}
          </div>
          <p className="text-primary-aero text-xs mt-1">
            فایل‌های مجاز: ZIP, RAR, 7Z, PDF (حداکثر 50MB)
          </p>
        </div>

        <button
          type="submit"
          disabled={!title.trim() || !gameUrl.trim() || loading}
          className="pixel-btn pixel-btn-success py-3 px-8 w-full"
        >
          {loading ? 'در حال ارسال...' : 'ارسال بازی'}
        </button>
      </form>
    </PixelFrame>
  );
}
