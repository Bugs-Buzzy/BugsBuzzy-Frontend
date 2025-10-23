import { apiClient } from './api';

export interface Team {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'disbanded';
  invite_code: string;
  leader: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  created_at: string;
  updated_at: string;
  team_type: 'in_person' | 'online';
  member_count: number;
  is_leader: boolean;
  payment_status?: {
    is_paid: boolean;
    payment_type: 'individual' | 'team';
    total_members?: number;
    paid_members?: number;
    unpaid_members?: number;
    payment_completed_by?: string;
    payment_completed_at?: string;
  };
}

export interface TeamMember {
  id: number;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  is_paid: boolean;
  payment_completed_at: string | null;
  joined_at: string;
}

export interface CreateTeamData {
  name: string;
  description?: string;
}

export interface JoinTeamData {
  invite_code: string;
}

export interface AllTeamsResponse {
  teams: Team[];
  total_count: number;
  in_person_count: number;
  online_count: number;
  in_person_ids: number[];
  online_ids: number[];
  in_person_names: string[];
  online_names: string[];
}

class TeamsService {
  async getAllTeams(): Promise<AllTeamsResponse> {
    return apiClient.get<AllTeamsResponse>('/teams/all/');
  }

  async createInPersonTeam(data: CreateTeamData): Promise<{ message: string; team: Team }> {
    return apiClient.post<{ message: string; team: Team }>('/teams/in-person/create/', data);
  }

  async createOnlineTeam(data: CreateTeamData): Promise<{ message: string; team: Team }> {
    return apiClient.post<{ message: string; team: Team }>('/teams/online/create/', data);
  }

  async joinInPersonTeam(data: JoinTeamData): Promise<{ message: string; team: Team }> {
    return apiClient.post<{ message: string; team: Team }>('/teams/in-person/join/', data);
  }

  async joinOnlineTeam(data: JoinTeamData): Promise<{ message: string; team: Team }> {
    return apiClient.post<{ message: string; team: Team }>('/teams/online/join/', data);
  }

  async leaveInPersonTeam(teamId: number): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/teams/in-person/${teamId}/leave/`);
  }

  async leaveOnlineTeam(teamId: number): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/teams/online/${teamId}/leave/`);
  }

  async getInPersonTeamDetails(teamId: number): Promise<Team> {
    return apiClient.get<Team>(`/teams/in-person/${teamId}/`);
  }

  async getOnlineTeamDetails(teamId: number): Promise<Team> {
    return apiClient.get<Team>(`/teams/online/${teamId}/`);
  }

  async getInPersonTeamMembers(teamId: number): Promise<TeamMember[]> {
    return apiClient.get<TeamMember[]>(`/teams/in-person/${teamId}/members/`);
  }

  async getOnlineTeamMembers(teamId: number): Promise<TeamMember[]> {
    return apiClient.get<TeamMember[]>(`/teams/online/${teamId}/members/`);
  }
}

export const teamsService = new TeamsService();
