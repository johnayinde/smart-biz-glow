// Re-export React Query hooks for backward compatibility
export { 
  useDashboardQuery as useDashboard,
  useDashboardStatsQuery,
  useAnalyticsDataQuery,
  useInsightsQuery 
} from '@/hooks/queries/use-analytics-query';