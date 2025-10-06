// src/components/payments/record-payment-dialog.tsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { invoiceService } from "@/services/invoiceService";
import { Skeleton } from "@/components/ui/skeleton";

const paymentSchema = z.object({
  invoiceId: z.string().min(1, "Please select an invoice"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Amount must be greater than 0"
    ),
  method: z.enum(
    ["bank_transfer", "credit_card", "cash", "check", "paypal", "other"],
    {
      required_error: "Please select a payment method",
    }
  ),
  paymentDate: z.date({
    required_error: "Payment date is required",
  }),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface RecordPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PaymentFormData) => void;
  isSubmitting?: boolean;
  preSelectedInvoiceId?: string;
}

const paymentMethods = [
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "credit_card", label: "Credit Card" },
  { value: "cash", label: "Cash" },
  { value: "check", label: "Check" },
  { value: "paypal", label: "PayPal" },
  { value: "other", label: "Other" },
];

export function RecordPaymentDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
  preSelectedInvoiceId,
}: RecordPaymentDialogProps) {
  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      invoiceId: preSelectedInvoiceId || "",
      amount: "",
      method: undefined,
      paymentDate: new Date(),
      reference: "",
      notes: "",
    },
  });

  // Fetch unpaid invoices
  const { data: invoicesData, isLoading: invoicesLoading } = useQuery({
    queryKey: ["invoices", "unpaid"],
    queryFn: () =>
      invoiceService.getInvoices({
        status: "sent",
        limit: 100,
      }),
    enabled: open,
  });

  const { data: overdueInvoicesData } = useQuery({
    queryKey: ["invoices", "overdue"],
    queryFn: () =>
      invoiceService.getInvoices({
        status: "overdue",
        limit: 100,
      }),
    enabled: open,
  });

  // Combine sent and overdue invoices
  const unpaidInvoices = [
    ...(invoicesData?.data?.invoices || []),
    ...(overdueInvoicesData?.data?.invoices || []),
  ];

  // Watch selected invoice to auto-fill amount
  const selectedInvoiceId = form.watch("invoiceId");
  const selectedInvoice = unpaidInvoices.find(
    (inv) => inv._id === selectedInvoiceId
  );

  // Auto-fill amount when invoice is selected
  useEffect(() => {
    if (selectedInvoice && !form.getValues("amount")) {
      form.setValue("amount", selectedInvoice.total.toString());
    }
  }, [selectedInvoice, form]);

  // Set pre-selected invoice
  useEffect(() => {
    if (preSelectedInvoiceId && open) {
      form.setValue("invoiceId", preSelectedInvoiceId);
    }
  }, [preSelectedInvoiceId, open, form]);

  const handleSubmit = (data: PaymentFormData) => {
    onSubmit(data);
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>
            Record a payment received from a client for an invoice
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Invoice Selection */}
            <FormField
              control={form.control}
              name="invoiceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!!preSelectedInvoiceId || invoicesLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an invoice" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {invoicesLoading ? (
                        <div className="p-2">
                          <Skeleton className="h-8 w-full" />
                        </div>
                      ) : unpaidInvoices.length === 0 ? (
                        <div className="p-4 text-sm text-muted-foreground text-center">
                          No unpaid invoices found
                        </div>
                      ) : (
                        unpaidInvoices.map((invoice) => (
                          <SelectItem key={invoice._id} value={invoice._id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{invoice.invoiceNumber}</span>
                              <span className="text-muted-foreground ml-4">
                                {invoice.client?.name || invoice.clientId}
                              </span>
                              <span className="font-medium ml-4">
                                {formatter.format(invoice.total)}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Selected Invoice Info */}
            {selectedInvoice && (
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Client:</span>
                    <p className="font-medium">
                      {selectedInvoice.client?.name || "Unknown"}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Due Date:</span>
                    <p className="font-medium">
                      {format(new Date(selectedInvoice.dueDate), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Amount:</span>
                    <p className="font-medium text-lg">
                      {formatter.format(selectedInvoice.total)}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <p className="font-medium capitalize">
                      {selectedInvoice.status}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {/* Amount */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>Can be partial payment</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Date */}
              <FormField
                control={form.control}
                name="paymentDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Payment Date *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Payment Method */}
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Reference */}
              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., TXN-123456" {...field} />
                    </FormControl>
                    <FormDescription>
                      Transaction or check number
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes about this payment..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Actions */}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !selectedInvoice}>
                {isSubmitting ? "Recording..." : "Record Payment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
