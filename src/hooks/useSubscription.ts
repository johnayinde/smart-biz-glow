
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { subscriptionService, SubscriptionData } from '@/services/subscriptionService';

export const useSubscription = () => {
  const { user, subscriptionStatus } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptionData = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await subscriptionService.checkSubscription();

      if (error) {
        setError(error);
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
  }, [user?.id, subscriptionStatus]);

  return {
    subscriptionData,
    loading,
    error,
    refetch: fetchSubscriptionData,
  };
};
