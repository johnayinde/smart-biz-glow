// frontend/src/services/reminderService.ts

import { apiService } from "./api";

export interface Reminder {
  _id: string;
  id: string;
  invoiceId: string;
  userId: string;
  clientId: string;
  type:
    | "before_due"
    | "first_overdue"
    | "second_overdue"
    | "final_notice"
    | "manual";
  status: "scheduled" | "sent" | "failed" | "cancelled";
  scheduledFor: string;
  sentAt?: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  emailData: {
    invoiceNumber: string;
    dueDate: string;
    amount: number;
    currency: string;
    companyName: string;
    daysOverdue?: number;
  };
  retryCount: number;
  failureReason?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReminderStats {
  totalReminders: number;
  sent: number;
  scheduled: number;
  failed: number;
  cancelled: number;
  byType: {
    before_due: number;
    first_overdue: number;
    second_overdue: number;
    final_notice: number;
    manual: number;
  };
}

class ReminderService {
  /**
   * Get reminder history for a specific invoice
   */
  async getReminderHistory(invoiceId: string): Promise<Reminder[]> {
    const response = await apiService.get<Reminder[]>(
      `reminders/invoice/${invoiceId}`
    );
    return response.data;
  }

  /**
   * Get all reminders (with pagination)
   */
  async getAllReminders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
  }): Promise<{
    reminders: Reminder[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiService.get<{
      reminders: Reminder[];
      total: number;
      page: number;
      totalPages: number;
    }>("reminders", { params });
    return response.data;
  }

  /**
   * Get reminder statistics
   */
  async getReminderStats(): Promise<ReminderStats> {
    const response = await apiService.get<ReminderStats>("reminders/stats");
    return response.data;
  }

  /**
   * Send manual reminder for an invoice
   */
  async sendManualReminder(invoiceId: string): Promise<Reminder> {
    const response = await apiService.post<Reminder>(
      `reminders/send-now/${invoiceId}`
    );
    return response.data;
  }

  /**
   * Cancel all reminders for an invoice
   */
  async cancelReminders(invoiceId: string): Promise<{ cancelled: number }> {
    const response = await apiService.delete<{ cancelled: number }>(
      `reminders/cancel/${invoiceId}`
    );
    return response.data;
  }

  /**
   * Helper: Calculate reminder dates for display
   */
  calculateReminderDates(
    dueDate: Date,
    sequenceType: "default" | "aggressive" | "gentle" = "default"
  ) {
    const sequences = {
      default: [
        { type: "before_due", daysOffset: -1 },
        { type: "first_overdue", daysOffset: 3 },
        { type: "final_notice", daysOffset: 7 },
      ],
      aggressive: [
        { type: "before_due", daysOffset: -2 },
        { type: "first_overdue", daysOffset: 1 },
        { type: "final_notice", daysOffset: 3 },
      ],
      gentle: [
        { type: "before_due", daysOffset: -3 },
        { type: "first_overdue", daysOffset: 7 },
        { type: "final_notice", daysOffset: 14 },
      ],
    };

    const sequence = sequences[sequenceType];
    return sequence.map(({ type, daysOffset }) => {
      const date = new Date(dueDate);
      date.setDate(date.getDate() + daysOffset);
      return { type, date };
    });
  }

  /**
   * Helper: Get reminder type label
   */
  getReminderTypeLabel(type: Reminder["type"]): string {
    const labels = {
      before_due: "Friendly Reminder",
      first_overdue: "First Overdue Notice",
      second_overdue: "Second Overdue Notice",
      final_notice: "Final Notice",
      manual: "Manual Reminder",
    };
    return labels[type] || type;
  }

  /**
   * Helper: Get reminder status badge color
   */
  getReminderStatusColor(status: Reminder["status"]): string {
    const colors = {
      scheduled: "blue",
      sent: "green",
      failed: "red",
      cancelled: "gray",
    };
    return colors[status] || "gray";
  }

  /**
   * Helper: Get reminder status badge variant
   */
  getReminderStatusBadgeVariant(
    status: Reminder["status"]
  ): "default" | "secondary" | "destructive" | "outline" {
    const variants = {
      scheduled: "default" as const,
      sent: "secondary" as const,
      failed: "destructive" as const,
      cancelled: "outline" as const,
    };
    return variants[status] || "outline";
  }

  /**
   * Retry a failed reminder
   */
  async retryReminder(reminderId: string): Promise<Reminder> {
    try {
      const response = await apiService.post<Reminder>(
        `/reminders/retry/${reminderId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error retrying reminder:", error);
      throw error;
    }
  }

  /**
   * Get retry count for a reminder
   */
  getRetryCount(reminder: Reminder): number {
    return reminder.retryCount || 0;
  }

  /**
   * Check if reminder can be retried
   */
  canRetry(reminder: Reminder): boolean {
    const maxRetries = 3;
    return (
      reminder.status === "failed" && (reminder.retryCount || 0) < maxRetries
    );
  }

  /**
   * Get remaining retry attempts
   */
  getRemainingRetries(reminder: Reminder): number {
    const maxRetries = 3;
    const currentRetries = reminder.retryCount || 0;
    return Math.max(0, maxRetries - currentRetries);
  }
}

export default new ReminderService();
