import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, User } from '@/services/authService';
import { subscriptionService, SubscriptionData } from '@/services/subscriptionService';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  subscriptionStatus: SubscriptionData | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSubscription: () => Promise<void>;
  createCheckout: (priceId: string, plan: string) => Promise<string>;
  openCustomerPortal: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      authService.initializeToken();
      
      const { data: userData, error } = await authService.getCurrentUser();
      
      if (userData && !error) {
        setUser(userData);
        setIsAuthenticated(true);
        // Check subscription after setting user
        setTimeout(() => {
          checkSubscriptionStatus();
        }, 0);
      } else {
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      if (!user) return;
      
      const { data, error } = await subscriptionService.checkSubscription();

      if (error) {
        console.error('Error checking subscription:', error);
        return;
      }

      setSubscriptionStatus(data);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await authService.login({ email, password });

      if (error) throw new Error(error);

      if (data) {
        setUser(data.user);
        setIsAuthenticated(true);
        // Check subscription after login
        setTimeout(() => {
          checkSubscriptionStatus();
        }, 0);
      }

      toast({
        title: 'Logged in successfully',
        description: 'Welcome back to SmartInvoice!',
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login failed:', error);
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid email or password',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const { data, error } = await authService.signup({ 
        email, 
        password, 
        full_name: name 
      });

      if (error) throw new Error(error);

      if (data) {
        setUser(data.user);
        setIsAuthenticated(true);
        toast({
          title: 'Account created successfully',
          description: 'Welcome to SmartInvoice!',
        });
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Signup failed:', error);
      toast({
        title: 'Signup failed',
        description: error.message || 'Could not create your account',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      setSubscriptionStatus(null);
      
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });

      navigate('/login');
    } catch (error: any) {
      console.error('Logout failed:', error);
      toast({
        title: 'Logout failed',
        description: error.message || 'Could not log you out',
        variant: 'destructive',
      });
    }
  };

  const checkSubscription = async () => {
    await checkSubscriptionStatus();
  };

  const createCheckout = async (priceId: string, plan: string): Promise<string> => {
    try {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await subscriptionService.createCheckout(priceId);

      if (error) throw new Error(error);

      return data!.url;
    } catch (error: any) {
      console.error('Error creating checkout:', error);
      toast({
        title: 'Checkout failed',
        description: error.message || 'Could not create checkout session',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const openCustomerPortal = async (): Promise<string> => {
    try {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await subscriptionService.createCustomerPortal();

      if (error) throw new Error(error);

      return data!.url;
    } catch (error: any) {
      console.error('Error opening customer portal:', error);
      toast({
        title: 'Portal access failed',
        description: error.message || 'Could not open customer portal',
        variant: 'destructive',
      });
      throw error;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      subscriptionStatus,
      login, 
      signup, 
      logout, 
      checkSubscription,
      createCheckout,
      openCustomerPortal
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};