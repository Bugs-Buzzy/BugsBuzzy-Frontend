import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Announcements from '../Announcements';

import { announcementService } from '@/services/announcement.service';

vi.mock('@/services/announcement.service', () => ({
  announcementService: {
    getMyAnnouncements: vi.fn(),
  },
}));

const announcementsMock = () => vi.mocked(announcementService.getMyAnnouncements);

describe('Announcements page', () => {
  beforeEach(() => {
    announcementsMock().mockReset();
  });

  it('renders announcements returned from the API', async () => {
    announcementsMock().mockResolvedValueOnce([
      {
        id: 1,
        created_at: '2024-09-01T08:00:00Z',
        announcement: {
          id: 11,
          title: 'اطلاعیه مهم',
          description: 'متن تست برای اطلاعیه مهم',
          created_at: '2024-09-01T08:00:00Z',
        },
      },
    ]);

    render(<Announcements />);

    expect(await screen.findByText('اطلاعیه مهم')).toBeInTheDocument();
    expect(screen.getByText('متن تست برای اطلاعیه مهم')).toBeInTheDocument();
    expect(announcementsMock()).toHaveBeenCalledTimes(1);
  });

  it('renders empty state when there are no announcements', async () => {
    announcementsMock().mockResolvedValueOnce([]);

    render(<Announcements />);

    await waitFor(() =>
      expect(
        screen.getByText(
          /هنوز اطلاعیه‌ای برای شما ثبت نشده است. به محض انتشار، در اینجا نمایش داده خواهد شد./,
        ),
      ).toBeInTheDocument(),
    );
  });

  it('renders error state when the API call fails', async () => {
    announcementsMock().mockRejectedValueOnce({ message: 'خطا در دریافت' });

    render(<Announcements />);

    await waitFor(() => expect(screen.getByText('خطا در دریافت')).toBeInTheDocument());
  });
});
