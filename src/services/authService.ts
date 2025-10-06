// src/services/authService.ts
import { apiService } from "./api";

// ===== Request DTOs =====
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyName?: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

// ===== Response DTOs (matching backend) =====
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isEmailVerified: boolean;
  isActive: boolean;
  companyId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  userId: string;
}

class AuthService {
  async login(data: LoginData) {
    const result = await apiService.post<AuthResponse>("/auth/login", data);
    console.log({ result });

    if (result && result.accessToken) {
      // Store both tokens
      apiService.setToken(result.accessToken);
      apiService.setRefreshToken(result.refreshToken);
    }

    return result;
  }

  async register(data: RegisterData) {
    // Backend returns { userId } on registration, not full auth data
    const result = await apiService.post<RegisterResponse>(
      "/auth/register",
      data
    );
    return result;
  }

  async getCurrentUser() {
    return apiService.get<User>("/auth/me");
  }

  async logout() {
    // Call backend logout endpoint
    const result = await apiService.post("/auth/logout");

    // Clear local storage regardless of backend response
    apiService.clearAuth();

    return result;
  }

  async refreshToken(refreshToken: string) {
    return apiService.post<{ accessToken: string }>("/auth/refresh", {
      refreshToken,
    });
  }

  async forgotPassword(data: ForgotPasswordData) {
    return apiService.post("/auth/forgot-password", data);
  }

  async resetPassword(data: ResetPasswordData) {
    return apiService.post("/auth/reset-password", data);
  }

  async verifyEmail(token: string) {
    return apiService.get(`/auth/verify-email?token=${token}`);
  }

  // Helper methods
  isAuthenticated(): boolean {
    return !!apiService.getToken();
  }

  getStoredToken(): string | null {
    return apiService.getToken();
  }
}

export const authService = new AuthService();
