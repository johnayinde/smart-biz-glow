// src/components/invoices/ReminderConfigSection.tsx
import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Bell, Info, Clock, AlertCircle, Zap } from "lucide-react";

interface ReminderConfigSectionProps {
  form: any; // react-hook-form instance
}

const sequenceDetails = {
  default: {
    title: "Default",
    description: "Balanced reminder approach for standard clients",
    icon: Clock,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    schedule: [
      {
        label: "Friendly Reminder",
        timing: "1 day before due date",
        type: "before",
      },
      { label: "First Notice", timing: "3 days after due date", type: "after" },
      { label: "Final Notice", timing: "7 days after due date", type: "after" },
    ],
    bestFor: "Most situations - maintains professional relationship",
  },
  aggressive: {
    title: "Aggressive",
    description: "More frequent reminders for time-sensitive payments",
    icon: Zap,
    iconColor: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    schedule: [
      {
        label: "Early Reminder",
        timing: "2 days before due date",
        type: "before",
      },
      {
        label: "Overdue Notice",
        timing: "1 day after due date",
        type: "after",
      },
      {
        label: "Urgent Notice",
        timing: "3 days after due date",
        type: "after",
      },
    ],
    bestFor: "High-value invoices or clients with payment delays",
  },
  gentle: {
    title: "Gentle",
    description: "Fewer, more spaced-out reminders for trusted clients",
    icon: Bell,
    iconColor: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    schedule: [
      {
        label: "Advance Notice",
        timing: "3 days before due date",
        type: "before",
      },
      {
        label: "Polite Reminder",
        timing: "7 days after due date",
        type: "after",
      },
      { label: "Follow-up", timing: "14 days after due date", type: "after" },
    ],
    bestFor: "Long-term clients or established business relationships",
  },
};

export const ReminderConfigSection: React.FC<ReminderConfigSectionProps> = ({
  form,
}) => {
  const remindersEnabled = form.watch("reminderConfig.enabled");
  const sequenceType = form.watch("reminderConfig.sequenceType") || "default";

  const currentSequence =
    sequenceDetails[sequenceType as keyof typeof sequenceDetails];
  const SequenceIcon = currentSequence.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Payment Reminders
        </CardTitle>
        <CardDescription>
          Automatically send payment reminders to clients when invoices are
          overdue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Toggle */}
        <FormField
          control={form.control}
          name="reminderConfig.enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Enable Automatic Reminders
                </FormLabel>
                <FormDescription>
                  Send automated email reminders for unpaid invoices
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Reminder Sequence Selection */}
        {remindersEnabled && (
          <>
            <FormField
              control={form.control}
              name="reminderConfig.sequenceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reminder Sequence</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reminder sequence" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(sequenceDetails).map(([key, details]) => {
                        const Icon = details.icon;
                        return (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <Icon
                                className={`h-4 w-4 ${details.iconColor}`}
                              />
                              <span>{details.title}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose how frequently reminders should be sent
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* Sequence Preview */}
            <div
              className={`rounded-lg border-2 p-4 ${currentSequence.bgColor}`}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className={`rounded-full p-2 bg-white dark:bg-gray-800`}>
                  <SequenceIcon
                    className={`h-5 w-5 ${currentSequence.iconColor}`}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">
                    {currentSequence.title} Sequence
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {currentSequence.description}
                  </p>
                </div>
              </div>

              {/* Schedule Timeline */}
              <div className="space-y-3">
                {currentSequence.schedule.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`rounded-full p-1.5 ${
                          item.type === "before"
                            ? "bg-blue-500"
                            : "bg-orange-500"
                        }`}
                      >
                        <div className="h-2 w-2 rounded-full bg-white" />
                      </div>
                      {index < currentSequence.schedule.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-600 my-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {item.label}
                        </span>
                        <Badge
                          variant={
                            item.type === "before" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {item.type === "before" ? "Before Due" : "Overdue"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.timing}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Best For Info */}
              <Alert className="mt-4 border-blue-200 dark:border-blue-800">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Best for:</strong> {currentSequence.bestFor}
                </AlertDescription>
              </Alert>
            </div>

            {/* Additional Info */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Reminders will automatically stop when the invoice is marked as
                paid or cancelled. You can also send manual reminders at any
                time from the invoice detail page.
              </AlertDescription>
            </Alert>
          </>
        )}
      </CardContent>
    </Card>
  );
};
