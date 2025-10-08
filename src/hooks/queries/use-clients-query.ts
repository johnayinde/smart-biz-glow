import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  clientService,
  Client,
  CreateClientData,
} from "@/services/clientService";
import { useToast } from "@/hooks/use-toast";

export const useClientsQuery = () => {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      try {
        const { data } = await clientService.getClients();
        return data || [];
      } catch (error: any) {
        throw new Error(error.message || "Failed to fetch clients");
      }
    },
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateClientData) => clientService.createClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({ title: "Client created successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateClientData>;
    }) => clientService.updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({ title: "Client updated successfully" });
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => clientService.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({ title: "Client deleted successfully" });
    },
  });
};
