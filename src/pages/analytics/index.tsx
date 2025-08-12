import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download } from "lucide-react";
import { useState } from "react";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("6m");
  
  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 4000, expenses: 2400, profit: 1600 },
    { month: 'Feb', revenue: 3000, expenses: 1398, profit: 1602 },
    { month: 'Mar', revenue: 2000, expenses: 9800, profit: -7800 },
    { month: 'Apr', revenue: 2780, expenses: 3908, profit: -1128 },
    { month: 'May', revenue: 1890, expenses: 4800, profit: -2910 },
    { month: 'Jun', revenue: 2390, expenses: 3800, profit: -1410 },
  ];

  const clientGrowthData = [
    { month: 'Jan', newClients: 5, totalClients: 25 },
    { month: 'Feb', newClients: 8, totalClients: 33 },
    { month: 'Mar', newClients: 12, totalClients: 45 },
    { month: 'Apr', newClients: 6, totalClients: 51 },
    { month: 'May', newClients: 9, totalClients: 60 },
    { month: 'Jun', newClients: 15, totalClients: 75 },
  ];

  const invoiceStatusData = [
    { name: 'Paid', value: 45, color: '#22c55e' },
    { name: 'Pending', value: 25, color: '#f59e0b' },
    { name: 'Overdue', value: 20, color: '#ef4444' },
    { name: 'Draft', value: 10, color: '#6b7280' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>
            Monthly revenue, expenses, and profit trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-muted-foreground" />
              <YAxis className="text-muted-foreground" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px' 
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="Revenue"
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="hsl(var(--destructive))" 
                strokeWidth={2}
                name="Expenses"
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2}
                name="Profit"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Client Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Client Growth</CardTitle>
            <CardDescription>
              New clients acquired each month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clientGrowthData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px' 
                  }} 
                />
                <Bar 
                  dataKey="newClients" 
                  fill="hsl(var(--primary))" 
                  name="New Clients"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Invoice Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Status Distribution</CardTitle>
            <CardDescription>
              Current status of all invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={invoiceStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {invoiceStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px' 
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Key Performance Metrics</CardTitle>
          <CardDescription>
            Important business indicators for the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Average Invoice Value</p>
              <p className="text-2xl font-bold">$1,245</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground">75% of target</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Payment Collection Rate</p>
              <p className="text-2xl font-bold">87%</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-chart-2 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground">Above industry average</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Client Retention</p>
              <p className="text-2xl font-bold">94%</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-chart-3 h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground">Excellent retention</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Avg. Invoice Creation Time</p>
              <p className="text-2xl font-bold">5.2 min</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-chart-4 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground">35% faster than last month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;