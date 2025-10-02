import { apiService } from "./api";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  async login(
    data: LoginData
  ): Promise<{ data: AuthResponse | null; error: string | null }> {
    const result = await apiService.post<AuthResponse>("/auth/login", data);
    if (result.data) {
      apiService.setToken(result.data.accessToken);
    }
    return result;
  }

  async register(
    data: RegisterData
  ): Promise<{ data: AuthResponse | null; error: string | null }> {
    const result = await apiService.post<AuthResponse>("/auth/register", data);
    if (result.data) {
      apiService.setToken(result.data.accessToken);
    }
    return result;
  }

  async getCurrentUser(): Promise<{ data: User | null; error: string | null }> {
    return apiService.get<User>("/auth/me");
  }

  async logout() {
    apiService.setToken(null);
  }

  async refreshToken(
    refreshToken: string
  ): Promise<{ data: { accessToken: string } | null; error: string | null }> {
    return apiService.post("/auth/refresh", { refreshToken });
  }
}

export const authService = new AuthService();
