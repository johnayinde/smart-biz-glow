import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoiceService, Invoice, CreateInvoiceData, UpdateInvoiceData, InvoiceTemplate } from '@/services/invoiceService';
import { useToast } from '@/hooks/use-toast';

export const INVOICES_QUERY_KEY = ['invoices'] as const;
export const INVOICE_TEMPLATES_QUERY_KEY = ['invoice-templates'] as const;

export const useInvoicesQuery = () => {
  return useQuery({
    queryKey: INVOICES_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await invoiceService.getInvoices();
      if (error) throw new Error(error);
      return data || [];
    },
  });
};

export const useInvoiceQuery = (id: string) => {
  return useQuery({
    queryKey: ['invoices', id],
    queryFn: async () => {
      const { data, error } = await invoiceService.getInvoice(id);
      if (error) throw new Error(error);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateInvoiceMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (invoiceData: CreateInvoiceData) => {
      const { data, error } = await invoiceService.createInvoice(invoiceData);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY });
      toast({
        title: "Success",
        description: "Invoice created successfully",
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

export const useUpdateInvoiceMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateInvoiceData }) => {
      const { data: result, error } = await invoiceService.updateInvoice(id, data);
      if (error) throw new Error(error);
      return result;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['invoices', id] });
      toast({
        title: "Success",
        description: "Invoice updated successfully",
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

export const useMarkInvoiceAsPaidMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await invoiceService.markAsPaid(id);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['invoices', id] });
      toast({
        title: "Success",
        description: "Invoice marked as paid",
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

export const useDeleteInvoiceMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await invoiceService.deleteInvoice(id);
      if (error) throw new Error(error);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY });
      toast({
        title: "Success",
        description: "Invoice deleted successfully",
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

// Invoice Templates
export const useInvoiceTemplatesQuery = () => {
  return useQuery({
    queryKey: INVOICE_TEMPLATES_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await invoiceService.getTemplates();
      if (error) throw new Error(error);
      return data || [];
    },
  });
};

export const useCreateTemplateMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (templateData: Omit<InvoiceTemplate, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await invoiceService.createTemplate(templateData);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVOICE_TEMPLATES_QUERY_KEY });
      toast({
        title: "Success",
        description: "Template created successfully",
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