
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionData {
  id: string;
  user_id: string;
  email: string;
  stripe_customer_id: string | null;
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
  created_at: string;
  updated_at: string;
}

export const useSubscription = () => {
  const { session, subscriptionStatus } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptionData = async () => {
    if (!session?.user) return;

    setLoading(true);
    setError(null);

    try {
      // Use type assertion to work around the missing table types
      const { data, error } = await (supabase as any)
        .from('subscribers')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) {
        setError(error.message);
        return;
      }

      setSubscriptionData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, [session?.user?.id, subscriptionStatus]);

  return {
    subscriptionData,
    loading,
    error,
    refetch: fetchSubscriptionData,
  };
};
