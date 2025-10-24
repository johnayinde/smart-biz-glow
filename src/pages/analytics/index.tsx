import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { analyticsService } from "@/services/analyticsService";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, DollarSign, Users, Mail } from "lucide-react";

export default function Analytics() {
  // Fetch dashboard stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: () => analyticsService.getDashboardStats(),
  });

  // Fetch reminder performance
  const { data: reminderPerf } = useQuery({
    queryKey: ["reminderPerformance"],
    queryFn: () => analyticsService.getReminderPerformance(),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const statsData = stats?.data || {};
  const reminderData = reminderPerf?.data || {};

  // Prepare chart data
  const invoiceStatusData = [
    { name: "Draft", value: statsData.draftInvoices || 0, color: "#94a3b8" },
    { name: "Sent", value: statsData.sentInvoices || 0, color: "#3b82f6" },
    { name: "Paid", value: statsData.paidInvoices || 0, color: "#10b981" },
    {
      name: "Overdue",
      value: statsData.overdueInvoices || 0,
      color: "#ef4444",
    },
  ];

  const reminderTypeData = [
    {
      name: "Before Due",
      count: reminderData.remindersByType?.before_due || 0,
    },
    {
      name: "3 Days Overdue",
      count: reminderData.remindersByType?.overdue_3 || 0,
    },
    {
      name: "7 Days Overdue",
      count: reminderData.remindersByType?.overdue_7 || 0,
    },
    {
      name: "Manual",
      count: reminderData.remindersByType?.manual || 0,
    },
  ];

  const paymentMethodData = [
    { name: "Bank Transfer", value: 45, color: "#3b82f6" },
    { name: "Credit Card", value: 30, color: "#10b981" },
    { name: "Cash", value: 15, color: "#f59e0b" },
    { name: "Other", value: 10, color: "#6b7280" },
  ];

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className=" mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Business insights and performance metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatter.format(statsData.totalRevenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total registered clients
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Reminders Sent
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reminderData.totalRemindersSent || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {reminderData.effectivenessRate || 0}% effectiveness
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Invoice Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Status Distribution</CardTitle>
            <CardDescription>
              Breakdown of invoices by current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={invoiceStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {invoiceStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Reminder Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Reminder Performance</CardTitle>
            <CardDescription>Number of reminders sent by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reminderTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>
              Distribution of payment methods used
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Revenue over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={[
                  { month: "Jul", revenue: 4000 },
                  { month: "Aug", revenue: 3000 },
                  { month: "Sep", revenue: 5000 },
                  { month: "Oct", revenue: 4500 },
                  { month: "Nov", revenue: 6000 },
                  { month: "Dec", revenue: 7000 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Average Invoice Value
              </p>
              <p className="text-2xl font-bold">
                {formatter.format(statsData.averageInvoiceValue || 0)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Average Payment Time
              </p>
              <p className="text-2xl font-bold">
                {reminderData.averagePaymentTime || 0} days
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Payments After Reminder
              </p>
              <p className="text-2xl font-bold">
                {reminderData.paymentsAfterReminder || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
