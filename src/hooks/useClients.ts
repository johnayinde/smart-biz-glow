// Re-export React Query hooks for backward compatibility
export { 
  useClientsQuery as useClients,
  useClientQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation 
} from '@/hooks/queries/use-clients-query';
