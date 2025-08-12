import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { InvoiceStatusChart } from "@/components/dashboard/invoice-status-chart";
import { InsightCard } from "@/components/insights/insight-card";
import { dashboardStats, getMockData, invoices, insights } from "@/services/mockData";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="animate-pulse-light text-lg font-medium">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Create Invoice
        </Button>
      </div>
      
      <StatsCards stats={dashboardStats} />
      
      <div className="grid gap-6 md:grid-cols-2">
        <InvoiceStatusChart invoices={invoices} />
        <RecentActivity activities={dashboardStats.recentActivity} />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">AI Insights</h3>
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
          {insights.slice(0, 2).map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;