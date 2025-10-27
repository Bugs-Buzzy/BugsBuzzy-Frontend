import { apiClient } from './api';

export interface OnlineTeamMember {
  id: number;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  joined_at: string;
}

export interface OnlineTeam {
  id: number;
  name: string;
  description: string | null;
  avatar: string;
  status: 'inactive' | 'active' | 'completed' | 'attended';
  leader: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  invite_code: string | null;
  members: OnlineTeamMember[];
  member_count: number;
  created_at: string;
}

export interface OnlineCompetition {
  phase_active: boolean;
  title: string;
  description: string | null;
  start: string | null;
  end: string | null;
}

export interface OnlineSubmission {
  id: number;
  team: OnlineTeam;
  title: string;
  description: string;
  file: string | null;
  game_url: string;
  score: number | null;
  judge_notes: string;
  submitted_at: string;
  updated_at: string;
}

class GameJamService {
  async getMyTeam(): Promise<{ team: OnlineTeam | null }> {
    return apiClient.get<{ team: OnlineTeam | null }>('/gamejam/my-team/');
  }

  async createTeam(data: {
    name: string;
    description?: string;
    avatar?: string;
  }): Promise<OnlineTeam> {
    return apiClient.post<OnlineTeam>('/gamejam/create/', data);
  }

  async joinTeam(inviteCode: string): Promise<OnlineTeam> {
    return apiClient.post<OnlineTeam>('/gamejam/join/', { invite_code: inviteCode });
  }

  async leaveTeam(teamId: number): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/gamejam/${teamId}/leave/`);
  }

  async deleteTeam(teamId: number): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/gamejam/${teamId}/delete/`);
  }

  async updateTeam(
    teamId: number,
    data: { name: string; description?: string; avatar?: string },
  ): Promise<OnlineTeam> {
    return apiClient.put<OnlineTeam>(`/gamejam/${teamId}/update/`, data);
  }

  async revokeInviteCode(teamId: number): Promise<{ team: OnlineTeam; new_invite_code: string }> {
    return apiClient.post<{ team: OnlineTeam; new_invite_code: string }>(
      `/gamejam/${teamId}/revoke-invite/`,
    );
  }

  async activateTeam(teamId: number): Promise<OnlineTeam> {
    return apiClient.post<OnlineTeam>(`/gamejam/${teamId}/activate/`);
  }

  async getCompetitionStatus(): Promise<OnlineCompetition> {
    return apiClient.get<OnlineCompetition>('/gamejam/competition/status/');
  }

  async createSubmission(data: {
    title: string;
    description: string;
    game_url: string;
    file?: File;
  }): Promise<OnlineSubmission> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('game_url', data.game_url);
    if (data.file) {
      formData.append('file', data.file);
    }

    return apiClient.post<OnlineSubmission>('/gamejam/competition/submission/', formData);
  }

  async getSubmissions(): Promise<{ submissions: OnlineSubmission[] }> {
    return apiClient.get<{ submissions: OnlineSubmission[] }>('/gamejam/competition/submissions/');
  }
}

export const gamejamService = new GameJamService();
