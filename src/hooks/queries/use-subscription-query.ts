import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionService, SubscriptionData } from '@/services/subscriptionService';
import { useToast } from '@/hooks/use-toast';

export const SUBSCRIPTION_QUERY_KEY = ['subscription'] as const;
export const SUBSCRIPTION_HISTORY_QUERY_KEY = ['subscription-history'] as const;

export const useSubscriptionQuery = () => {
  return useQuery({
    queryKey: SUBSCRIPTION_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await subscriptionService.checkSubscription();
      if (error) throw new Error(error);
      return data;
    },
  });
};

export const useSubscriptionHistoryQuery = () => {
  return useQuery({
    queryKey: SUBSCRIPTION_HISTORY_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await subscriptionService.getSubscriptionHistory();
      if (error) throw new Error(error);
      return data || [];
    },
  });
};

export const useCreateCheckoutMutation = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (priceId: string) => {
      const { data, error } = await subscriptionService.createCheckout(priceId);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useCreateCustomerPortalMutation = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await subscriptionService.createCustomerPortal();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useCancelSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await subscriptionService.cancelSubscription();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_QUERY_KEY });
      toast({
        title: "Success",
        description: "Subscription cancelled successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};