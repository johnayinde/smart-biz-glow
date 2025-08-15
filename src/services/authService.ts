import { apiService } from "./api";

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  data: { user: User; accessToken: string; refreshToken: string };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company_name?: string;
}
const AUTH_URL = "/auth/auth";

class AuthService {
  async login(
    credentials: LoginCredentials
  ): Promise<{ data: AuthResponse | null; error: string | null }> {
    const response = await apiService.post<AuthResponse>(
      `${AUTH_URL}/login`,
      credentials
    );

    if (response.data) {
      apiService.setToken(response.data.data.accessToken);
      localStorage.setItem("access_token", response.data.data.accessToken);
      localStorage.setItem("refresh_token", response.data.data.refreshToken);
    }

    return response;
  }

  async signup(
    credentials: SignupCredentials
  ): Promise<{ data: AuthResponse | null; error: string | null }> {
    const response = await apiService.post<AuthResponse>(
      `${AUTH_URL}/register`,
      credentials
    );

    if (response.data) {
      apiService.setToken(response.data.data.accessToken);
      localStorage.setItem("access_token", response.data.data.accessToken);
      localStorage.setItem("refresh_token", response.data.data.refreshToken);
    }

    return response;
  }

  async logout(): Promise<{ error: string | null }> {
    const refreshToken = localStorage.getItem("refresh_token");

    if (refreshToken) {
      await apiService.post(`${AUTH_URL}/logout`, {
        refresh_token: refreshToken,
      });
    }
    await apiService.post<AuthResponse>(`${AUTH_URL}/logout`);
    apiService.setToken(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    return { error: null };
  }

  async getCurrentUser(): Promise<{ data: User | null; error: string | null }> {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return { data: null, error: "No token found" };
    }

    apiService.setToken(token);
    return apiService.get<User>(`${AUTH_URL}/me`);
  }

  async refreshToken(): Promise<{
    data: AuthResponse | null;
    error: string | null;
  }> {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      return { data: null, error: "No refresh token found" };
    }

    const response = await apiService.post<AuthResponse>(
      `${AUTH_URL}/refresh`,
      {
        refresh_token: refreshToken,
      }
    );

    if (response.data) {
      apiService.setToken(response.data.data.accessToken);
      localStorage.setItem("access_token", response.data.data.accessToken);
      localStorage.setItem("refresh_token", response.data.data.refreshToken);
    }

    return response;
  }

  async resetPassword(email: string): Promise<{ error: string | null }> {
    const response = await apiService.post(`${AUTH_URL}/reset-password`, {
      email,
    });
    return { error: response.error };
  }

  initializeToken() {
    const token = localStorage.getItem("access_token");
    if (token) {
      apiService.setToken(token);
    }
  }
}

export const authService = new AuthService();
