import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Check, X, AlertCircle, Send } from "lucide-react";
import { format } from "date-fns";

interface Reminder {
  _id: string;
  type: "before_due" | "overdue_3" | "overdue_7" | "manual";
  status: "scheduled" | "sent" | "failed" | "cancelled";
  scheduledFor: string;
  sentAt?: string;
  recipientEmail: string;
}

interface ReminderTimelineProps {
  reminders: Reminder[];
  invoiceStatus: string;
  onSendManual: () => void;
  onCancelReminders: () => void;
  isSending: boolean;
}

const reminderTypes = {
  before_due: {
    title: "Friendly Reminder",
    description: "1 day before due date",
    icon: Clock,
  },
  overdue_3: {
    title: "First Overdue Notice",
    description: "3 days after due date",
    icon: AlertCircle,
  },
  overdue_7: {
    title: "Final Notice",
    description: "7 days after due date",
    icon: AlertCircle,
  },
  manual: {
    title: "Manual Reminder",
    description: "Sent manually",
    icon: Send,
  },
};

const statusColors = {
  scheduled: "default",
  sent: "default",
  failed: "destructive",
  cancelled: "secondary",
} as const;

const statusIcons = {
  scheduled: Clock,
  sent: Check,
  failed: X,
  cancelled: X,
};

export function ReminderTimeline({
  reminders,
  invoiceStatus,
  onSendManual,
  onCancelReminders,
  isSending,
}: ReminderTimelineProps) {
  const sortedReminders = [...reminders].sort(
    (a, b) =>
      new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Automated Reminders</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Payment reminders are sent automatically
            </p>
          </div>
          <Badge variant={invoiceStatus === "paid" ? "default" : "secondary"}>
            {invoiceStatus === "paid" ? "Disabled (Paid)" : "Active"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timeline */}
        <div className="relative space-y-4">
          {/* Timeline line */}
          <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-border" />

          {sortedReminders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No reminders scheduled yet
            </div>
          ) : (
            sortedReminders.map((reminder, index) => {
              const config = reminderTypes[reminder.type];
              const StatusIcon = statusIcons[reminder.status];

              return (
                <div key={reminder._id} className="relative flex gap-4">
                  {/* Icon */}
                  <div
                    className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                      reminder.status === "sent"
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : reminder.status === "failed"
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : reminder.status === "cancelled"
                        ? "border-gray-400 bg-gray-50 dark:bg-gray-900/20"
                        : "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    }`}
                  >
                    <StatusIcon
                      className={`h-4 w-4 ${
                        reminder.status === "sent"
                          ? "text-green-600"
                          : reminder.status === "failed"
                          ? "text-red-600"
                          : reminder.status === "cancelled"
                          ? "text-gray-600"
                          : "text-blue-600"
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{config.title}</p>
                      <Badge variant={statusColors[reminder.status]}>
                        {reminder.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {config.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {reminder.status === "sent" && reminder.sentAt ? (
                        <span>
                          Sent{" "}
                          {format(
                            new Date(reminder.sentAt),
                            "MMM d, yyyy h:mm a"
                          )}
                        </span>
                      ) : (
                        <span>
                          Scheduled for{" "}
                          {format(
                            new Date(reminder.scheduledFor),
                            "MMM d, yyyy"
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Actions */}
        {invoiceStatus !== "paid" && (
          <div className="flex gap-2 pt-4 border-t">
            <Button
              onClick={onSendManual}
              disabled={isSending}
              size="sm"
              className="flex-1"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSending ? "Sending..." : "Send Reminder Now"}
            </Button>
            <Button
              onClick={onCancelReminders}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Disable Reminders
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
