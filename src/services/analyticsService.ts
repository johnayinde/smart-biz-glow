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

export interface ExportFilters {
  startDate?: string;
  endDate?: string;
  format?: "csv" | "pdf";
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

  /**
   * Export data as CSV or PDF with proper file download handling
   */
  async exportData(
    type: "invoices" | "payments" | "clients",
    filters?: ExportFilters
  ): Promise<void> {
    const params = new URLSearchParams();

    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);
    if (filters?.format) params.append("format", filters.format);

    const queryString = params.toString();
    const url = `/analytics/export/${type}${
      queryString ? `?${queryString}` : ""
    }`;

    try {
      const response = await apiService.get<Blob>(url, {
        responseType: "blob",
      });

      // Get the filename from content-disposition header or use default
      // const contentDisposition = response.headers.get("content-disposition");
      const contentDisposition =
        (response as any).headers?.["content-disposition"] ?? null;
      let filename = `${type}-export-${new Date().getTime()}.csv`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Determine file type from format or content-type
      // const contentType = response.headers.get("content-type") || "text/csv";
      const contentType =
        (response as any).headers?.["content-type"] || "text/csv";
      const isPdf = filters?.format === "pdf" || contentType.includes("pdf");

      if (isPdf) {
        filename = filename.replace(/\.csv$/, ".pdf");
      }

      // Get the blob and create download link
      // const blob = new Blob([response.data], { type: contentType });
      const blob =
        response.data instanceof Blob
          ? response.data
          : new Blob([response.data], { type: contentType });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Export error:", error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();
