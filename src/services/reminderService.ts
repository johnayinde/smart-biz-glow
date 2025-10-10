// frontend/src/services/reminderService.ts

import { apiService } from "./api";

export interface Reminder {
  _id: string;
  id: string;
  invoiceId: string;
  userId: string;
  clientId: string;
  type: "before_due" | "overdue_3" | "overdue_7" | "manual";
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
    overdue_3: number;
    overdue_7: number;
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
        { type: "overdue_3", daysOffset: 3 },
        { type: "overdue_7", daysOffset: 7 },
      ],
      aggressive: [
        { type: "before_due", daysOffset: -1 },
        { type: "overdue_3", daysOffset: 1 },
        { type: "overdue_7", daysOffset: 3 },
      ],
      gentle: [
        { type: "before_due", daysOffset: -2 },
        { type: "overdue_3", daysOffset: 7 },
        { type: "overdue_7", daysOffset: 14 },
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
      overdue_3: "First Overdue Notice",
      overdue_7: "Final Notice",
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
}

export default new ReminderService();
