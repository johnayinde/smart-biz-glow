// src/contexts/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authService, User } from "@/services/authService";
import { apiService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    companyName?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      apiService.setToken(storedToken);
    }

    const token = apiService.getToken();
    console.log("Checking auth, token:", token);

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await authService.getCurrentUser();
      console.log("Auth check data:", data, "error:", error);

      if (data && !error) {
        setUser(data);
      } else {
        // Token exists but invalid - clear it
        apiService.clearAuth();
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      apiService.clearAuth();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error, message } = await authService.login({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: message || error,
          variant: "destructive",
        });
        throw new Error(error);
      }

      if (data) {
        localStorage.setItem("auth_token", data.accessToken);
        localStorage.setItem("refresh_token", data.refreshToken);

        // Set token in API service
        apiService.setToken(data.accessToken);
        setUser(data.user);

        toast({
          title: "Welcome back!",
          description: `Logged in as ${data.user.email}`,
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    companyName?: string
  ) => {
    try {
      const { data, error, message } = await authService.register({
        email,
        password,
        firstName,
        lastName,
        companyName,
      });

      if (error) {
        toast({
          title: "Registration Failed",
          description: message || error,
          variant: "destructive",
        });
        throw new Error(error);
      }

      if (data) {
        toast({
          title: "Registration Successful!",
          description: "Please check your email to verify your account.",
        });

        // Note: User is NOT logged in after registration
        // They must verify email first
        // So we don't set user state here
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local state even if backend call fails
      setUser(null);
      apiService.clearAuth();
    }
  };

  const refreshUser = async () => {
    try {
      const { data } = await authService.getCurrentUser();
      if (data) {
        setUser(data);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
