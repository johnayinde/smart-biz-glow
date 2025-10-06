// src/hooks/queries/use-payments-query.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  paymentService,
  Payment,
  CreatePaymentData,
  UpdatePaymentData,
  PaymentFilters,
} from "@/services/paymentService";
import { useToast } from "@/hooks/use-toast";

// Get all payments
export const usePaymentsQuery = (filters?: PaymentFilters) => {
  return useQuery({
    queryKey: ["payments", filters],
    queryFn: () => paymentService.getPayments(filters),
  });
};

// Get single payment
export const usePaymentQuery = (id: string) => {
  return useQuery({
    queryKey: ["payment", id],
    queryFn: () => paymentService.getPaymentById(id),
    enabled: !!id,
  });
};

// Get payments by invoice
export const usePaymentsByInvoiceQuery = (invoiceId: string) => {
  return useQuery({
    queryKey: ["payments", "invoice", invoiceId],
    queryFn: () => paymentService.getPaymentsByInvoice(invoiceId),
    enabled: !!invoiceId,
  });
};

// Get payment stats
export const usePaymentStatsQuery = () => {
  return useQuery({
    queryKey: ["paymentStats"],
    queryFn: async () => {
      // This endpoint might need to be added to your payment service
      // For now, we'll aggregate from the payments list
      const response = await paymentService.getPayments({ limit: 1000 });
      const payments = response.payments || [];

      const stats = payments.reduce(
        (acc, payment) => {
          acc.totalRevenue += payment.amount;

          if (payment.status === "completed") {
            acc.completed.count += 1;
            acc.completed.amount += payment.amount;
          } else if (payment.status === "pending") {
            acc.pending.count += 1;
            acc.pending.amount += payment.amount;
          } else if (payment.status === "failed") {
            acc.failed.count += 1;
            acc.failed.amount += payment.amount;
          } else if (payment.status === "refunded") {
            acc.refunded.count += 1;
            acc.refunded.amount += payment.amount;
          }

          return acc;
        },
        {
          totalRevenue: 0,
          completed: { count: 0, amount: 0 },
          pending: { count: 0, amount: 0 },
          failed: { count: 0, amount: 0 },
          refunded: { count: 0, amount: 0 },
        }
      );

      return { data: stats };
    },
  });
};

// Create payment (record payment)
export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreatePaymentData) => paymentService.createPayment(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["paymentStats"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoiceStats"] });

      // Invalidate the specific invoice
      if (response.data?.invoiceId) {
        queryClient.invalidateQueries({
          queryKey: ["invoice", response.data.invoiceId],
        });
        queryClient.invalidateQueries({
          queryKey: ["reminders", response.data.invoiceId],
        });
      }

      toast({
        title: "Success",
        description:
          "Payment recorded successfully. Invoice has been marked as paid.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to record payment.",
        variant: "destructive",
      });
    },
  });
};

// Update payment
export const useUpdatePayment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePaymentData }) =>
      paymentService.updatePayment(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payment", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["paymentStats"] });
      toast({
        title: "Success",
        description: "Payment updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update payment.",
        variant: "destructive",
      });
    },
  });
};

// Delete payment
export const useDeletePayment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => paymentService.deletePayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["paymentStats"] });
      toast({
        title: "Success",
        description: "Payment deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete payment.",
        variant: "destructive",
      });
    },
  });
};

// Refund payment
export const useRefundPayment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) =>
      paymentService.updatePayment(id, {
        status: "refunded" as any,
        notes: `Refunded amount: ${amount}`,
      }),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payment", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["paymentStats"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast({
        title: "Success",
        description: "Payment refunded successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to refund payment.",
        variant: "destructive",
      });
    },
  });
};
