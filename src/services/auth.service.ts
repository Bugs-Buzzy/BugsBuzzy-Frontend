import { apiClient } from './api';

export interface CheckEmailData {
  email: string;
}

export interface CheckEmailResponse {
  exists: boolean;
  has_usable_password: boolean;
}

export interface SendCodeData {
  email: string;
}

export interface SendCodeResponse {
  message: string;
  is_new_user: boolean;
}

export interface VerifyCodeData {
  email: string;
  verification_code: string;
}

export interface VerifyCodeResponse {
  message: string;
  access: string;
  refresh: string;
  user: UserProfile;
  requires_password?: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  access: string;
  refresh: string;
  user: UserProfile;
}

export interface UserProfile {
  email: string;
  first_name: string;
  last_name: string;
  national_code: string;
  phone_number: string;
  gender: 'M' | 'F';
  birth_date: string | null;
  city: string;
  university: string;
  major: string;
  is_verified: boolean;
  status: string;
  has_paid: boolean;
  profile_completed: boolean;
  has_usable_password?: boolean;
  created_at: string;
  last_login: string | null;
  last_login_ip: string | null;
  email_verified_at: string | null;
}

export interface UpdateProfileData {
  first_name: string;
  last_name: string;
  phone_number: string;
  gender: 'M' | 'F';
  national_code: string;
  city?: string;
  university?: string;
  major?: string;
}

export interface ForgotPasswordData {
  email: string;
  verification_code: string;
}

export interface ForgotPasswordResponse {
  message: string;
  access: string;
  refresh: string;
  user: UserProfile;
}

export interface ChangePasswordData {
  current_password?: string;
  new_password: string;
}

export interface TokenRefreshResponse {
  access: string;
}

class AuthService {
  async checkEmail(data: CheckEmailData): Promise<CheckEmailResponse> {
    return apiClient.post<CheckEmailResponse>('/accounts/check-email/', data);
  }

  async sendCode(data: SendCodeData): Promise<SendCodeResponse> {
    return apiClient.post<SendCodeResponse>('/accounts/send-code/', data);
  }

  async verifyCode(data: VerifyCodeData): Promise<VerifyCodeResponse> {
    return apiClient.post<VerifyCodeResponse>('/accounts/verify-code/', data);
  }

  async forgotPassword(data: ForgotPasswordData): Promise<ForgotPasswordResponse> {
    return apiClient.post<ForgotPasswordResponse>('/accounts/forgot-password/', data);
  }

  async login(data: LoginData): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/accounts/login/', data);
  }

  async getProfile(): Promise<UserProfile> {
    return apiClient.get<UserProfile>('/accounts/profile/');
  }

  async updateProfile(data: UpdateProfileData): Promise<{ message: string }> {
    return apiClient.put<{ message: string }>('/accounts/profile/', data);
  }

  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/accounts/change-password/', data);
  }

  async refreshToken(refreshToken: string): Promise<TokenRefreshResponse> {
    return apiClient.post<TokenRefreshResponse>('/accounts/token/refresh/', {
      refresh: refreshToken,
    });
  }

  setTokens(access: string, refresh: string): void {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }

  clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }
}

export const authService = new AuthService();
