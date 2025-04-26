
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Insight } from "@/services/mockData";
import { BrainCircuit, AlertCircle, Info, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface InsightCardProps {
  insight: Insight;
}

export function InsightCard({ insight }: InsightCardProps) {
  // Icon based on insight type
  const getIcon = () => {
    switch (insight.type) {
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <BrainCircuit className="h-5 w-5" />;
    }
  };

  // Category badge color
  const getCategoryColor = () => {
    switch (insight.category) {
      case "cashflow":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "clients":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
      case "growth":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "operational":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getIcon()}
            <CardTitle className="text-base">{insight.title}</CardTitle>
          </div>
          <Badge variant="outline" className={getCategoryColor()}>
            {insight.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{insight.description}</p>
        
        {insight.metrics && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {insight.metrics.map((metric, index) => (
              <div key={index} className="rounded-md bg-muted p-2">
                <p className="text-xs font-medium">{metric.label}</p>
                <p className="text-sm font-bold">{metric.value}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-1">
        <div className="flex items-center justify-between w-full">
          <p className="text-xs text-muted-foreground">
            Generated on {new Date(insight.date).toLocaleDateString()}
          </p>
          <Button variant="ghost" size="sm" className="text-xs">
            Take Action
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
