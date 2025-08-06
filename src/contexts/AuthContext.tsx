
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  subscriptionStatus: {
    subscribed: boolean;
    subscription_tier: string | null;
    subscription_end: string | null;
  } | null;
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
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    subscribed: boolean;
    subscription_tier: string | null;
    subscription_end: string | null;
  } | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session);
        
        // Check subscription status when user logs in
        if (session?.user && event === 'SIGNED_IN') {
          setTimeout(() => {
            checkSubscriptionStatus();
          }, 0);
        } else if (!session) {
          setSubscriptionStatus(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
      
      if (session?.user) {
        setTimeout(() => {
          checkSubscriptionStatus();
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      if (!session) return;
      
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: name,
          }
        }
      });

      if (error) throw error;

      toast({
        title: 'Account created successfully',
        description: 'Please check your email to confirm your account.',
      });

      // Don't automatically navigate since email confirmation might be required
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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

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
      if (!session) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId, plan },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      return data.url;
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
      if (!session) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      return data.url;
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

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
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
