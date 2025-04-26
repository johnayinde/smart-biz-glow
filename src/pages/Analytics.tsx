
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Cell,
  Line, 
  LineChart, 
  Pie,
  PieChart,
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { Download } from "lucide-react";
import { useState } from "react";

// Mock data for analytics
const revenueData = [
  { month: 'Jan', revenue: 2500 },
  { month: 'Feb', revenue: 3200 },
  { month: 'Mar', revenue: 4100 },
  { month: 'Apr', revenue: 3800 },
  { month: 'May', revenue: 4700 },
  { month: 'Jun', revenue: 4300 },
];

const clientsData = [
  { month: 'Jan', clients: 2 },
  { month: 'Feb', clients: 3 },
  { month: 'Mar', clients: 3 },
  { month: 'Apr', clients: 4 },
  { month: 'May', clients: 5 },
  { month: 'Jun', clients: 5 },
];

const invoiceStatusData = [
  { name: 'Paid', value: 42, color: '#00C48C' },
  { name: 'Pending', value: 22, color: '#FFB800' },
  { name: 'Overdue', value: 15, color: '#FF5724' },
  { name: 'Draft', value: 21, color: '#718096' },
];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("6m");
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <div className="flex items-center gap-2">
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Your revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={revenueData}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" />
                  <YAxis 
                    tickFormatter={(value) => `$${value}`} 
                    width={80} 
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Revenue']} 
                    contentStyle={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    name="Revenue" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2} 
                    dot={{ strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client Growth</CardTitle>
            <CardDescription>Number of active clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={clientsData}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} width={40} />
                  <Tooltip 
                    formatter={(value) => [`${value}`, 'Clients']} 
                    contentStyle={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                  <Bar 
                    dataKey="clients" 
                    name="Clients" 
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Status Distribution</CardTitle>
            <CardDescription>Breakdown of your invoice statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={invoiceStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => 
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {invoiceStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} invoices`, `Status`]} 
                    contentStyle={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key business performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex flex-col space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Average Invoice Value</span>
                  <span className="font-medium">$2,880</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-primary" style={{ width: "72%" }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Target: $4,000</span>
                  <span>72%</span>
                </div>
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Collection Rate</span>
                  <span className="font-medium">68%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-primary" style={{ width: "68%" }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Target: 90%</span>
                  <span>68%</span>
                </div>
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Client Retention</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-primary" style={{ width: "85%" }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Target: 95%</span>
                  <span>85%</span>
                </div>
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Invoice Creation Time</span>
                  <span className="font-medium">10 mins</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-primary" style={{ width: "60%" }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Target: 5 mins</span>
                  <span>60%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
