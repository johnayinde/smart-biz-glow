// src/contexts/AuthContext.tsx
type NormalizedError = Error & { status?: number; detail?: string };

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { authService, User, RegisterResponse } from "@/services/authService";
import { apiService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;

  // Return types aligned with implementations:
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    companyName?: string
  ) => Promise<RegisterResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;

  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // ---- checkAuth ----
  const checkAuth = useCallback(async () => {
    let mounted = true;

    // Seed token so /auth/me is authorized
    const stored = localStorage.getItem("auth_token");
    if (stored) apiService.setToken(stored);

    const token = apiService.getToken();
    if (!token) {
      if (mounted) {
        setUser(null);
        setLoading(false);
      }
      return;
    }

    try {
      const response = await authService.getCurrentUser(); // throws on error
      if (mounted) setUser(response.data); // Assuming `data` contains the `User` object
    } catch (e) {
      const err = e as NormalizedError;
      if (err.status === 401) {
        apiService.clearAuth(); // invalid/expired after refresh attempt
      }
      if (mounted) setUser(null);
      console.error("Auth check failed:", err.message, err.detail);
    } finally {
      if (mounted) setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!cancelled) await checkAuth();
    })();
    return () => {
      cancelled = true;
    };
  }, [checkAuth]);

  // ---- login ----
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const data = await authService.login({ email, password }); // { user, accessToken, refreshToken }
        localStorage.setItem("auth_token", data.accessToken);
        localStorage.setItem("refresh_token", data.refreshToken);
        setUser(data.user);

        toast({
          title: "success",
          description: `Logged in as ${data.user.email}`,
        });
      } catch (err: any) {
        toast({
          title: "Login Failed",
          description: err?.message || "Unable to log in",
          variant: "destructive",
        });
        throw err;
      }
    },
    [toast]
  );

  // ---- register ----
  const register = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string,
      companyName?: string
    ): Promise<RegisterResponse> => {
      try {
        const res = await authService.register({
          email,
          password,
          firstName,
          lastName,
          companyName,
        });

        toast({
          title: "Registration Successful!",
          description: "Please check your email to verify your account.",
        });

        return res.data; // { userId }
      } catch (err: any) {
        toast({
          title: "Registration Failed",
          description: err?.message || "Unable to register",
          variant: "destructive",
        });
        throw err;
      }
    },
    [toast]
  );

  // ---- logout ----
  const logout = useCallback(async () => {
    try {
      await authService.logout(); // clears tokens server-side (we also clear locally in finally)
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      apiService.clearAuth();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    }
  }, [toast]);

  // ---- refreshUser ----
  const refreshUser = useCallback(async (): Promise<User | null> => {
    try {
      const response = await authService.getCurrentUser();
      const me = response.data; // Extract the User object from ApiResponse
      setUser(me);
      return me;
    } catch (err) {
      console.error("Failed to refresh user:", err);
      return null;
    }
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      refreshUser,
      isAuthenticated: !!user,
    }),
    [user, loading, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
