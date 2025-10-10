// src/components/reminders/reminder-timeline.tsx
// Enhanced version - combines your existing code with additional features

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Clock,
  Check,
  X,
  AlertCircle,
  Send,
  Mail,
  Info,
  RotateCcw,
} from "lucide-react";
import { format } from "date-fns";
import reminderService from "@/services/reminderService";

type ReminderType = "before_due" | "overdue_3" | "overdue_7" | "manual";
type ReminderStatus = "scheduled" | "sent" | "failed" | "cancelled";

import type { Reminder as ServiceReminder } from "@/services/reminderService";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "../ui/alert";

interface Reminder extends ServiceReminder {
  // Extend the Reminder type from reminderService
}

interface ReminderTimelineProps {
  reminders: Reminder[];
  invoiceStatus: string;
  dueDate?: string; // NEW: For calculating expected dates
  reminderConfig?: {
    // NEW: Show reminder configuration
    enabled: boolean;
    sequenceType?: "default" | "aggressive" | "gentle";
    remindersSent?: number;
    nextReminderDate?: string;
  };
  onSendManual: () => void;
  onCancelReminders: () => void;
  onRetryReminder?: (reminderId: string) => void; // ← Make sure this is included
  isSending: boolean;
  isLoading?: boolean;
}

const reminderConfig = {
  before_due: {
    title: "Friendly Reminder",
    description: "1 day before due date",
    icon: Clock,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-500",
  },
  overdue_3: {
    title: "First Overdue Notice",
    description: "3 days after due date",
    icon: AlertCircle,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-500",
  },
  overdue_7: {
    title: "Final Notice",
    description: "7 days after due date",
    icon: AlertCircle,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-500",
  },
  manual: {
    title: "Manual Reminder",
    description: "Sent manually by you",
    icon: Send,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-500",
  },
};

const statusConfig = {
  scheduled: {
    icon: Clock,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-500",
    badge: "default" as const,
    label: "Scheduled",
  },
  sent: {
    icon: Check,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-500",
    badge: "default" as const,
    label: "Sent",
  },
  failed: {
    icon: X,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-500",
    badge: "destructive" as const,
    label: "Failed",
  },
  cancelled: {
    icon: X,
    color: "text-gray-600",
    bgColor: "bg-gray-50 dark:bg-gray-900/20",
    borderColor: "border-gray-400",
    badge: "secondary" as const,
    label: "Cancelled",
  },
};

