import { apiClient } from './api';

export interface Announcement {
  id: number;
  title: string;
  description: string | null;
  created_at: string;
}

export interface UserAnnouncement {
  id: number;
  announcement: Announcement;
  created_at: string;
}

class AnnouncementService {
  async getMyAnnouncements(): Promise<UserAnnouncement[]> {
    return apiClient.get<UserAnnouncement[]>('/announcement/my/');
  }
}

export const announcementService = new AnnouncementService();
