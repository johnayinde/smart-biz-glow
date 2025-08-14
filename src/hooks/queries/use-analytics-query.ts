import { useQuery } from '@tanstack/react-query';
import { analyticsService, DashboardStats, AnalyticsData } from '@/services/analyticsService';

export const DASHBOARD_STATS_QUERY_KEY = ['dashboard-stats'] as const;
export const ANALYTICS_DATA_QUERY_KEY = ['analytics-data'] as const;
export const INSIGHTS_QUERY_KEY = ['insights'] as const;

export const useDashboardStatsQuery = () => {
  return useQuery({
    queryKey: DASHBOARD_STATS_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await analyticsService.getDashboardStats();
      if (error) throw new Error(error);
      return data;
    },
  });
};

export const useAnalyticsDataQuery = (period: 'week' | 'month' | 'year' = 'month') => {
  return useQuery({
    queryKey: [...ANALYTICS_DATA_QUERY_KEY, period],
    queryFn: async () => {
      const { data, error } = await analyticsService.getAnalyticsData(period);
      if (error) throw new Error(error);
      return data;
    },
  });
};

export const useInsightsQuery = () => {
  return useQuery({
    queryKey: INSIGHTS_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await analyticsService.getInsights();
      if (error) throw new Error(error);
      return data || [];
    },
  });
};

// Combined hook for dashboard data
export const useDashboardQuery = () => {
  const statsQuery = useDashboardStatsQuery();
  const analyticsQuery = useAnalyticsDataQuery();

  return {
    stats: statsQuery.data,
    analytics: analyticsQuery.data,
    loading: statsQuery.isLoading || analyticsQuery.isLoading,
    error: statsQuery.error || analyticsQuery.error,
    refetch: () => {
      statsQuery.refetch();
      analyticsQuery.refetch();
    },
  };
};