export function ReminderTimeline({
  reminders,
  invoiceStatus,
  dueDate,
  reminderConfig: config,
  onSendManual,
  onCancelReminders,
  onRetryReminder,
  isSending,
  isLoading = false,
}: ReminderTimelineProps) {
  const sortedReminders = [...reminders].sort(
    (a, b) =>
      new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
  );

  const hasActiveReminders = sortedReminders.some(
    (r) => r.status === "scheduled"
  );

  const isInvoicePaid = invoiceStatus === "paid";

  // NEW: Calculate expected reminder dates if no reminders exist yet
  const expectedDates =
    dueDate && sortedReminders.length === 0
      ? reminderService.calculateReminderDates(
          new Date(dueDate),
          config?.sequenceType || "default"
        )
      : [];

  // Helper function to check if retry is available
  const canRetryReminder = (reminder: Reminder) => {
    return reminderService.canRetry(reminder);
  };

  const getRemainingRetries = (reminder: Reminder) => {
    return reminderService.getRemainingRetries(reminder);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Automated Reminders</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Payment reminders sent automatically
            </p>
          </div>
          <Badge
            variant={
              isInvoicePaid
                ? "default"
                : hasActiveReminders
                ? "default"
                : "secondary"
            }
          >
            {isInvoicePaid
              ? "Completed"
              : hasActiveReminders
              ? "Active"
              : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* NEW: Reminder Stats */}
        {config && (config.remindersSent! > 0 || config.nextReminderDate) && (
          <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 text-sm">
            <Info className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              {config.remindersSent! > 0 && (
                <span className="text-muted-foreground">
                  <strong className="text-foreground">
                    {config.remindersSent}
                  </strong>{" "}
                  reminder
                  {config.remindersSent !== 1 ? "s" : ""} sent
                </span>
              )}
              {config.remindersSent! > 0 && config.nextReminderDate && (
                <span className="text-muted-foreground"> • </span>
              )}
              {config.nextReminderDate && !isInvoicePaid && (
                <span className="text-muted-foreground">
                  Next on{" "}
                  <strong className="text-foreground">
                    {format(new Date(config.nextReminderDate), "MMM d")}
                  </strong>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="relative space-y-4">
          {/* Timeline line */}
          {(sortedReminders.length > 0 || expectedDates.length > 0) && (
            <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-border" />
          )}

          {sortedReminders.length === 0 && expectedDates.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No reminders scheduled yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Reminders will be scheduled when invoice is sent
              </p>
            </div>
          ) : sortedReminders.length === 0 && expectedDates.length > 0 ? (
            // NEW: Show expected reminder dates before invoice is sent
            <>
              <p className="text-sm text-muted-foreground mb-4">
                These reminders will be scheduled when you send the invoice:
              </p>
              {expectedDates.map((expected, index) => (
                <div key={index} className="relative flex gap-4">
                  <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30 bg-muted/30">
                    <Clock className="h-4 w-4 text-muted-foreground/50" />
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="space-y-1">
                      <p className="font-medium text-sm text-muted-foreground">
                        {reminderService.getReminderTypeLabel(
                          expected.type as any
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Will be sent on {format(expected.date, "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            sortedReminders.map((reminder) => {
              const typeConfig = reminderConfig[reminder.type];
              const statusInfo = statusConfig[reminder.status];
              const StatusIcon = statusInfo.icon;

              const reminderInfo = reminderConfig[reminder.type];
              const ReminderIcon = reminderInfo.icon;

              return (
                <div key={reminder.id} className="relative flex gap-4">
                  {/* Status Icon */}
                  <div
                    className={cn(
                      "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2",
                      statusInfo.bgColor,
                      statusInfo.borderColor
                    )}
                  >
                    <StatusIcon className={cn("h-5 w-5", statusInfo.color)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-2 pb-8">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">
                            {reminderInfo.title}
                          </p>
                          <Badge variant={statusInfo.badge}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {reminderInfo.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {reminder.sentAt
                            ? `Sent ${format(
                                new Date(reminder.sentAt),
                                "MMM d 'at' h:mm a"
                              )}`
                            : `Scheduled for ${format(
                                new Date(reminder.scheduledFor),
                                "MMM d 'at' h:mm a"
                              )}`}
                        </p>

                        {/* Show retry count if failed */}
                        {reminder.status === "failed" &&
                          reminder.retryCount > 0 && (
                            <p className="text-xs text-orange-600">
                              Retry attempt {reminder.retryCount}/3
                            </p>
                          )}

                        {/* Failure reason */}
                        {/* {reminder.status === "failed" &&
                          reminder.failureReason && (
                            <Alert variant="destructive" className="mt-2">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription className="text-xs">
                                {reminder.failureReason}
                              </AlertDescription>
                            </Alert>
                          )} */}
                      </div>
                    </div>

                    {/* Retry Button for Failed Reminders */}
                    {reminder.status === "failed" &&
                      onRetryReminder &&
                      canRetryReminder(reminder) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onRetryReminder(reminder.id)}
                          disabled={isSending}
                          className="mt-2"
                        >
                          <RotateCcw className="mr-2 h-3 w-3" />
                          Retry ({getRemainingRetries(reminder)} attempts left)
                        </Button>
                      )}

                    {/* Max retries reached message */}
                    {reminder.status === "failed" &&
                      !canRetryReminder(reminder) && (
                        <Alert variant="destructive" className="mt-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">
                            Maximum retry attempts reached. Please contact
                            support or try manual reminder.
                          </AlertDescription>
                        </Alert>
                      )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Actions */}
        {!isInvoicePaid && (
          <>
            <div className="pt-2 space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={onSendManual}
                disabled={isSending}
              >
                <Send className="mr-2 h-4 w-4" />
                {isSending ? "Sending..." : "Send Reminder Now"}
              </Button>
              {hasActiveReminders && (
                <Button
                  variant="ghost"
                  className="w-full text-destructive hover:text-destructive"
                  onClick={onCancelReminders}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel All Reminders
                </Button>
              )}
            </div>

            {/* Info */}
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> Reminders are sent automatically based on
                the invoice due date. Mark the invoice as paid to stop all
                reminders.
              </p>
            </div>
          </>
        )}

        {/* Paid invoice message */}
        {isInvoicePaid && (
          <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <p className="text-xs text-green-700 dark:text-green-400 font-medium">
                Invoice paid - All reminders have been cancelled
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
