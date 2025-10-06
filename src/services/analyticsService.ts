// src/services/analyticsService.ts
import { apiService } from "./api";

export interface DashboardStats {
  totalClients: number;
  totalInvoices: number;
  totalRevenue: number;
  pendingAmount: number;
  overdueInvoices: number;
  remindersSentThisWeek: number;
  averagePaymentTime: number;
  reminderEffectiveness: number;
  revenueGrowth: number;
  clientGrowth: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  invoices: number;
}

export interface ClientInsight {
  clientId: string;
  clientName: string;
  totalInvoices: number;
  totalRevenue: number;
  averagePaymentTime: number;
  overdueCount: number;
}

export interface ReminderPerformance {
  totalRemindersSent: number;
  remindersByType: {
    before_due: number;
    overdue_3: number;
    overdue_7: number;
  };
  paymentsAfterReminder: number;
  avgTimeToPayAfterReminder: number;
  effectivenessRate: number;
}

export interface PaymentTrend {
  date: string;
  amount: number;
  count: number;
}

export interface InvoiceStatusBreakdown {
  status: string;
  count: number;
  totalAmount: number;
}

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  clientId?: string;
  period?: "week" | "month" | "quarter" | "year";
}

class AnalyticsService {
  async getDashboardStats(filters?: AnalyticsFilters) {
    const params = new URLSearchParams();

    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);
    if (filters?.period) params.append("period", filters.period);

    const queryString = params.toString();
    const url = `/analytics/dashboard-stats${
      queryString ? `?${queryString}` : ""
    }`;

    return apiService.get<DashboardStats>(url);
  }

  // async getRevenueData(filters?: AnalyticsFilters) {
  //   const params = new URLSearchParams();

  //   if (filters?.startDate) params.append("startDate", filters.startDate);
  //   if (filters?.endDate) params.append("endDate", filters.endDate);
  //   if (filters?.period) params.append("period", filters.period);

  //   const queryString = params.toString();
  //   const url = `/analytics/revenue${queryString ? `?${queryString}` : ""}`;

  //   return apiService.get<{ data: RevenueData[] }>(url);
  // }

  async getClientInsights(filters?: AnalyticsFilters) {
    const params = new URLSearchParams();

    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);
    if (filters?.clientId) params.append("clientId", filters.clientId);

    const queryString = params.toString();
    const url = `/analytics/client-insights${
      queryString ? `?${queryString}` : ""
    }`;

    return apiService.get<{ clients: ClientInsight[] }>(url);
  }

  async getPaymentTrends(filters?: AnalyticsFilters) {
    const params = new URLSearchParams();

    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);
    if (filters?.period) params.append("period", filters.period);

    const queryString = params.toString();
    const url = `/analytics/payment-trends${
      queryString ? `?${queryString}` : ""
    }`;

    return apiService.get<{ trends: PaymentTrend[] }>(url);
  }

  async getInvoiceStatusBreakdown(filters?: AnalyticsFilters) {
    const params = new URLSearchParams();

    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);

    const queryString = params.toString();
    const url = `/analytics/invoice-status${
      queryString ? `?${queryString}` : ""
    }`;

    return apiService.get<{ breakdown: InvoiceStatusBreakdown[] }>(url);
  }

  async getReminderPerformance(filters?: AnalyticsFilters) {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);

    const queryString = params.toString();
    const url = `/analytics/reminders${queryString ? `?${queryString}` : ""}`;

    return apiService.get<ReminderPerformance>(url);
  }

  async getRevenueData(filters?: AnalyticsFilters) {
    const params = new URLSearchParams();
    if (filters?.period) params.append("period", filters.period);

    const queryString = params.toString();
    const url = `/analytics/revenue${queryString ? `?${queryString}` : ""}`;

    return apiService.get<{ data: RevenueData[] }>(url);
  }

  async exportData(
    type: "invoices" | "payments" | "clients",
    filters?: AnalyticsFilters
  ) {
    const params = new URLSearchParams();

    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);

    const queryString = params.toString();
    const url = `/analytics/export/${type}${
      queryString ? `?${queryString}` : ""
    }`;

    // This returns a blob/CSV file
    const response = await fetch(`${apiService.getToken()}${url}`, {
      headers: {
        Authorization: `Bearer ${apiService.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to export data");
    }

    const blob = await response.blob();
    return blob;
  }
}

export const analyticsService = new AnalyticsService();
