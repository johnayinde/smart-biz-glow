import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analyticsService";

export const useDashboardStatsQuery = () => {
  return useQuery({
    queryKey: ["analytics", "dashboard"],
    queryFn: async () => {
      const { data, error } = await analyticsService.getDashboardStats();
      if (error) throw new Error(error);
      return data;
    },
  });
};

export const useRevenueAnalyticsQuery = (
  period: "week" | "month" | "year" = "month"
) => {
  return useQuery({
    queryKey: ["analytics", "revenue", period],
    queryFn: async () => {
      const { data, error } = await analyticsService.getRevenueAnalytics(
        period
      );
      if (error) throw new Error(error);
      return data;
    },
  });
};
