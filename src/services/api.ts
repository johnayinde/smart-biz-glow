const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

class ApiService {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("auth_token", token);
    } else {
      localStorage.removeItem("auth_token");
    }
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem("auth_token");
    }
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data: T | null; error: string | null }> {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
      };

      const token = this.getToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const result = await response.json();

      if (!response.ok) {
        return { data: null, error: result.message || "An error occurred" };
      }

      // Backend returns { success, data, message }
      return { data: result.data || result, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  async get<T>(
    endpoint: string
  ): Promise<{ data: T | null; error: string | null }> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(
    endpoint: string,
    body?: any
  ): Promise<{ data: T | null; error: string | null }> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    body?: any
  ): Promise<{ data: T | null; error: string | null }> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(
    endpoint: string,
    body?: any
  ): Promise<{ data: T | null; error: string | null }> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(
    endpoint: string
  ): Promise<{ data: T | null; error: string | null }> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiService = new ApiService();
