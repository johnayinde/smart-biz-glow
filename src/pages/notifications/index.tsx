import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Mail, Settings, Check, X, Trash2 } from "lucide-react";

const mockNotifications = [
  {
    id: "1",
    type: "invoice_paid",
    title: "Invoice Payment Received",
    message: "Payment of $1,250.00 received for Invoice INV-001",
    timestamp: "2024-01-15T10:30:00Z",
    read: false,
  },
  {
    id: "2",
    type: "invoice_overdue",
    title: "Invoice Overdue",
    message: "Invoice INV-002 is now 5 days overdue",
    timestamp: "2024-01-14T15:20:00Z",
    read: false,
  },
  {
    id: "3",
    type: "client_added",
    title: "New Client Added",
    message: "Acme Corporation has been added to your client list",
    timestamp: "2024-01-13T09:15:00Z",
    read: true,
  },
];

const notificationSettings = {
  email_invoice_sent: true,
  email_payment_received: true,
  email_invoice_overdue: true,
  push_invoice_sent: false,
  push_payment_received: true,
  push_invoice_overdue: true,
  weekly_reports: true,
  monthly_summaries: true,
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [settings, setSettings] = useState(notificationSettings);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bell className="h-8 w-8" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount} new</Badge>
            )}
          </h1>
          <p className="text-muted-foreground">
            Stay updated with your business activities and manage notification preferences.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            <Check className="h-4 w-4 mr-2" />
            Mark All as Read
          </Button>
        )}
      </div>

      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notifications">
            Notifications
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">{unreadCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>
                Your latest business notifications and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border rounded-lg ${
                        !notification.read ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{notification.title}</h3>
                            {!notification.read && (
                              <Badge variant="secondary" className="text-xs">New</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(notification.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          {!notification.read && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No notifications</h3>
                  <p className="text-muted-foreground">
                    You're all caught up! New notifications will appear here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Notifications
                </CardTitle>
                <CardDescription>
                  Configure when to receive email notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-invoice-sent" className="flex-1">
                    Invoice sent to client
                  </Label>
                  <Switch
                    id="email-invoice-sent"
                    checked={settings.email_invoice_sent}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, email_invoice_sent: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-payment-received" className="flex-1">
                    Payment received
                  </Label>
                  <Switch
                    id="email-payment-received"
                    checked={settings.email_payment_received}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, email_payment_received: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-invoice-overdue" className="flex-1">
                    Invoice overdue
                  </Label>
                  <Switch
                    id="email-invoice-overdue"
                    checked={settings.email_invoice_overdue}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, email_invoice_overdue: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Push Notifications
                </CardTitle>
                <CardDescription>
                  Configure browser push notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-invoice-sent" className="flex-1">
                    Invoice sent to client
                  </Label>
                  <Switch
                    id="push-invoice-sent"
                    checked={settings.push_invoice_sent}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, push_invoice_sent: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-payment-received" className="flex-1">
                    Payment received
                  </Label>
                  <Switch
                    id="push-payment-received"
                    checked={settings.push_payment_received}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, push_payment_received: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-invoice-overdue" className="flex-1">
                    Invoice overdue
                  </Label>
                  <Switch
                    id="push-invoice-overdue"
                    checked={settings.push_invoice_overdue}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, push_invoice_overdue: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Report Settings
                </CardTitle>
                <CardDescription>
                  Configure periodic reports and summaries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="weekly-reports" className="flex-1">
                    Weekly business reports
                  </Label>
                  <Switch
                    id="weekly-reports"
                    checked={settings.weekly_reports}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, weekly_reports: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="monthly-summaries" className="flex-1">
                    Monthly financial summaries
                  </Label>
                  <Switch
                    id="monthly-summaries"
                    checked={settings.monthly_summaries}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, monthly_summaries: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button>Save Settings</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}