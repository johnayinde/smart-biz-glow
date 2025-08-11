import { useState, useEffect } from 'react';
import { analyticsService, DashboardStats, AnalyticsData } from '@/services/analyticsService';

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [statsResponse, analyticsResponse] = await Promise.all([
        analyticsService.getDashboardStats(),
        analyticsService.getAnalyticsData(),
      ]);

      if (statsResponse.error) {
        setError(statsResponse.error);
        return;
      }

      if (analyticsResponse.error) {
        setError(analyticsResponse.error);
        return;
      }

      setStats(statsResponse.data);
      setAnalytics(analyticsResponse.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    stats,
    analytics,
    loading,
    error,
    refetch: fetchDashboardData,
  };
};