// frontend/src/components/invoices/InvoiceForm.tsx
// Add this section to your existing invoice form

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { Bell, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Add to your invoice schema
const invoiceSchema = z.object({
  // ... existing fields
  reminderConfig: z.object({
    enabled: z.boolean().default(true),
    sequenceType: z
      .enum(["default", "aggressive", "gentle"])
      .default("default"),
  }),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

// Component for reminder configuration section
export const ReminderConfigSection: React.FC<{
  form: any; // your react-hook-form instance
}> = ({ form }) => {
  const remindersEnabled = form.watch("reminderConfig.enabled");
  const sequenceType = form.watch("reminderConfig.sequenceType");

  const sequenceDescriptions = {
    default: {
      title: "Default",
      description: "Balanced approach",
      schedule: [
        "1 day before due date",
        "3 days after due date",
        "7 days after due date",
      ],
    },
    aggressive: {
      title: "Aggressive",
      description: "More frequent reminders",
      schedule: [
        "1 day before due date",
        "1 day after due date",
        "3 days after due date",
      ],
    },
    gentle: {
      title: "Gentle",
      description: "Relaxed schedule",
      schedule: [
        "2 days before due date",
        "7 days after due date",
        "14 days after due date",
      ],
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Automated Payment Reminders
        </CardTitle>
        <CardDescription>
          Automatically send payment reminders to your client
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Toggle */}
        <FormField
          control={form.control}
          name="reminderConfig.enabled"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Enable Reminders</FormLabel>
                <FormDescription>
                  Automatically send payment reminders based on invoice due date
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

        {/* Sequence Type Selection */}
        {remindersEnabled && (
          <>
            <FormField
              control={form.control}
              name="reminderConfig.sequenceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reminder Schedule</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reminder schedule" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="default">
                        <div className="flex flex-col">
                          <span className="font-medium">Default</span>
                          <span className="text-xs text-muted-foreground">
                            Balanced approach
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="aggressive">
                        <div className="flex flex-col">
                          <span className="font-medium">Aggressive</span>
                          <span className="text-xs text-muted-foreground">
                            More frequent reminders
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="gentle">
                        <div className="flex flex-col">
                          <span className="font-medium">Gentle</span>
                          <span className="text-xs text-muted-foreground">
                            Relaxed schedule
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose how frequently reminders should be sent
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Schedule Preview */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">
                    {sequenceDescriptions[sequenceType || "default"].title}{" "}
                    Schedule:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {sequenceDescriptions[
                      sequenceType || "default"
                    ].schedule.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">
                    Reminders will be automatically cancelled if the invoice is
                    paid
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          </>
        )}

        {!remindersEnabled && (
          <Alert variant="default">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Automated reminders are disabled. You can still send manual
              reminders after creating the invoice.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
