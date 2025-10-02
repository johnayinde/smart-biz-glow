// src/services/api.ts
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const SERVICE_URLS = {
  auth: import.meta.env.VITE_AUTH_SERVICE_URL || "http://localhost:4001",
  client: import.meta.env.VITE_CLIENT_SERVICE_URL || "http://localhost:4004",
  invoice: import.meta.env.VITE_INVOICE_SERVICE_URL || "http://localhost:4003",
  payment: import.meta.env.VITE_PAYMENT_SERVICE_URL || "http://localhost:4005",
  reminder:
    import.meta.env.VITE_REMINDER_SERVICE_URL || "http://localhost:4006",
  analytics:
    import.meta.env.VITE_ANALYTICS_SERVICE_URL || "http://localhost:4008",
};

const GATEWAY_URL =
  import.meta.env.VITE_API_GATEWAY_URL || "http://localhost:4000/api";

function getServiceUrl(path: string): string {
  // Direct mode - route to specific service
  if (path.startsWith("/auth")) return SERVICE_URLS.auth;
  if (path.startsWith("/client")) return SERVICE_URLS.client;
  if (path.startsWith("/invoice")) return SERVICE_URLS.invoice;
  if (path.startsWith("/payment")) return SERVICE_URLS.payment;
  if (path.startsWith("/reminder")) return SERVICE_URLS.reminder;
  if (path.startsWith("/analytics")) return SERVICE_URLS.analytics;

  return SERVICE_URLS.auth; // fallback
}
// Backend response structure
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  statusCode?: number;
}

// Error response structure
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
    this.client = axios.create({
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    // Load token from localStorage on initialization
    this.token = localStorage.getItem("auth_token");
    if (this.token) {
      this.setAuthHeader(this.token);
    }

    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const baseURL = getServiceUrl(config.url || "");
        config.baseURL = baseURL;

        console.log(
          `🚀 ${config.method?.toUpperCase()} ${baseURL}${config.url}`
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
      (response) => {
        console.log(`✅ Response:`, response.status);
        return response;
      },
      async (error: AxiosError<ApiErrorResponse>) => {
        console.error(
          "❌ Response error:",
          error.response?.data || error.message
        );

        // Handle 401 Unauthorized - token expired
        if (error.response?.status === 401) {
          const refreshToken = localStorage.getItem("refresh_token");

          if (refreshToken && !error.config?.url?.includes("/auth/refresh")) {
            try {
              const refreshUrl = getServiceUrl("/auth/refresh");
              const response = await axios.post<ApiResponse>(
                "/auth/refresh",
                { refreshToken },
                { baseURL: refreshUrl }
              );

              if (response.data.success && response.data.data.accessToken) {
                const newToken = response.data.data.accessToken;
                this.setToken(newToken);

                // Retry the original request
                if (error.config) {
                  error.config.headers.Authorization = `Bearer ${newToken}`;
                  const baseURL = getServiceUrl(error.config.url || "");
                  error.config.baseURL = baseURL;
                  return this.client(error.config);
                }
              }
            } catch (refreshError) {
              // Refresh failed - logout user
              this.clearAuth();
              window.location.href = "/login";
            }
          } else {
            // No refresh token or refresh endpoint failed - logout
            this.clearAuth();
            window.location.href = "/login";
          }
        }

        return Promise.reject(error);
      }
    );
  }

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
    return localStorage.getItem("auth_token");
    // return this.token;
  }

  // Generic request methods that handle the wrapped response
  async get<T>(url: string, config = {}) {
    try {
      const response = await this.client.get<ApiResponse<T>>(url, config);
      return {
        data: response.data.data,
        message: response.data.message,
        error: null,
      };
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  async post<T>(url: string, data?: any, config = {}) {
    try {
      const response = await this.client.post<ApiResponse<T>>(
        url,
        data,
        config
      );
      return {
        data: response.data.data,
        message: response.data.message,
        error: null,
      };
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  async put<T>(url: string, data?: any, config = {}) {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data, config);
      return {
        data: response.data.data,
        message: response.data.message,
        error: null,
      };
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  async patch<T>(url: string, data?: any, config = {}) {
    try {
      const response = await this.client.patch<ApiResponse<T>>(
        url,
        data,
        config
      );
      return {
        data: response.data.data,
        message: response.data.message,
        error: null,
      };
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  async delete<T>(url: string, config = {}) {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url, config);
      return {
        data: response.data.data,
        message: response.data.message,
        error: null,
      };
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  private handleError<T>(error: unknown): {
    data: null;
    message: string;
    error: string;
  } {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "An error occurred";
      const errorDetail = axiosError.response?.data?.error || "Unknown error";

      return {
        data: null,
        message,
        error: errorDetail,
      };
    }

    return {
      data: null,
      message: "An unexpected error occurred",
      error: String(error),
    };
  }
}

export const apiService = new APIService();
