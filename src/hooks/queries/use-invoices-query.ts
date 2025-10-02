import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  invoiceService,
  Invoice,
  CreateInvoiceData,
} from "@/services/invoiceService";
import { useToast } from "@/hooks/use-toast";

export const useInvoicesQuery = () => {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data, error } = await invoiceService.getInvoices();
      if (error) throw new Error(error);
      return data || [];
    },
  });
};

export const useInvoiceQuery = (id: string) => {
  return useQuery({
    queryKey: ["invoices", id],
    queryFn: async () => {
      const { data, error } = await invoiceService.getInvoice(id);
      if (error) throw new Error(error);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateInvoiceData) => invoiceService.createInvoice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast({ title: "Invoice created successfully" });
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

export const useMarkInvoiceAsPaid = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => invoiceService.markAsPaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast({ title: "Invoice marked as paid" });
    },
  });
};
