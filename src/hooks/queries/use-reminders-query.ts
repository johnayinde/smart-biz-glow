// =====================================================
// src/hooks/queries/use-reminders-query.ts
// =====================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reminderService } from "@/services/reminderService";
import { useToast } from "@/hooks/use-toast";

// Get reminder history for an invoice
export const useReminderHistoryQuery = (invoiceId: string) => {
  return useQuery({
    queryKey: ["reminders", invoiceId],
    queryFn: () => reminderService.getReminderHistory(invoiceId),
    enabled: !!invoiceId,
  });
};

// Get reminder stats
export const useReminderStatsQuery = () => {
  return useQuery({
    queryKey: ["reminderStats"],
    queryFn: () => reminderService.getReminderStats(),
  });
};

// Get upcoming reminders
export const useUpcomingRemindersQuery = () => {
  return useQuery({
    queryKey: ["upcomingReminders"],
    queryFn: () => reminderService.getUpcomingReminders(),
  });
};

// Send manual reminder
export const useSendManualReminder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (invoiceId: string) =>
      reminderService.sendManualReminder(invoiceId),
    onSuccess: (response, invoiceId) => {
      queryClient.invalidateQueries({ queryKey: ["reminders", invoiceId] });
      queryClient.invalidateQueries({ queryKey: ["reminderStats"] });
      toast({
        title: "Success",
        description: "Manual reminder sent successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send reminder.",
        variant: "destructive",
      });
    },
  });
};

// Cancel reminders
export const useCancelReminders = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (invoiceId: string) =>
      reminderService.cancelReminders(invoiceId),
    onSuccess: (response, invoiceId) => {
      queryClient.invalidateQueries({ queryKey: ["reminders", invoiceId] });
      queryClient.invalidateQueries({ queryKey: ["reminderStats"] });
      toast({
        title: "Success",
        description: "All reminders have been cancelled.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel reminders.",
        variant: "destructive",
      });
    },
  });
};

// Schedule reminders
export const useScheduleReminders = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (invoiceId: string) =>
      reminderService.scheduleReminders(invoiceId),
    onSuccess: (response, invoiceId) => {
      queryClient.invalidateQueries({ queryKey: ["reminders", invoiceId] });
      queryClient.invalidateQueries({ queryKey: ["reminderStats"] });
      toast({
        title: "Success",
        description: "Reminders scheduled successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to schedule reminders.",
        variant: "destructive",
      });
    },
  });
};
