import { apiService } from "./api";

export interface DashboardStats {
  totalInvoices: number;
  draftInvoices: number;
  sentInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
  totalRevenue: number;
  pendingAmount: number;
  overdueAmount: number;
  paidAmount: number;
  totalClients: number;
  remindersSent: number;
  scheduledReminders: number;
  collectionRate: number;
  averageInvoiceValue: number;
}

class AnalyticsService {
  async getDashboardStats(): Promise<{
    data: DashboardStats | null;
    error: string | null;
  }> {
    return apiService.get<DashboardStats>("/analytics/analytics/dashboard");
  }

  async getRevenueAnalytics(
    period: "week" | "month" | "year" = "month"
  ): Promise<{ data: any; error: string | null }> {
    return apiService.get(`/analytics/analytics/revenue?period=${period}`);
  }

  async getReminderAnalytics(): Promise<{ data: any; error: string | null }> {
    return apiService.get("/analytics/analytics/reminders");
  }

  async getClientInsights(): Promise<{ data: any; error: string | null }> {
    return apiService.get("/analytics/analytics/clients");
  }
}

export const analyticsService = new AnalyticsService();
