
// Re-export React Query hooks for backward compatibility
export { 
  useSubscriptionQuery as useSubscription,
  useSubscriptionHistoryQuery,
  useCreateCheckoutMutation,
  useCreateCustomerPortalMutation,
  useCancelSubscriptionMutation 
} from '@/hooks/queries/use-subscription-query';
