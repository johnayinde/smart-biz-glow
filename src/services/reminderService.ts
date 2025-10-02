import { apiService } from "./api";

export interface Reminder {
  _id: string;
  invoiceId: string;
  type: "before_due" | "overdue_3" | "overdue_7" | "manual";
  status: "scheduled" | "sent" | "failed" | "cancelled";
  scheduledFor: string;
  sentAt?: string;
  recipientEmail: string;
  recipientName: string;
  createdAt: string;
}

class ReminderService {
  async getReminderHistory(
    invoiceId: string
  ): Promise<{ data: Reminder[] | null; error: string | null }> {
    return apiService.get<Reminder[]>(
      `/reminder/reminders/invoice/${invoiceId}`
    );
  }

  async sendManualReminder(
    invoiceId: string
  ): Promise<{ data: any; error: string | null }> {
    return apiService.post(`/reminder/reminders/send-now/${invoiceId}`, {});
  }

  async cancelReminders(
    invoiceId: string
  ): Promise<{ data: any; error: string | null }> {
    return apiService.delete(`/reminder/reminders/cancel/${invoiceId}`);
  }

  async getReminderStats(): Promise<{ data: any; error: string | null }> {
    return apiService.get("/reminder/reminders/stats");
  }
}

export const reminderService = new ReminderService();
