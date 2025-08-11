import { apiService } from './api';

export interface DashboardStats {
  total_clients: number;
  total_invoices: number;
  total_revenue: number;
  pending_payments: number;
  overdue_invoices: number;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface RecentActivity {
  id: string;
  type: 'invoice_created' | 'payment_received' | 'client_added' | 'invoice_sent';
  description: string;
  timestamp: string;
  amount?: number;
}

export interface AnalyticsData {
  revenue_chart: ChartData[];
  invoice_status_chart: ChartData[];
  monthly_revenue: ChartData[];
  recent_activities: RecentActivity[];
}

class AnalyticsService {
  async getDashboardStats(): Promise<{ data: DashboardStats | null; error: string | null }> {
    return apiService.get<DashboardStats>('/analytics/dashboard-stats');
  }

  async getAnalyticsData(period: 'week' | 'month' | 'year' = 'month'): Promise<{ data: AnalyticsData | null; error: string | null }> {
    return apiService.get<AnalyticsData>(`/analytics/data?period=${period}`);
  }

  async getInsights(): Promise<{ data: any[] | null; error: string | null }> {
    return apiService.get<any[]>('/analytics/insights');
  }

  async exportData(format: 'csv' | 'pdf' = 'csv'): Promise<{ data: Blob | null; error: string | null }> {
    return apiService.get<Blob>(`/analytics/export?format=${format}`);
  }
}

export const analyticsService = new AnalyticsService();