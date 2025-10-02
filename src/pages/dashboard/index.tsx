import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { InvoiceStatusChart } from "@/components/dashboard/invoice-status-chart";
import { useDashboardStatsQuery } from "@/hooks/queries/use-analytics-query";
import { useInvoicesQuery } from "@/hooks/queries/use-invoices-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useDashboardStatsQuery();
  const { data: invoices = [], isLoading: invoicesLoading } =
    useInvoicesQuery();

  if (statsLoading || invoicesLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="animate-pulse text-lg font-medium">
          Loading dashboard...
        </div>
      </div>
    );
  }

  const dashboardStats = stats
    ? {
        totalInvoiced:
          stats.totalRevenue + stats.pendingAmount + stats.overdueAmount,
        pendingAmount: stats.pendingAmount,
        overdue: stats.overdueAmount,
        paid: stats.paidAmount,
        clientsCount: stats.totalClients,
        recentActivity: [], // TODO: Add activity feed
      }
    : {
        totalInvoiced: 0,
        pendingAmount: 0,
        overdue: 0,
        paid: 0,
        clientsCount: 0,
        recentActivity: [],
      };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Button className="gap-2" onClick={() => navigate("/invoices/new")}>
          <Plus className="h-4 w-4" /> Create Invoice
        </Button>
      </div>

      <StatsCards stats={dashboardStats} />

      <div className="grid gap-6 md:grid-cols-2">
        <InvoiceStatusChart invoices={invoices} />
        <RecentActivity activities={dashboardStats.recentActivity} />
      </div>
    </div>
  );
};

export default Dashboard;
