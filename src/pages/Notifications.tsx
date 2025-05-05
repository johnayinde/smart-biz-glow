
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCheck, FileClock, FileWarning, RefreshCw, UserPlus } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Notification {
  id: string;
  title: string;
  description: string;
  type: "payment" | "invoice" | "client" | "system";
  isRead: boolean;
  date: Date;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Invoice Paid",
    description: "Invoice #INV-2023-001 has been paid by John Smith.",
    type: "payment",
    isRead: false,
    date: new Date(2023, 4, 12)
  },
  {
    id: "2",
    title: "New Client",
    description: "Sarah Johnson has been added as a new client.",
    type: "client",
    isRead: false,
    date: new Date(2023, 4, 10)
  },
  {
    id: "3",
    title: "Invoice Overdue",
    description: "Invoice #INV-2023-005 for Acme Corp is now overdue.",
    type: "invoice",
    isRead: true,
    date: new Date(2023, 4, 5)
  },
  {
    id: "4",
    title: "System Update",
    description: "The system will be undergoing maintenance on May 20th.",
    type: "system",
    isRead: true,
    date: new Date(2023, 4, 1)
  },
  {
    id: "5",
    title: "Payment Reminder",
    description: "Invoice #INV-2023-008 is due in 2 days.",
    type: "payment",
    isRead: true,
    date: new Date(2023, 3, 28)
  }
];

const NotificationIcon = ({ type }: { type: Notification["type"] }) => {
  switch (type) {
    case "payment":
      return <CheckCheck className="h-5 w-5 text-green-500" />;
    case "invoice":
      return <FileWarning className="h-5 w-5 text-amber-500" />;
    case "client":
      return <UserPlus className="h-5 w-5 text-blue-500" />;
    case "system":
      return <FileClock className="h-5 w-5 text-purple-500" />;
  }
};

const formatDate = (date: Date) => {
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return "Today";
  } else if (diffInDays === 1) {
    return "Yesterday";
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric"
    });
  }
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({
        ...notification,
        isRead: true
      }))
    );
  };
  
  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground mt-1">
            You have {unreadCount} unread {unreadCount === 1 ? "notification" : "notifications"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark all as read
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
          <CardDescription>Your recent notifications and alerts</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div className={`flex items-start gap-4 p-4 ${notification.isRead ? "" : "bg-muted/40"}`}>
                    <div className="mt-1">
                      <NotificationIcon type={notification.type} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{notification.title}</h4>
                        <div className="flex items-center gap-2">
                          {!notification.isRead && (
                            <Badge variant="outline" className="bg-primary/10 text-primary">New</Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatDate(notification.date)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                      {!notification.isRead && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mt-2 h-7 px-2 text-xs" 
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                  {index < notifications.length - 1 && <Separator />}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">No notifications to display</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="justify-between border-t p-4 px-6">
          <p className="text-sm text-muted-foreground">
            Showing {notifications.length} notifications
          </p>
          <Button variant="outline" size="sm">View All</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Notifications;
