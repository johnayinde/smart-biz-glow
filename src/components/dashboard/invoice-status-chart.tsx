
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Invoice } from "@/services/mockData";
import { useEffect, useState } from "react";

interface InvoiceStatusChartProps {
  invoices: Invoice[];
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

export function InvoiceStatusChart({ invoices }: InvoiceStatusChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Count invoices by status
    const statusCounts: Record<string, number> = {};
    const statuses = ["paid", "pending", "overdue", "draft"];
    const statusColors = {
      paid: "#00C48C",     // Green
      pending: "#FFB800",  // Yellow
      overdue: "#FF5724",  // Red
      draft: "#718096"     // Gray
    };

    // Initialize counts to zero
    statuses.forEach(status => {
      statusCounts[status] = 0;
    });

    // Count invoices by status
    invoices.forEach(invoice => {
      statusCounts[invoice.status] += 1;
    });

    // Format data for chart
    const data = statuses.map(status => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: statusCounts[status],
      color: statusColors[status as keyof typeof statusColors]
    })).filter(item => item.value > 0);

    setChartData(data);
  }, [invoices]);

  // Determine chart size based on window width
  const chartSize = windowWidth < 768 ? 140 : 180;
  const innerRadius = windowWidth < 768 ? 40 : 60;
  const outerRadius = windowWidth < 768 ? 60 : 80;

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Invoice Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }) => 
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {chartData.map((entry, index) => (
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
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
