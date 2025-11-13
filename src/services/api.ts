import { tokenStorage } from './tokenStorage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

interface ApiError {
  message?: string;
  error?: string;
  detail?: string;
  errors?: Record<string, string[]>;
  status: number;
  code?: string;
  messages?: Array<{ message: string; token_type?: string }>;
}

class ApiClient {
  private baseURL: string;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getHeaders(): Headers {
    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    const token = tokenStorage.getAccessToken();
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  private async refreshToken(): Promise<string | null> {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${this.baseURL}/accounts/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) throw new Error('Refresh failed');

      const data: { access?: string; refresh?: string } = await response.json();

      if (!data.access) {
        throw new Error('Invalid refresh response');
      }

      tokenStorage.setAccessToken(data.access);
      if (data.refresh) {
        tokenStorage.setRefreshToken(data.refresh);
      }

      return data.access;
    } catch (err) {
      console.error('Token refresh failed:', err);
      tokenStorage.clearTokens();
      window.location.href = '/';
      return null;
    }
  }

  private onAccessTokenFetched(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  private addRefreshSubscriber(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback);
  }

  private async handleResponse<T>(response: Response, retried = false): Promise<T> {
    let errorData: any = {};

    if (!response.ok) {
      // Read the response body once
      errorData = await response.json().catch(() => ({}));

      // Handle 401 authentication errors with token refresh
      if (response.status === 401 && !retried) {
        // Check if token expired
        if (errorData.code === 'token_not_valid' || errorData.detail?.includes('expired')) {
          if (this.isRefreshing) {
            // Wait for ongoing refresh
            return new Promise((resolve, reject) => {
              this.addRefreshSubscriber(async (token: string) => {
                try {
                  const newResponse = await fetch(response.url, {
                    method: response.url.includes('?') ? 'GET' : 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    },
                  });
                  resolve(this.handleResponse(newResponse, true));
                } catch (err) {
                  reject(err);
                }
              });
            });
          }

          this.isRefreshing = true;
          const newToken = await this.refreshToken();
          this.isRefreshing = false;

          if (newToken) {
            this.onAccessTokenFetched(newToken);
            // Retry original request with new token
            return this.retryRequest<T>(response, newToken);
          }
        }
      }

      console.error('API Error Response:', {
        status: response.status,
        url: response.url,
        data: errorData,
      });

      // Better error message extraction
      let errorMessage = errorData.message || errorData.detail || errorData.error;

      // Handle nested messages array (JWT errors)
      if (errorData.messages && Array.isArray(errorData.messages)) {
        errorMessage = errorData.messages.map((m: any) => m.message).join(', ');
      }

      // Handle 401 authentication errors
      if (response.status === 401) {
        if (
          errorData.code === 'token_not_valid' ||
          errorMessage?.includes('token') ||
          errorMessage?.includes('expired')
        ) {
          errorMessage = 'نشست شما منقضی شده است. لطفاً دوباره وارد شوید';
        } else if (!errorMessage) {
          errorMessage = 'احراز هویت انجام نشده است. لطفاً وارد شوید';
        }
      }

      // Fallback for empty error messages
      if (!errorMessage) {
        errorMessage =
          response.status === 500
            ? 'خطای سرور. لطفاً بعداً تلاش کنید'
            : response.status === 403
              ? 'شما مجوز انجام این عملیات را ندارید'
              : 'خطا در ارتباط با سرور';
      }

      throw {
        message: errorMessage,
        error: errorMessage,
        detail: errorData.detail,
        errors: errorData,
        status: response.status,
        code: errorData.code,
        messages: errorData.messages,
      } as ApiError;
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  private async retryRequest<T>(originalResponse: Response, token: string): Promise<T> {
    const url = new URL(originalResponse.url);
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return this.handleResponse<T>(response, true);
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export type { ApiError };
