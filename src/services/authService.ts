import { apiService } from "./api";

export interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  full_name: string;
  company_name?: string;
}

class AuthService {
  async login(
    credentials: LoginCredentials
  ): Promise<{ data: AuthResponse | null; error: string | null }> {
    const response = await apiService.post<AuthResponse>(
      "/auth/auth/login",
      credentials
    );

    if (response.data) {
      apiService.setToken(response.data.access_token);
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
    }

    return response;
  }

  async signup(
    credentials: SignupCredentials
  ): Promise<{ data: AuthResponse | null; error: string | null }> {
    const response = await apiService.post<AuthResponse>(
      "/auth/signup",
      credentials
    );

    if (response.data) {
      apiService.setToken(response.data.access_token);
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
    }

    return response;
  }

  async logout(): Promise<{ error: string | null }> {
    const refreshToken = localStorage.getItem("refresh_token");

    if (refreshToken) {
      await apiService.post("/auth/logout", { refresh_token: refreshToken });
    }

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
    return apiService.get<User>("/auth/me");
  }

  async refreshToken(): Promise<{
    data: AuthResponse | null;
    error: string | null;
  }> {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      return { data: null, error: "No refresh token found" };
    }

    const response = await apiService.post<AuthResponse>("/auth/refresh", {
      refresh_token: refreshToken,
    });

    if (response.data) {
      apiService.setToken(response.data.access_token);
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
    }

    return response;
  }

  async resetPassword(email: string): Promise<{ error: string | null }> {
    const response = await apiService.post("/auth/reset-password", { email });
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
