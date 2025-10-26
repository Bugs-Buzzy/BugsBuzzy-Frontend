import { apiClient } from './api';

export interface Workshop {
  id: number;
  title: string;
  description: string | null;
  start_datetime: string;
  duration: number;
  presenter: string | null;
  presenter_image: string | null;
  vc_link: string | null;
  place: string | null;
  record_link: string | null;
}

class WorkshopService {
  async getWorkshops(): Promise<Workshop[]> {
    return apiClient.get<Workshop[]>('/workshops/');
  }
}

export const workshopService = new WorkshopService();
