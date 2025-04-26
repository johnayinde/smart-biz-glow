
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ActivityItem } from "@/services/mockData";
import { FileText, CreditCard, UserPlus, AlertOctagon } from "lucide-react";

interface RecentActivityProps {
  activities: ActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "invoice":
        return <FileText className="h-4 w-4" />;
      case "payment":
        return <CreditCard className="h-4 w-4" />;
      case "client":
        return <UserPlus className="h-4 w-4" />;
      default:
        return <AlertOctagon className="h-4 w-4" />;
    }
  };

  const getIconClass = (type: ActivityItem["type"]) => {
    switch (type) {
      case "invoice":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400";
      case "payment":
        return "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400";
      case "client":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <div className={`mr-3 flex h-8 w-8 items-center justify-center rounded-full ${getIconClass(activity.type)}`}>
                {getIcon(activity.type)}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.description}
                </p>
                <div className="flex items-center pt-1">
                  <time className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                  </time>
                  {activity.amount && (
                    <>
                      <span className="mx-1 text-xs text-muted-foreground">•</span>
                      <span className="text-xs font-medium">
                        ${activity.amount.toLocaleString()}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
