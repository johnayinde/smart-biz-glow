// src/hooks/queries/use-invoices-query.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  invoiceService,
  Invoice,
  CreateInvoiceData,
  UpdateInvoiceData,
  InvoiceFilters,
} from "@/services/invoiceService";
import { useToast } from "@/hooks/use-toast";

// Get all invoices
export const useInvoicesQuery = (filters?: InvoiceFilters) => {
  return useQuery({
    queryKey: ["invoices", filters],
    queryFn: () => invoiceService.getInvoices(filters),
  });
};

// Get single invoice
export const useInvoiceQuery = (id: string) => {
  return useQuery({
    queryKey: ["invoice", id],
    queryFn: () => invoiceService.getInvoiceById(id),
    enabled: !!id,
  });
};

// Get invoice stats
export const useInvoiceStatsQuery = () => {
  return useQuery({
    queryKey: ["invoiceStats"],
    queryFn: () => invoiceService.getInvoiceStats(),
  });
};

// Create invoice
export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateInvoiceData) => invoiceService.createInvoice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoiceStats"] });
      toast({
        title: "Success",
        description: "Invoice created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create invoice.",
        variant: "destructive",
      });
    },
  });
};

// Update invoice
export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInvoiceData }) =>
      invoiceService.updateInvoice(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["invoice", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoiceStats"] });
      toast({
        title: "Success",
        description: "Invoice updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update invoice.",
        variant: "destructive",
      });
    },
  });
};

// Delete invoice
export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => invoiceService.deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoiceStats"] });
      toast({
        title: "Success",
        description: "Invoice deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete invoice.",
        variant: "destructive",
      });
    },
  });
};

// Mark invoice as paid
export const useMarkInvoiceAsPaid = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) =>
      invoiceService.updateInvoice(id, { status: "paid" as any }),
    onSuccess: (response, id) => {
      queryClient.invalidateQueries({ queryKey: ["invoice", id] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoiceStats"] });
      queryClient.invalidateQueries({ queryKey: ["reminders", id] });
      toast({
        title: "Success",
        description: "Invoice marked as paid. Reminders have been cancelled.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to mark invoice as paid.",
        variant: "destructive",
      });
    },
  });
};

// Send invoice
export const useSendInvoice = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) =>
      invoiceService.updateInvoice(id, { status: "sent" as any }),
    onSuccess: (response, id) => {
      queryClient.invalidateQueries({ queryKey: ["invoice", id] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["reminders", id] });
      toast({
        title: "Success",
        description:
          "Invoice sent successfully. Reminders have been scheduled.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send invoice.",
        variant: "destructive",
      });
    },
  });
};
