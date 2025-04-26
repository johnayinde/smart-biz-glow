
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Clock, CheckCircle } from "lucide-react";
import { DashboardStats } from "@/services/mockData";

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const items = [
    {
      title: "Total Invoiced",
      value: formatter.format(stats.totalInvoiced),
      icon: DollarSign,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Pending",
      value: formatter.format(stats.pendingAmount),
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    },
    {
      title: "Overdue",
      value: formatter.format(stats.overdue),
      icon: Clock,
      color: "text-red-500",
      bgColor: "bg-red-100 dark:bg-red-900/20",
    },
    {
      title: "Paid",
      value: formatter.format(stats.paid),
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Active Clients",
      value: stats.clientsCount.toString(),
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {items.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <div className={`${item.bgColor} p-2 rounded-full`}>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
