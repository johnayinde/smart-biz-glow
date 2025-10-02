import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService, CreatePaymentData } from "@/services/paymentService";
import { useToast } from "@/hooks/use-toast";

export const usePaymentsQuery = () => {
  return useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const { data, error } = await paymentService.getPayments();
      if (error) throw new Error(error);
      return data || [];
    },
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreatePaymentData) => paymentService.createPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast({ title: "Payment recorded successfully" });
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
