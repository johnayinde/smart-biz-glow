import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reminderService } from "@/services/reminderService";
import { useToast } from "@/hooks/use-toast";

export const useReminderHistoryQuery = (invoiceId: string) => {
  return useQuery({
    queryKey: ["reminders", invoiceId],
    queryFn: async () => {
      const { data, error } = await reminderService.getReminderHistory(
        invoiceId
      );
      if (error) throw new Error(error);
      return data || [];
    },
    enabled: !!invoiceId,
  });
};

export const useSendManualReminder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (invoiceId: string) =>
      reminderService.sendManualReminder(invoiceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      toast({ title: "Reminder sent successfully" });
    },
  });
};
