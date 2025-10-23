// src/services/api.ts

import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const SERVICE_URLS = {
  auth: import.meta.env.VITE_AUTH_SERVICE_URL,
  client: import.meta.env.VITE_CLIENT_SERVICE_URL,
  invoice: import.meta.env.VITE_INVOICE_SERVICE_URL,
  template: import.meta.env.VITE_TEMPLATE_SERVICE_URL,
  reminder: import.meta.env.VITE_REMINDER_SERVICE_URL,
  payment: import.meta.env.VITE_PAYMENT_SERVICE_URL,
  notification: import.meta.env.VITE_NOTIFICATION_SERVICE_URL,
  analytics: import.meta.env.VITE_ANALYTICS_SERVICE_URL,
};

function getServiceUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  if (cleanPath.startsWith("auth")) return SERVICE_URLS.auth;
  if (cleanPath.startsWith("client")) return SERVICE_URLS.client;
  if (cleanPath.startsWith("invoice")) return SERVICE_URLS.invoice;
  if (cleanPath.startsWith("payment")) return SERVICE_URLS.payment;
  if (cleanPath.startsWith("reminder")) return SERVICE_URLS.reminder;
  if (cleanPath.startsWith("analytics")) return SERVICE_URLS.analytics;
  if (cleanPath.startsWith("notification")) return SERVICE_URLS.notification;
  if (cleanPath.startsWith("template")) return SERVICE_URLS.template;

  return SERVICE_URLS.auth;
}

// ✅ Backend response envelope (standardized)
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  statusCode?: number;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
  statusCode: number;
}

class APIService {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    // this.token = localStorage.getItem("auth_token");
    this.client = axios.create({
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });
    this.initializeToken();
    this.setupInterceptors();

    // if (this.token) this.setAuthHeader(this.token);
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // ✅ Always get fresh token from instance variable (not localStorage)
        if (this.token && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${this.token}`;
          console.log("🔐 Added Authorization header to request");
        } else if (!this.token) {
          console.log("⚠️ No token available for request");
        }

        const baseURL = getServiceUrl(config.url || "");
        config.baseURL = baseURL;

        console.log(
          `🚀 ${config.method?.toUpperCase()} ${baseURL}${config.url}`,
          config.headers.Authorization ? "WITH TOKEN" : "NO TOKEN"
        );
        return config;
      },
      (error) => {
        console.error("❌ Request error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiErrorResponse>) => {
        // Handle 401 with refresh
        if (error.response?.status === 401) {
          const refreshToken = localStorage.getItem("refresh_token");
          if (refreshToken && !error.config?.url?.includes("/auth/refresh")) {
            try {
              const refreshUrl = getServiceUrl("/auth/refresh");
              const resp = await axios.post<
                ApiResponse<{ accessToken: string }>
              >("/auth/refresh", { refreshToken }, { baseURL: refreshUrl });
              const newToken = resp.data.data.accessToken;
              this.setToken(newToken);

              if (error.config) {
                error.config.headers.Authorization = `Bearer ${newToken}`;
                error.config.baseURL = getServiceUrl(error.config.url || "");
                return this.client(error.config);
              }
            } catch {
              this.clearAuth();
              window.location.href = "/login";
            }
          } else {
            this.clearAuth();
            window.location.href = "/login";
          }
        }

        const normalized = this.normalizeError(error);
        return Promise.reject(normalized);
      }
    );
  }
  private initializeToken() {
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      console.log("🔑 Initializing token from localStorage");
      this.setToken(storedToken);
    }
  }

  // Auth helpers
  setAuthHeader(token: string) {
    this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
  removeAuthHeader() {
    delete this.client.defaults.headers.common["Authorization"];
  }
  setToken(token: string) {
    this.token = token;
    localStorage.setItem("auth_token", token);
    this.setAuthHeader(token);
  }
  setRefreshToken(refreshToken: string) {
    localStorage.setItem("refresh_token", refreshToken);
  }
  clearAuth() {
    this.token = null;
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    this.removeAuthHeader();
  }
  getToken() {
    this.token = localStorage.getItem("auth_token");
    return this.token;
  }

  // Normalized error
  private normalizeError(err: unknown) {
    if (axios.isAxiosError<ApiErrorResponse>(err)) {
      const msg =
        err.response?.data?.message || err.message || "An error occurred";
      const detail = err.response?.data?.error || "Unknown error";
      const status = err.response?.status;
      const e = new Error(msg) as Error & { detail?: string; status?: number };
      e.detail = detail;
      e.status = status;
      return e;
    }
    return new Error(String(err));
  }

  // ✅ FIXED: Return full ApiResponse, not just data
  async get<T>(url: string, config = {}): Promise<ApiResponse<T>> {
    const resp = await this.client.get<ApiResponse<T>>(url, config);
    return resp.data; // Return entire response with success, data, meta
  }

  async post<T>(url: string, data?: any, config = {}): Promise<ApiResponse<T>> {
    const resp = await this.client.post<ApiResponse<T>>(url, data, config);
    return resp.data;
  }

  async put<T>(url: string, data?: any, config = {}): Promise<ApiResponse<T>> {
    const resp = await this.client.put<ApiResponse<T>>(url, data, config);
    return resp.data;
  }

  async patch<T>(
    url: string,
    data?: any,
    config = {}
  ): Promise<ApiResponse<T>> {
    const resp = await this.client.patch<ApiResponse<T>>(url, data, config);
    return resp.data;
  }

  async delete<T = void>(url: string, config = {}): Promise<ApiResponse<T>> {
    const resp = await this.client.delete<ApiResponse<T>>(url, config);
    return resp.data;
  }
}

export const apiService = new APIService();
