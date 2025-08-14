import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService, Client, CreateClientData, UpdateClientData } from '@/services/clientService';
import { useToast } from '@/hooks/use-toast';

export const CLIENTS_QUERY_KEY = ['clients'] as const;

export const useClientsQuery = () => {
  return useQuery({
    queryKey: CLIENTS_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await clientService.getClients();
      if (error) throw new Error(error);
      return data || [];
    },
  });
};

export const useClientQuery = (id: string) => {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: async () => {
      const { data, error } = await clientService.getClient(id);
      if (error) throw new Error(error);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateClientMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (clientData: CreateClientData) => {
      const { data, error } = await clientService.createClient(clientData);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
      toast({
        title: "Success",
        description: "Client created successfully",
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

export const useUpdateClientMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateClientData }) => {
      const { data: result, error } = await clientService.updateClient(id, data);
      if (error) throw new Error(error);
      return result;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['clients', id] });
      toast({
        title: "Success",
        description: "Client updated successfully",
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

export const useDeleteClientMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await clientService.deleteClient(id);
      if (error) throw new Error(error);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
      toast({
        title: "Success",
        description: "Client deleted successfully",
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