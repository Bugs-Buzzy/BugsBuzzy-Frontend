import { apiClient } from './api';

export interface InPersonTeam {
  id: number;
  name: string;
  description: string;
  avatar: string;
  status: 'incomplete' | 'active' | 'attended' | 'disbanded';
  invite_code: string;
  leader: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  members: InPersonMember[];
  member_count: number;
  is_leader: boolean;
  created_at: string;
}

export interface InPersonMember {
  id: number;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  has_paid: boolean;
  joined_at: string;
}

export interface CompetitionPhase {
  id: number;
  active: boolean;
  title: string;
  description: string;
  start: string | null;
  end: string | null;
}

export interface CompetitionStatus {
  phases: CompetitionPhase[];
}

export interface InPersonSubmission {
  id: number;
  team: InPersonTeam;
  phase: number;
  title: string;
  description: string;
  file: string | null;
  game_url: string;
  score: number | null;
  judge_notes: string;
  submitted_at: string;
  updated_at: string;
}

class InPersonService {
  // Competition status
  async getCompetitionStatus(): Promise<CompetitionStatus> {
    return apiClient.get<CompetitionStatus>('/inperson/status/');
  }

  // Team management
  async getMyTeam(): Promise<{ team: InPersonTeam | null }> {
    return apiClient.get<{ team: InPersonTeam | null }>('/inperson/my-team/');
  }

  async createTeam(data: {
    name: string;
    description?: string;
    avatar?: string;
  }): Promise<InPersonTeam> {
    return apiClient.post<InPersonTeam>('/inperson/team/create/', data);
  }

  async joinTeam(inviteCode: string): Promise<InPersonTeam> {
    return apiClient.post<InPersonTeam>('/inperson/team/join/', {
      invite_code: inviteCode,
    });
  }

  async leaveTeam(teamId: number): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/inperson/team/${teamId}/leave/`);
  }

  async disbandTeam(teamId: number): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/inperson/team/${teamId}/disband/`);
  }

  async revokeInviteCode(teamId: number): Promise<{
    message: string;
    new_invite_code: string;
    team: InPersonTeam;
  }> {
    return apiClient.delete<{ message: string; new_invite_code: string; team: InPersonTeam }>(
      `/inperson/team/${teamId}/invite-code/`,
    );
  }

  async updateTeam(
    teamId: number,
    data: { name?: string; description?: string; avatar?: string },
  ): Promise<InPersonTeam> {
    return apiClient.put<InPersonTeam>(`/inperson/team/${teamId}/update/`, data);
  }

  async getTeamMembers(teamId: number): Promise<InPersonMember[]> {
    return apiClient.get<InPersonMember[]>(`/inperson/team/${teamId}/members/`);
  }

  // Submissions
  async createSubmission(data: { phase: number; content: string }): Promise<InPersonSubmission> {
    return apiClient.post<InPersonSubmission>('/inperson/submission/create/', data);
  }

  async getSubmissions(): Promise<{ submissions: InPersonSubmission[] }> {
    return apiClient.get<{ submissions: InPersonSubmission[] }>('/inperson/submissions/');
  }
}

export const inpersonService = new InPersonService();
