// src/components/reminders/reminder-timeline.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Check,
  X,
  AlertCircle,
  Send,
  Mail,
  Info,
  RotateCcw,
  XCircle,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import reminderService from "@/services/reminderService";
import type { Reminder } from "@/services/reminderService";

interface ReminderTimelineProps {
  reminders: Reminder[];
  invoiceStatus: string;
  dueDate?: string;
  reminderConfig?: {
    enabled: boolean;
    sequenceType?: "default" | "aggressive" | "gentle";
    remindersSent?: number;
    nextReminderDate?: string;
  };
  onSendManual: () => void;
  onCancelReminders: () => void;
  onRetryReminder?: (reminderId: string) => void;
  isSending: boolean;
  isLoading?: boolean;
}

// Reminder type configurations
const reminderTypeConfig = {
  before_due: {
    label: "Friendly Reminder",
    description: "Before due date",
    icon: Mail,
    iconColor: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
    dotColor: "bg-blue-500",
  },
  first_overdue: {
    label: "First Overdue Notice",
    description: "Payment overdue",
    icon: AlertCircle,
    iconColor: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    borderColor: "border-orange-200 dark:border-orange-800",
    dotColor: "bg-orange-500",
  },
  second_overdue: {
    label: "Second Overdue Notice",
    description: "Still unpaid",
    icon: AlertCircle,
    iconColor: "text-orange-700 dark:text-orange-500",
    bgColor: "bg-orange-100 dark:bg-orange-950/40",
    borderColor: "border-orange-300 dark:border-orange-700",
    dotColor: "bg-orange-600",
  },
  final_notice: {
    label: "Final Notice",
    description: "Urgent action required",
    icon: AlertCircle,
    iconColor: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800",
    dotColor: "bg-red-500",
  },
  manual: {
    label: "Manual Reminder",
    description: "Sent manually",
    icon: Send,
    iconColor: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    borderColor: "border-purple-200 dark:border-purple-800",
    dotColor: "bg-purple-500",
  },
};

// Status configurations
const statusConfig = {
  scheduled: {
    badge: "default" as const,
    label: "Scheduled",
    icon: Clock,
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  sent: {
    badge: "default" as const,
    label: "Sent",
    icon: CheckCircle2,
    iconColor: "text-green-600 dark:text-green-400",
  },
  failed: {
    badge: "destructive" as const,
    label: "Failed",
    icon: XCircle,
    iconColor: "text-red-600 dark:text-red-400",
  },
  cancelled: {
    badge: "secondary" as const,
    label: "Cancelled",
    icon: X,
    iconColor: "text-gray-600 dark:text-gray-400",
  },
};

export function ReminderTimeline({
  reminders,
  invoiceStatus,
  dueDate,
  reminderConfig,
  onSendManual,
  onCancelReminders,
  onRetryReminder,
  isSending,
  isLoading = false,
}: ReminderTimelineProps) {
  const [expandedReminders, setExpandedReminders] = useState<Set<string>>(
    new Set()
  );

  // Sort reminders by scheduled date
  const sortedReminders = [...reminders].sort(
    (a, b) =>
      new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
  );

  const hasActiveReminders = sortedReminders.some(
    (r) => r.status === "scheduled"
  );
  const isInvoicePaid = invoiceStatus === "paid";
  const isInvoiceCancelled = invoiceStatus === "cancelled";

  // Calculate expected reminder dates if no reminders exist yet
  const expectedDates =
    dueDate && sortedReminders.length === 0
      ? reminderService.calculateReminderDates(
          new Date(dueDate),
          reminderConfig?.sequenceType || "default"
        )
      : [];

  const toggleReminderExpansion = (reminderId: string) => {
    setExpandedReminders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reminderId)) {
        newSet.delete(reminderId);
      } else {
        newSet.add(reminderId);
      }
      return newSet;
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
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
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Payment Reminders
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Automated reminders for this invoice
            </p>
          </div>
          <Badge
            variant={
              isInvoicePaid || isInvoiceCancelled
                ? "secondary"
                : hasActiveReminders
                ? "default"
                : "secondary"
            }
          >
            {isInvoicePaid
              ? "Completed"
              : isInvoiceCancelled
              ? "Cancelled"
              : hasActiveReminders
              ? "Active"
              : "Inactive"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Reminder Stats */}
        {reminderConfig &&
          (reminderConfig.remindersSent! > 0 ||
            reminderConfig.nextReminderDate) && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1 text-sm">
                {reminderConfig.remindersSent! > 0 && (
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">
                      {reminderConfig.remindersSent}
                    </strong>{" "}
                    reminder{reminderConfig.remindersSent !== 1 ? "s" : ""} sent
                  </span>
                )}
                {reminderConfig.remindersSent! > 0 &&
                  reminderConfig.nextReminderDate && (
                    <span className="text-muted-foreground"> • </span>
                  )}
                {reminderConfig.nextReminderDate && !isInvoicePaid && (
                  <span className="text-muted-foreground">
                    Next on{" "}
                    <strong className="text-foreground">
                      {format(
                        new Date(reminderConfig.nextReminderDate),
                        "MMM d, h:mm a"
                      )}
                    </strong>
                  </span>
                )}
              </div>
            </div>
          )}

        {/* Action Buttons */}
        {!isInvoicePaid && !isInvoiceCancelled && invoiceStatus !== "draft" && (
          <div className="flex gap-2">
            <Button
              onClick={onSendManual}
              disabled={isSending}
              size="sm"
              variant="outline"
              className="flex-1"
            >
              <Send className="mr-2 h-4 w-4" />
              {isSending ? "Sending..." : "Send Manual Reminder"}
            </Button>
            {hasActiveReminders && (
              <Button
                onClick={onCancelReminders}
                size="sm"
                variant="ghost"
                className="flex-1"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel Reminders
              </Button>
            )}
          </div>
        )}

        <Separator />

        {/* Timeline */}
        <div className="relative space-y-6">
          {/* Timeline line */}
          {(sortedReminders.length > 0 || expectedDates.length > 0) && (
            <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-border" />
          )}

          {/* Empty state */}
          {sortedReminders.length === 0 && expectedDates.length === 0 && (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                No reminders scheduled
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Reminders will be scheduled when the invoice is sent
              </p>
            </div>
          )}

          {/* Expected reminders (before invoice is sent) */}
          {sortedReminders.length === 0 && expectedDates.length > 0 && (
            <>
              <Alert>
                <Calendar className="h-4 w-4" />
                <AlertDescription>
                  These reminders will be scheduled when you send the invoice
                </AlertDescription>
              </Alert>
              {expectedDates.map((expected, index) => {
                const typeConfig =
                  reminderTypeConfig[
                    expected.type as keyof typeof reminderTypeConfig
                  ];
                const TypeIcon = typeConfig.icon;

                return (
                  <div key={index} className="relative flex gap-4">
                    {/* Dot */}
                    <div
                      className={cn(
                        "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed flex-shrink-0",
                        "bg-muted/50 border-muted-foreground/30"
                      )}
                    >
                      <TypeIcon className="h-5 w-5 text-muted-foreground/50" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-2">
                      <div className="space-y-1">
                        <p className="font-medium text-sm text-muted-foreground">
                          {typeConfig.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Scheduled for {format(expected.date, "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* Actual reminders */}
          {sortedReminders.map((reminder, index) => {
            const typeConfig =
              reminderTypeConfig[
                reminder.type as keyof typeof reminderTypeConfig
              ];
            const statusInfo =
              statusConfig[reminder.status as keyof typeof statusConfig];
            // const TypeIcon = typeConfig.icon;
            const StatusIcon = statusInfo.icon;
            const isExpanded = expandedReminders.has(reminder.id);
            const canRetry = reminderService.canRetry(reminder);

            return (
              <div key={reminder.id} className="relative flex gap-4">
                {/* Status Dot */}
                <div
                  className={cn(
                    "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 flex-shrink-0",
                    typeConfig?.bgColor,
                    typeConfig?.borderColor
                  )}
                >
                  <StatusIcon
                    className={cn("h-5 w-5", statusInfo?.iconColor)}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2 pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm">
                          {typeConfig?.label}
                        </p>
                        <Badge variant={statusInfo?.badge} className="text-xs">
                          {statusInfo?.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {typeConfig?.description}
                      </p>
                    </div>
                  </div>

                  {/* Timing info */}
                  <div className="space-y-1 text-xs text-muted-foreground">
                    {reminder.status === "scheduled" && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          Scheduled for{" "}
                          {format(
                            new Date(reminder.scheduledFor),
                            "MMM d, h:mm a"
                          )}
                        </span>
                      </div>
                    )}
                    {reminder.status === "sent" && reminder.sentAt && (
                      <div className="flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        <span>
                          Sent{" "}
                          {formatDistanceToNow(new Date(reminder.sentAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    )}
                    {reminder.status === "failed" && (
                      <div className="flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        <span>Failed to send</span>
                      </div>
                    )}
                    {reminder.status === "cancelled" &&
                      reminder.cancelledAt && (
                        <div className="flex items-center gap-1">
                          <X className="h-3 w-3" />
                          <span>
                            Cancelled{" "}
                            {formatDistanceToNow(
                              new Date(reminder.cancelledAt),
                              {
                                addSuffix: true,
                              }
                            )}
                          </span>
                        </div>
                      )}
                  </div>

                  {/* Email details (expandable) */}
                  {reminder.status === "sent" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => toggleReminderExpansion(reminder.id)}
                    >
                      {isExpanded ? "Hide details" : "Show details"}
                    </Button>
                  )}

                  {isExpanded && (
                    <div
                      className={cn(
                        "mt-2 p-3 rounded-lg border space-y-2",
                        typeConfig.bgColor,
                        typeConfig.borderColor
                      )}
                    >
                      <div className="space-y-1">
                        <p className="text-xs font-medium">Email Details</p>
                        <p className="text-xs text-muted-foreground">
                          <strong>To:</strong> {reminder.recipientEmail}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <strong>Subject:</strong> {reminder.subject}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Retry button for failed reminders */}
                  {reminder.status === "failed" &&
                    canRetry &&
                    onRetryReminder && (
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRetryReminder(reminder.id)}
                          className="text-xs h-7"
                        >
                          <RotateCcw className="mr-1 h-3 w-3" />
                          Retry ({reminderService.getRemainingRetries(
                            reminder
                          )}{" "}
                          left)
                        </Button>
                        {reminder.failureReason && (
                          <p className="text-xs text-red-600 dark:text-red-400">
                            {reminder.failureReason}
                          </p>
                        )}
                      </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Info alert at bottom */}
        {!isInvoicePaid &&
          !isInvoiceCancelled &&
          sortedReminders.length > 0 && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Reminders automatically stop when the invoice is marked as paid.
                You can also send manual reminders or cancel all scheduled
                reminders anytime.
              </AlertDescription>
            </Alert>
          )}
      </CardContent>
    </Card>
  );
}
